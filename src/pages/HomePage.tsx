import { useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleFakeLogin = () => {
    if (!username.trim() || !password.trim()) {
      setMessage("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    setMessage("회원가입 승인대기중입니다.");
  };

  return (
    <main className="hero-page">
      <section className="hero-copy">
        <p className="eyebrow">PREMIUM MEMBER SERVICE</p>
        <h1>깊고 차분한 바다색 배경 위에서 시작하는 회원 전용 공간</h1>
        <p className="hero-text">
          첫 화면에는 로그인만 보이도록 구성하고, 회원가입은 별도 페이지에서 차분하게
          진행되도록 디자인했습니다.
        </p>
      </section>

      <section className="glass-panel login-panel">
        <div className="panel-badge">Member Login</div>
        <h2>로그인</h2>
        <p className="panel-text">아이디와 비밀번호를 입력한 뒤 로그인 또는 회원가입을 진행해 주세요.</p>

        <div className="field">
          <label htmlFor="home-username">아이디 입력</label>
          <input
            id="home-username"
            type="text"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="home-password">비밀번호 입력</label>
          <input
            id="home-password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className="stack-buttons">
          <button type="button" className="primary-button" onClick={handleFakeLogin}>
            로그인
          </button>
          <Link to="/signup" className="ghost-button">
            회원가입
          </Link>
        </div>

        {message ? <p className="floating-message">{message}</p> : null}
      </section>
    </main>
  );
}
