import { Link, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className={isHome ? "app-shell ocean-theme" : "app-shell inner-theme"}>
      <header className={isHome ? "floating-header" : "site-header"}>
        <div className="header-inner">
          <Link to="/" className="site-logo">
            Blue Horizon
          </Link>

          <nav className="site-nav">
            <Link to="/">홈</Link>
            <Link to="/signup">회원가입</Link>
            <Link to="/admin">관리자</Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default AppShell;
