import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <div>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            회원가입 사이트
          </Link>
          <nav className="nav">
            <Link to="/">홈</Link>
            <Link to="/admin">관리자</Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}
