import { useState } from "react";
import { signup } from "../lib/api";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!username.trim() || !password.trim()) {
        setMessage("아이디와 비밀번호를 입력해 주세요.");
        return;
      }

      await signup({
        username: username.trim(),
        password: password.trim(),
      });

      setMessage("회원가입이 완료되었습니다.");
      setUsername("");
      setPassword("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleFakeLogin = () => {
    setMessage("회원가입 승인대기중입니다.");
  };

  return (
    <main className="page">
      <section className="card auth-card">
        <h1>회원가입</h1>
        <p className="description">
          아이디와 비밀번호를 입력해 회원가입할 수 있습니다.
        </p>

        <div className="field">
          <label htmlFor="username">아이디</label>
          <input
            id="username"
            type="text"
            placeholder="아이디 입력"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="button-row">
          <button onClick={handleSignup} disabled={loading}>
            {loading ? "처리중..." : "회원가입"}
          </button>
          <button className="secondary" onClick={handleFakeLogin} disabled={loading}>
            로그인
          </button>
        </div>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  );
}
