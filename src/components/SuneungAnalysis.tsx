import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const SuneungAnalysis: React.FC = () => {
  // 실제 분석 데이터 (2014-2023)
  const data = {
    korean: [119, 114, 136, 146, 137], // 총 652문항
    math: [73, 84, 85, 93, 89], // 총 424문항
    english: [92, 103, 96, 104, 100], // 총 495문항
    total: [284, 301, 317, 343, 326], // 총 1,571문항
  };

  // 연도별 데이터
  const yearlyData = {
    2014: [40, 42, 46, 47, 48],
    2015: [32, 34, 35, 37, 39],
    2016: [67, 67, 76, 76, 74],
    2018: [50, 54, 54, 61, 53],
    2020: [49, 50, 54, 60, 57],
    2023: [46, 54, 52, 62, 54],
  };

  const colors = ["#FF6B9D", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: "500",
          },
          color: "#e0e0e0",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed}문항 (${percentage}%)`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "white",
        font: {
          size: 14,
          weight: "bold",
        },
        formatter: function (value: number, context: any) {
          const total = context.dataset.data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return `${value}\n(${percentage}%)`;
        },
        textAlign: "center" as const,
      },
    },
  };

  const createPieData = (data: number[]) => ({
    labels: ["①번", "②번", "③번", "④번", "⑤번"],
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        borderWidth: 3,
        borderColor: "#1a1a2e",
      },
    ],
  });

  const trendChartData = {
    labels: Object.keys(yearlyData),
    datasets: [
      {
        label: "①번",
        data: Object.values(yearlyData).map((d) =>
          ((d[0] / d.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
        ),
        borderColor: colors[0],
        backgroundColor: colors[0] + "20",
        tension: 0.4,
      },
      {
        label: "②번",
        data: Object.values(yearlyData).map((d) =>
          ((d[1] / d.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
        ),
        borderColor: colors[1],
        backgroundColor: colors[1] + "20",
        tension: 0.4,
      },
      {
        label: "③번",
        data: Object.values(yearlyData).map((d) =>
          ((d[2] / d.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
        ),
        borderColor: colors[2],
        backgroundColor: colors[2] + "20",
        tension: 0.4,
      },
      {
        label: "④번",
        data: Object.values(yearlyData).map((d) =>
          ((d[3] / d.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
        ),
        borderColor: colors[3],
        backgroundColor: colors[3] + "20",
        tension: 0.4,
      },
      {
        label: "⑤번",
        data: Object.values(yearlyData).map((d) =>
          ((d[4] / d.reduce((a, b) => a + b, 0)) * 100).toFixed(1)
        ),
        borderColor: colors[4],
        backgroundColor: colors[4] + "20",
        tension: 0.4,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 15,
        max: 25,
        title: {
          display: true,
          text: "비율 (%)",
          color: "#e0e0e0",
        },
        ticks: {
          color: "#e0e0e0",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        title: {
          display: true,
          text: "연도",
          color: "#e0e0e0",
        },
        ticks: {
          color: "#e0e0e0",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#e0e0e0",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
  };

  return (
    <div className="demo-container fade-in">
      <h1 className="demo-title">🎯 수능 정답 선택지 분포 종합 분석</h1>
      <div className="demo-subtitle">10년간의 데이터 간단 분석 (2014-2023)</div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div
          className="text-center"
          style={{
            background: "linear-gradient(135deg, #74b9ff, #0984e3)",
            color: "white",
            padding: "1rem",
            borderRadius: "12px",
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            fontWeight: "600",
            lineHeight: "1.5",
          }}
        >
          <div style={{ marginBottom: "0.5rem" }}>
            📊 분석 기간: 2014~2023년
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            📝 총 분석 문항: <span className="highlight">1,571문항</span>
          </div>
          <div>🏫 분석 과목: 국어, 수학, 영어</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: "3rem" }}>
        <div className="card">
          <div className="card-title">📚 국어 영역 (10년 누적)</div>
          <div style={{ height: "clamp(250px, 50vw, 350px)" }}>
            <Pie
              data={createPieData(data.korean)}
              options={chartOptions}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-title">📐 수학 영역 (10년 누적)</div>
          <div style={{ height: "clamp(250px, 50vw, 350px)" }}>
            <Pie
              data={createPieData(data.math)}
              options={chartOptions}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-title">🌍 영어 영역 (10년 누적)</div>
          <div style={{ height: "clamp(250px, 50vw, 350px)" }}>
            <Pie
              data={createPieData(data.english)}
              options={chartOptions}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-title">📊 전체 합계 (모든 과목)</div>
          <div style={{ height: "clamp(250px, 50vw, 350px)" }}>
            <Pie
              data={createPieData(data.total)}
              options={chartOptions}
              plugins={[ChartDataLabels]}
            />
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-title">📈 연도별 변화 추이</div>
        <div style={{ height: "400px" }}>
          <Line data={trendChartData} options={trendChartOptions} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-title">📈 핵심 통계</div>
        <div className="grid grid-4" style={{ marginBottom: "2rem" }}>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #74b9ff, #0984e3)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                opacity: 0.9,
                marginBottom: "0.5rem",
              }}
            >
              총 분석 문항 (주관식 제외)
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>1,571</div>
          </div>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #74b9ff, #0984e3)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                opacity: 0.9,
                marginBottom: "0.5rem",
              }}
            >
              분석 기간
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>10년</div>
          </div>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #74b9ff, #0984e3)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                opacity: 0.9,
                marginBottom: "0.5rem",
              }}
            >
              가장 많은 선택지
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>④번</div>
          </div>
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #74b9ff, #0984e3)",
              color: "white",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.9rem",
                opacity: 0.9,
                marginBottom: "0.5rem",
              }}
            >
              최대 편차
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: "bold" }}>3.7%</div>
          </div>
        </div>

        <div
          className="card"
          style={{
            background: "#f8f9fa",
            color: "#333",
            borderLeft: "5px solid #74b9ff",
          }}
        >
          <h3 style={{ color: "#2c3e50", marginTop: 0, fontSize: "1.3rem" }}>
            🔍 주요 분석 결과
          </h3>
          <ul style={{ color: "#555", lineHeight: 1.7 }}>
            <li style={{ marginBottom: "8px" }}>
              <strong>극단 회피 현상:</strong> ①번(18.1%)과 ⑤번(20.8%)이
              상대적으로 적게 선택됨
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>중간 선택지 선호:</strong> ④번(21.8%)이 가장 많고, ②③④번이
              전체의 61.2% 차지
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>과목별 특징:</strong>
              <ul style={{ marginTop: "8px" }}>
                <li>국어: ④번이 22.4%로 가장 높음 (출제자의 일관된 패턴)</li>
                <li>수학: 상대적으로 균등하지만 ④번이 21.9%로 최고</li>
                <li>영어: 가장 균등한 분포 (18.6% ~ 21.0%)</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuneungAnalysis;
