import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import SuneungAnalysis from "./components/SuneungAnalysis";
import ShuffleBiasComparison from "./components/ShuffleBiasComparison";
import UrandomViewer from "./components/UrandomViewer";

function App() {
  return (
    <Router basename="/random-demos-react">
      <div className="app">
        <nav className="navbar">
          <div className="navbar-content">
            <h1>🎲 Random Demos</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                🎯 수능 정답 분포
              </Link>
              <Link to="/shuffle-bias" className="nav-link">
                🎰 로또 편향성 분석
              </Link>
              <Link to="/urandom" className="nav-link">
                🔀 /dev/urandom 뷰어
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<SuneungAnalysis />} />
            <Route path="/shuffle-bias" element={<ShuffleBiasComparison />} />
            <Route path="/urandom" element={<UrandomViewer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
