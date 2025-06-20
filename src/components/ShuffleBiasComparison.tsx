import React, { useState, useEffect, useCallback } from "react";

const ShuffleBiasComparison: React.FC = () => {
  const [startRange, setStartRange] = useState(1);
  const [endRange, setEndRange] = useState(45);
  const [pickCount, setPickCount] = useState(6);
  const [testCount, setTestCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const [biasedCounts, setBiasedCounts] = useState<number[]>([]);
  const [unbiasedCounts, setUnbiasedCounts] = useState<number[]>([]);
  const [biasedRecentDraws, setBiasedRecentDraws] = useState<number[][]>([]);
  const [unbiasedRecentDraws, setUnbiasedRecentDraws] = useState<number[][]>(
    []
  );

  // 초기화
  const initializeCounts = useCallback(() => {
    const range = endRange - startRange + 1;
    setBiasedCounts(new Array(range).fill(0));
    setUnbiasedCounts(new Array(range).fill(0));
  }, [startRange, endRange]);

  useEffect(() => {
    initializeCounts();
  }, [initializeCounts]);

  // 편향된 방법 (잘못된 sort 셔플)
  const biasedPickUniqueNumbers = (
    start: number,
    end: number,
    count: number
  ): number[] => {
    const numbers = Array.from(
      { length: end - start + 1 },
      (_, i) => i + start
    );

    // 잘못된 셔플 방법 - 편향된 결과 생성
    numbers.sort(() => Math.random() - 0.5);

    return numbers.slice(0, count);
  };

  // 올바른 방법 (Fisher-Yates shuffle)
  const correctPickUniqueNumbers = (
    start: number,
    end: number,
    count: number
  ): number[] => {
    const numbers = Array.from(
      { length: end - start + 1 },
      (_, i) => i + start
    );

    // Fisher-Yates shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers.slice(0, count);
  };

  // 색상 계산 (두 방법 모두 동일한 색상 사용)
  const getNumberColor = (value: number, maxValue: number): string => {
    if (maxValue === 0) return "rgba(26, 26, 26, 1)";

    const intensity = value / maxValue;
    const red = Math.floor(255 * intensity);
    const green = Math.floor(99 * (1 - intensity * 0.7));
    const blue = Math.floor(71 * (1 - intensity * 0.7));
    const alpha = 0.3 + intensity * 0.7;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  };

  // 단일 추첨 실행
  const runSingleDraw = () => {
    const biasedResult = biasedPickUniqueNumbers(
      startRange,
      endRange,
      pickCount
    );
    const unbiasedResult = correctPickUniqueNumbers(
      startRange,
      endRange,
      pickCount
    );

    setBiasedCounts((prev) => {
      const newCounts = [...prev];
      biasedResult.forEach((num) => {
        const index = num - startRange;
        newCounts[index]++;
      });
      return newCounts;
    });

    setUnbiasedCounts((prev) => {
      const newCounts = [...prev];
      unbiasedResult.forEach((num) => {
        const index = num - startRange;
        newCounts[index]++;
      });
      return newCounts;
    });

    setBiasedRecentDraws((prev) => {
      const newDraws = [
        biasedResult.sort((a, b) => a - b),
        ...prev.slice(0, 4),
      ];
      return newDraws;
    });

    setUnbiasedRecentDraws((prev) => {
      const newDraws = [
        unbiasedResult.sort((a, b) => a - b),
        ...prev.slice(0, 4),
      ];
      return newDraws;
    });

    setTestCount((prev) => prev + 1);
  };

  // 배치 테스트 실행
  const runTestBatch = async (iterations: number) => {
    setIsRunning(true);
    const batchSize = 100;
    const totalBatches = Math.ceil(iterations / batchSize);

    for (let batch = 0; batch < totalBatches; batch++) {
      const currentBatchSize = Math.min(
        batchSize,
        iterations - batch * batchSize
      );

      let lastBiasedResult: number[] = [];
      let lastUnbiasedResult: number[] = [];

      for (let test = 0; test < currentBatchSize; test++) {
        const biasedResult = biasedPickUniqueNumbers(
          startRange,
          endRange,
          pickCount
        );
        const unbiasedResult = correctPickUniqueNumbers(
          startRange,
          endRange,
          pickCount
        );

        setBiasedCounts((prev) => {
          const newCounts = [...prev];
          biasedResult.forEach((num) => {
            const index = num - startRange;
            newCounts[index]++;
          });
          return newCounts;
        });

        setUnbiasedCounts((prev) => {
          const newCounts = [...prev];
          unbiasedResult.forEach((num) => {
            const index = num - startRange;
            newCounts[index]++;
          });
          return newCounts;
        });

        setTestCount((prev) => prev + 1);

        if (test === currentBatchSize - 1) {
          lastBiasedResult = biasedResult.sort((a, b) => a - b);
          lastUnbiasedResult = unbiasedResult.sort((a, b) => a - b);
        }
      }

      setBiasedRecentDraws((prev) => [lastBiasedResult, ...prev.slice(0, 4)]);
      setUnbiasedRecentDraws((prev) => [
        lastUnbiasedResult,
        ...prev.slice(0, 4),
      ]);

      setProgress(((batch + 1) / totalBatches) * 100);

      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    setProgress(0);
    setIsRunning(false);
  };

  // 리셋
  const reset = () => {
    initializeCounts();
    setBiasedRecentDraws([]);
    setUnbiasedRecentDraws([]);
    setTestCount(0);
    setProgress(0);
  };

  // 통계 계산
  const calculateStandardDeviation = (counts: number[]): number => {
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    const variance =
      counts.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
      counts.length;
    return Math.sqrt(variance);
  };

  const expectedCount =
    testCount > 0 ? (testCount * pickCount) / (endRange - startRange + 1) : 0;
  const biasedStdDev = calculateStandardDeviation(biasedCounts);
  const unbiasedStdDev = calculateStandardDeviation(unbiasedCounts);
  const maxBiased = Math.max(...biasedCounts);
  const maxUnbiased = Math.max(...unbiasedCounts);

  return (
    <div className="demo-container fade-in">
      <h1 className="demo-title">🎰 로또 번호 선택 알고리즘 편향성 분석</h1>
      <div className="demo-subtitle">편향된 방법 vs 올바른 방법 비교 분석</div>

      {/* 컨트롤 패널 */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-title">⚙️ 설정 및 제어</div>
        <div className="grid grid-3" style={{ marginBottom: "1rem" }}>
          <div>
            <label
              className="text-gold"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              시작 번호:
            </label>
            <input
              type="number"
              className="input"
              value={startRange}
              onChange={(e) => setStartRange(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label
              className="text-gold"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              끝 번호:
            </label>
            <input
              type="number"
              className="input"
              value={endRange}
              onChange={(e) => setEndRange(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label
              className="text-gold"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              선택 개수:
            </label>
            <input
              type="number"
              className="input"
              value={pickCount}
              onChange={(e) => setPickCount(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div className="text-center">
          <button className="btn" onClick={runSingleDraw} disabled={isRunning}>
            🎲 단일 추첨
          </button>
          <button
            className="btn"
            onClick={() => runTestBatch(1000)}
            disabled={isRunning}
          >
            🔄 1,000회 테스트
          </button>
          <button
            className="btn"
            onClick={() => runTestBatch(10000)}
            disabled={isRunning}
          >
            ⚡ 10,000회 테스트
          </button>
          <button className="btn danger" onClick={reset} disabled={isRunning}>
            🗑️ 리셋
          </button>
        </div>

        {progress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <div className="text-center text-muted" style={{ marginTop: "1rem" }}>
          총 실행 횟수:{" "}
          <span className="text-gold">{testCount.toLocaleString()}</span>회
        </div>
      </div>

      {/* 비교 차트 */}
      <div className="grid grid-2" style={{ marginBottom: "2rem" }}>
        {/* 편향된 방법 */}
        <div className="card">
          <div className="card-title" style={{ color: "#ff6b6b" }}>
            ❌ 편향된 방법 (MissionUtils.Random.pickUniqueNumbersInRange)
          </div>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              padding: "0.75rem",
              margin: "1rem 0",
              fontFamily: "Consolas, Monaco, monospace",
              borderRadius: "6px",
              fontSize: "0.75rem",
              borderLeft: "4px solid #ff6b6b",
            }}
          >
            <pre
              style={{
                margin: 0,
                whiteSpace: "pre-wrap",
                height: "120px",
                overflow: "hidden",

                display: "flex",
                alignItems: "center",
              }}
            >
              {`// 잘못된 셔플 방법 - 편향된 결과를 초래해요.
numbers.sort(() => Math.random() - 0.5);
return numbers.slice(0, count);`}
            </pre>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 1fr)",
              gap: "3px",
              marginBottom: "1rem",
            }}
          >
            {Array.from({ length: endRange - startRange + 1 }, (_, i) => {
              const number = startRange + i;
              const count = biasedCounts[i] || 0;
              const color = getNumberColor(count, maxBiased);

              return (
                <div
                  key={number}
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: color,
                    color: count > maxBiased * 0.5 ? "white" : "#e0e0e0",
                    minHeight: "40px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: "0.6rem", marginBottom: "2px" }}>
                    {number}
                  </div>
                  <div style={{ fontSize: "0.55rem", opacity: 0.8 }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 215, 0, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span className="text-muted">기대 선택 횟수:</span>
              <span className="text-gold">{expectedCount.toFixed(1)}회</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span className="text-muted">표준편차 (공정성):</span>
              <span className="text-gold">{biasedStdDev.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">최대/최소:</span>
              <span className="text-gold">
                {Math.max(...biasedCounts)} / {Math.min(...biasedCounts)}
              </span>
            </div>
          </div>

          {/* 최근 추첨 결과 */}
          <div style={{ marginTop: "1rem" }}>
            <div
              className="text-muted"
              style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}
            >
              최근 추첨 결과:
            </div>
            {biasedRecentDraws.map((draw, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {draw.map((num, i) => (
                  <div
                    key={i}
                    style={{
                      background: "linear-gradient(135deg, #ffd700, #ffb300)",
                      color: "#1a1a2e",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 올바른 방법 */}
        <div className="card">
          <div className="card-title" style={{ color: "#4ecdc4" }}>
            ✅ 올바른 방법 <br></br>(Fisher-Yates)
          </div>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.6)",
              padding: "0.75rem",
              margin: "1rem 0",
              fontFamily: "Consolas, Monaco, monospace",
              borderRadius: "6px",
              fontSize: "0.75rem",
              borderLeft: "4px solid #4ecdc4",
            }}
          >
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {`// Fisher-Yates 셔플 알고리즘
for (let i = numbers.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
}
return numbers.slice(0, count);`}
            </pre>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 1fr)",
              gap: "3px",
              marginBottom: "1rem",
            }}
          >
            {Array.from({ length: endRange - startRange + 1 }, (_, i) => {
              const number = startRange + i;
              const count = unbiasedCounts[i] || 0;
              const color = getNumberColor(count, maxUnbiased);

              return (
                <div
                  key={number}
                  style={{
                    aspectRatio: "1",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    borderRadius: "6px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: color,
                    color: count > maxUnbiased * 0.5 ? "white" : "#e0e0e0",
                    minHeight: "40px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div style={{ fontSize: "0.6rem", marginBottom: "2px" }}>
                    {number}
                  </div>
                  <div style={{ fontSize: "0.55rem", opacity: 0.8 }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              fontSize: "0.8rem",
              background: "rgba(0, 0, 0, 0.3)",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid rgba(255, 215, 0, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span className="text-muted">기대 선택 횟수:</span>
              <span className="text-gold">{expectedCount.toFixed(1)}회</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <span className="text-muted">표준편차 (낮을수록 공정):</span>
              <span className="text-gold">{unbiasedStdDev.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span className="text-muted">최대/최소:</span>
              <span className="text-gold">
                {Math.max(...unbiasedCounts)} / {Math.min(...unbiasedCounts)}
              </span>
            </div>
          </div>

          {/* 최근 추첨 결과 */}
          <div style={{ marginTop: "1rem" }}>
            <div
              className="text-muted"
              style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}
            >
              최근 추첨 결과:
            </div>
            {unbiasedRecentDraws.map((draw, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {draw.map((num, i) => (
                  <div
                    key={i}
                    style={{
                      background: "linear-gradient(135deg, #4ecdc4, #3bb3b6)",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      minWidth: "30px",
                      textAlign: "center",
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 분석 정보 */}
      <div className="card">
        <div className="card-title">📊 알고리즘 분석</div>
        <div className="grid grid-2">
          <div>
            <h3 style={{ color: "#ff6b6b", marginTop: 0, fontSize: "1.1rem" }}>
              ❌ sort() 셔플의 문제점
            </h3>
            <ul style={{ color: "#ccc", lineHeight: 1.6 }}>
              <li>
                <strong>브라우저별 다른 정렬 알고리즘</strong> 사용
              </li>
              <li>
                compare 함수가 일관성이 없어 <strong>편향된 분포</strong> 생성
              </li>
              <li>
                특정 위치의 요소들이 <strong>더 자주 선택</strong>됨
              </li>
              <li>
                수학적으로 <strong>균등하지 않은</strong> 순열 생성
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: "#4ecdc4", marginTop: 0, fontSize: "1.1rem" }}>
              ✅ Fisher-Yates의 장점
            </h3>
            <ul style={{ color: "#ccc", lineHeight: 1.6 }}>
              <li>
                <strong>O(n) 시간복잡도</strong>로 효율적
              </li>
              <li>
                모든 순열이 <strong>동일한 확률</strong>로 생성
              </li>
              <li>
                수학적으로 <strong>증명된 균등성</strong>
              </li>
              <li>업계 표준 셔플 알고리즘</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            background: "#222",
            padding: "1rem",
            borderRadius: "8px",
            marginTop: "1rem",
            borderLeft: "3px solid #ffd700",
          }}
        >
          <h4 style={{ color: "#ffd700", marginTop: 0 }}>💡 핵심 차이점</h4>
          <p style={{ margin: "0.5rem 0", color: "#ccc" }}>
            <code>array.sort(() =&gt; Math.random() - 0.5)</code>는 간단해
            보이지만 정렬 알고리즘의 내부 동작 때문에 편향된 결과를
            만들어냅니다. compare 함수가 transitivity를 보장하지 않아 특정
            요소들이 더 자주 선택됩니다.
          </p>
          <p style={{ margin: "0.5rem 0", color: "#ccc" }}>
            반면 Fisher-Yates는 모든 순열이 정확히 <strong>1/n!</strong> 확률로
            생성되어 수학적으로 완벽한 균등성을 보장합니다.
          </p>
          <p style={{ margin: "0.5rem 0", color: "#ccc" }}>
            <strong>표준편차가 낮을수록</strong> 더 공정한 알고리즘입니다!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShuffleBiasComparison;
