import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type SharkItem = {
  id: number;
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
  direction: 1 | -1;
};

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const sharks = useMemo<SharkItem[]>(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 92}%`,
        left: `${-25 - Math.random() * 25}%`,
        size: `${20 + Math.random() * 16}px`,
        duration: `${16 + Math.random() * 14}s`,
        delay: `${Math.random() * 8}s`,
        direction: Math.random() > 0.5 ? 1 : -1,
      })),
    []
  );

  const handleLogin = () => {
    setMessage("회원가입 승인대기중입니다.");
  };

  return (
    <div className="login-page">
      {sharks.map((shark) => (
        <div
          key={shark.id}
          className="shark"
          style={{
            top: shark.top,
            left: shark.left,
            fontSize: shark.size,
            animationDuration: shark.duration,
            animationDelay: shark.delay,
            transform: `scaleX(${shark.direction})`,
          }}
        >
          🦈
        </div>
      ))}

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
