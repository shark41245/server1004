import { useEffect, useState } from "react";
import { adminLogin, getMembers, type MemberRow } from "../lib/api";

const TOKEN_KEY = "admin_token";

export default function AdminPage() {
  const [adminPassword, setAdminPassword] = useState("");
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadMembers = async (currentToken: string) => {
    try {
      setLoading(true);
      setMessage("");
      const result = await getMembers(currentToken);
      setMembers(result.members);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "회원 목록 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!adminPassword.trim()) {
        setMessage("관리자 비밀번호를 입력해 주세요.");
        return;
      }

      const result = await adminLogin(adminPassword.trim());
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setAdminPassword("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "관리자 로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setMembers([]);
    setMessage("관리자 로그아웃 완료");
  };

  useEffect(() => {
    if (token) {
      void loadMembers(token);
    }
  }, [token]);

  if (!token) {
    return (
      <main className="page">
        <section className="card admin-login-card">
          <h1>관리자 페이지</h1>
          <p className="description">관리자 비밀번호를 입력한 뒤 입장할 수 있습니다.</p>

          <div className="field">
            <label htmlFor="admin-password">관리자 비밀번호</label>
            <input
              id="admin-password"
              type="password"
              placeholder="관리자 비밀번호 입력"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
          </div>

          <div className="button-row">
            <button onClick={handleAdminLogin} disabled={loading}>
              {loading ? "확인중..." : "관리자 입장"}
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <div className="admin-header">
          <div>
            <h1>관리자 페이지</h1>
            <p className="description">가입된 회원 정보를 확인할 수 있습니다.</p>
          </div>

          <div className="button-row">
            <button className="secondary" onClick={() => void loadMembers(token)} disabled={loading}>
              새로고침
            </button>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        </div>

        {message && <p className="message">{message}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>아이디</th>
                <th>비밀번호 해시</th>
                <th>가입일시</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.username}</td>
                    <td className="hash-cell">{member.password_hash}</td>
                    <td>{new Date(member.created_at).toLocaleString("ko-KR")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="empty-cell">
                    저장된 회원이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
