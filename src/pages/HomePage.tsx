import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    setMessage("회원가입 승인대기중입니다.");
  };

  return (
    <div className="login-page">
      <div className="shark shark-1">🦈</div>
      <div className="shark shark-2">🦈</div>
      <div className="shark shark-3">🦈</div>
      <div className="shark shark-4">🦈</div>
      <div className="shark shark-5">🦈</div>
      <div className="shark shark-6">🦈</div>

      <div className="login-container">
        <div className="login-box">
          <div className="login-brand">SHARK</div>

          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>로그인</button>
          <button className="secondary" onClick={() => navigate("/signup")}>
            회원가입
          </button>

          {message && <p className="msg">{message}</p>}
        </div>
      </div>
    </div>
  );
}
