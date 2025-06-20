import React, { useState, useEffect, useRef, useMemo } from "react";

const UrandomViewer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [updateCount, setUpdateCount] = useState(0);
  const [randomData, setRandomData] = useState<Uint8Array>(new Uint8Array(256));
  const intervalRef = useRef<number | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // 랜덤 바이트 생성
  const generateRandomBytes = (length: number): Uint8Array => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return bytes;
  };

  // 바이트를 hex 문자열로 변환
  const byteToHex = (byte: number): string => {
    return byte.toString(16).padStart(2, "0");
  };

  // ASCII 문자 변환 (출력 가능한 문자만)
  const byteToAscii = (byte: number): string => {
    return byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".";
  };

  // xxd 형식으로 출력 생성 (메모이제이션 적용)
  const xxdOutput = useMemo(() => {
    const bytes = randomData;
    const lines: React.ReactElement[] = [];

    for (let i = 0; i < bytes.length; i += 16) {
      // 주소 표시
      const address = i.toString(16).padStart(8, "0");

      // Hex 바이트들 (4바이트씩 그룹화)
      const hexBytes: React.ReactElement[] = [];
      const asciiChars: string[] = [];

      for (let j = 0; j < 16; j++) {
        if (i + j < bytes.length) {
          const byte = bytes[i + j];
          const hexByte = byteToHex(byte);

          hexBytes.push(
            <span key={j} className="hex-byte">
              {hexByte}
            </span>
          );

          // 4바이트마다 공간 추가
          if ((j + 1) % 4 === 0) {
            hexBytes.push(
              <span key={`space-${j}`} className="hex-space">
                {" "}
              </span>
            );
          }

          asciiChars.push(byteToAscii(byte));
        } else {
          hexBytes.push(
            <span key={j} className="hex-byte">
              {" "}
            </span>
          );
          if ((j + 1) % 4 === 0) {
            hexBytes.push(
              <span key={`space-${j}`} className="hex-space">
                {" "}
              </span>
            );
          }
          asciiChars.push(" ");
        }
      }

      lines.push(
        <div key={i} className="hex-line">
          <span className="address">{address}:</span>
          <span className="hex-section">{hexBytes}</span>
          <span className="ascii-section">{asciiChars.join("")}</span>
        </div>
      );
    }

    return lines;
  }, [randomData]);

  // 출력 업데이트
  const updateOutput = () => {
    if (!isRunning) return;

    const newData = generateRandomBytes(256);
    setRandomData(newData);
    setUpdateCount((prev) => prev + 1);
  };

  // 시작
  const start = () => {
    if (isRunning) return;

    setIsRunning(true);
    intervalRef.current = setInterval(updateOutput, 100); // 0.1초마다 업데이트
    updateOutput(); // 즉시 한 번 실행
  };

  // 정지
  const stop = () => {
    if (!isRunning) return;

    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 클리어
  const clear = () => {
    setRandomData(new Uint8Array(256));
    setUpdateCount(0);
  };

  // 명령어 복사
  const copyCommand = async () => {
    const command = 'watch -n 0.1 "xxd -l 256 -g 4 /dev/urandom"';
    try {
      await navigator.clipboard.writeText(command);
      alert("명령어가 클립보드에 복사되었습니다!");
    } catch {
      alert(`명령어: ${command}`);
    }
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        // 스페이스바로 시작/정지 토글
        e.preventDefault();
        if (isRunning) {
          stop();
        } else {
          start();
        }
      } else if (e.key === "c" || e.key === "C") {
        // C키로 클리어
        clear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning]);

  // 컴포넌트 마운트/언마운트 처리
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(updateOutput, 100);
      updateOutput();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className="demo-container fade-in">
      <h1 className="demo-title">🔀 xxd /dev/urandom 실시간 뷰어</h1>
      <div className="demo-subtitle">
        Unix/Linux의 랜덤 장치 파일을 실시간으로 시뮬레이션 (브라우저에서는
        crypto.getRandomValues 사용)
      </div>

      {/* 헤더 및 컨트롤 */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div
          style={{
            color: "#ffd700",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontFamily: "Courier New, monospace",
          }}
        >
          $ watch -n 0.1 "xxd -l 256 -g 4 /dev/urandom"
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          <button
            className={`btn ${isRunning ? "secondary" : ""}`}
            onClick={start}
            disabled={isRunning}
          >
            ▶️ 시작
          </button>
          <button
            className={`btn ${!isRunning ? "secondary" : ""}`}
            onClick={stop}
            disabled={!isRunning}
          >
            ⏸️ 정지
          </button>
          <button className="btn secondary" onClick={clear}>
            🗑️ 클리어
          </button>
          <button className="btn secondary" onClick={copyCommand}>
            📋 명령어 복사
          </button>

          <div style={{ color: "#888", marginLeft: "20px" }}>
            상태:{" "}
            {isRunning ? (
              <span style={{ color: "#4ecdc4" }}>
                실행 중... ({updateCount}회 업데이트)
              </span>
            ) : (
              <span style={{ color: "#ff6b6b" }}>정지됨</span>
            )}
          </div>
        </div>
      </div>

      {/* 터미널 출력 영역 */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div ref={outputRef} className="terminal-output">
          {xxdOutput}
        </div>
      </div>

      {/* 설명 및 사용법 */}
      <div className="grid grid-2">
        <div className="card">
          <div className="card-title">📖 사용법</div>
          <div style={{ marginBottom: "1rem" }}>
            <h4
              style={{
                color: "#ffd700",
                margin: "1rem 0 0.5rem 0",
                fontSize: "1rem",
              }}
            >
              키보드 단축키:
            </h4>
            <ul
              style={{
                margin: "0.5rem 0",
                paddingLeft: "1.5rem",
                color: "#ccc",
              }}
            >
              <li style={{ margin: "0.25rem 0" }}>
                <kbd
                  style={{
                    background: "#444",
                    border: "1px solid #666",
                    borderRadius: "2px",
                    padding: "2px 5px",
                    fontSize: "0.7rem",
                    color: "#fff",
                  }}
                >
                  Space
                </kbd>{" "}
                - 시작/정지 토글
              </li>
              <li style={{ margin: "0.25rem 0" }}>
                <kbd
                  style={{
                    background: "#444",
                    border: "1px solid #666",
                    borderRadius: "2px",
                    padding: "2px 5px",
                    fontSize: "0.7rem",
                    color: "#fff",
                  }}
                >
                  C
                </kbd>{" "}
                - 출력 클리어
              </li>
            </ul>
          </div>
          <div>
            <h4
              style={{
                color: "#ffd700",
                margin: "1rem 0 0.5rem 0",
                fontSize: "1rem",
              }}
            >
              macOS에 watch가 없다면:
            </h4>
            <div
              style={{
                background: "#000",
                border: "1px solid #555",
                borderRadius: "3px",
                padding: "1rem",
                margin: "0.5rem 0",
              }}
            >
              <div
                style={{
                  color: "#888",
                  fontSize: "0.7rem",
                  marginBottom: "0.5rem",
                }}
              >
                Homebrew 사용:
              </div>
              <code
                style={{
                  color: "#00ff00",
                  fontFamily: "Courier New, monospace",
                  fontSize: "0.8rem",
                }}
              >
                brew install watch
              </code>
            </div>
          </div>
          <div>
            <h4
              style={{
                color: "#ffd700",
                margin: "1rem 0 0.5rem 0",
                fontSize: "1rem",
              }}
            >
              실제 시스템에서 실행하기:
            </h4>
            <div
              style={{
                background: "#000",
                border: "1px solid #555",
                borderRadius: "3px",
                padding: "1rem",
                margin: "0.5rem 0",
                position: "relative",
              }}
            >
              <div
                style={{
                  color: "#888",
                  fontSize: "0.7rem",
                  marginBottom: "0.5rem",
                }}
              >
                Linux/macOS 터미널:
              </div>
              <code
                style={{
                  color: "#00ff00",
                  fontFamily: "Courier New, monospace",
                  fontSize: "0.8rem",
                  display: "block",
                  wordBreak: "break-all",
                }}
              >
                watch -n 0.1 "xxd -l 256 -g 4 /dev/urandom"
              </code>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">🛠️ 명령어 설명</div>
          <ul
            style={{
              margin: "1rem 0",
              paddingLeft: "1.5rem",
              color: "#ccc",
              lineHeight: 1.6,
            }}
          >
            <li style={{ margin: "0.5rem 0" }}>
              <strong style={{ color: "#00aaff" }}>watch -n 0.1</strong>:
              0.1초마다 명령어 반복 실행
            </li>
            <li style={{ margin: "0.5rem 0" }}>
              <strong style={{ color: "#00aaff" }}>xxd</strong>: 바이너리를 hex
              dump로 출력하는 도구
            </li>
            <li style={{ margin: "0.5rem 0" }}>
              <strong style={{ color: "#00aaff" }}>-l 256</strong>: 256바이트만
              읽기
            </li>
            <li style={{ margin: "0.5rem 0" }}>
              <strong style={{ color: "#00aaff" }}>-g 4</strong>: 4바이트씩
              그룹화하여 표시
            </li>
            <li style={{ margin: "0.5rem 0" }}>
              <strong style={{ color: "#00aaff" }}>/dev/urandom</strong>:
              리눅스/macOS 랜덤 장치 파일
            </li>
          </ul>

          <div
            style={{
              background: "#222",
              padding: "0.75rem",
              borderRadius: "3px",
              marginTop: "1rem",
              borderLeft: "3px solid #ffd700",
            }}
          >
            <h4 style={{ color: "#ffd700", marginTop: 0, fontSize: "1rem" }}>
              💡 팁:
            </h4>
            <p
              style={{ margin: "0.25rem 0", color: "#ccc", fontSize: "0.9rem" }}
            >
              다른 파일도 볼 수 있어요:{" "}
              <code style={{ color: "#00ff00" }}>xxd -l 256 /bin/ls</code>
            </p>
            <p
              style={{ margin: "0.25rem 0", color: "#ccc", fontSize: "0.9rem" }}
            >
              실제 터미널에서는{" "}
              <kbd
                style={{
                  background: "#444",
                  border: "1px solid #666",
                  borderRadius: "2px",
                  padding: "2px 5px",
                  fontSize: "0.7rem",
                  color: "#fff",
                }}
              >
                Ctrl+C
              </kbd>
              로 중단할 수 있습니다!
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 215, 0, 0.1)",
              padding: "0.75rem",
              borderRadius: "3px",
              marginTop: "1rem",
              border: "1px solid rgba(255, 215, 0, 0.3)",
            }}
          >
            <h4 style={{ color: "#ffd700", marginTop: 0, fontSize: "1rem" }}>
              🎯 이 데모의 의미:
            </h4>
            <p
              style={{ margin: "0.25rem 0", color: "#ccc", fontSize: "0.9rem" }}
            >
              이 뷰어는 Unix/Linux 시스템의 <code>/dev/urandom</code>이 어떻게
              작동하는지를 웹 브라우저에서 시뮬레이션합니다.
              <strong style={{ color: "#ffd700" }}>
                브라우저에서는 crypto.getRandomValues()를 사용하여 랜덤 데이터를
                생성하며
              </strong>
              , 실제 시스템에서는 하드웨어 노이즈와 시스템 엔트로피를 기반으로
              진정한 랜덤 데이터를 생성합니다.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .terminal-output {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          line-height: 1.4;
          background: #000;
          color: #00ff00;
          padding: 1rem;
          border-radius: 4px;
          overflow: auto;
          height: 400px;
          border: 1px solid #333;
        }
        
        .hex-line {
          display: flex;
          margin-bottom: 2px;
          font-family: 'Courier New', monospace;
        }
        
        .address {
          color: #0088ff;
          font-weight: bold;
          width: 80px;
          flex-shrink: 0;
        }
        
        .hex-section {
          width: 320px;
          flex-shrink: 0;
          margin-left: 10px;
        }
        
        .hex-byte {
          color: #00ff00;
          margin-right: 1px;
        }
        
        .hex-space {
          margin-right: 4px;
        }
        
        .ascii-section {
          color: #888;
          margin-left: 20px;
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </div>
  );
};

export default UrandomViewer;
