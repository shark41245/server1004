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
    <div className="login-container">
      <div className="login-box">
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
  );
}
