import { useState } from "react";
import { useNavigate } from "react-router-dom";

type SignupForm = {
  username: string;
  password: string;
  nickname: string;
  bank: string;
  accountNumber: string;
  withdrawPassword: string;
  phone: string;
  referralCode: string;
  signupCode: string;
  siteName: string;
};

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupForm>({
    username: "",
    password: "",
    nickname: "",
    bank: "",
    accountNumber: "",
    withdrawPassword: "",
    phone: "",
    referralCode: "",
    signupCode: "",
    siteName: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (key: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          nickname: form.nickname,
          bank: form.bank,
          account_number: form.accountNumber,
          withdraw_password: form.withdrawPassword,
          phone: form.phone,
          referral_code: form.referralCode,
          signup_code: form.signupCode,
          site_name: form.siteName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "회원가입에 실패했습니다.");
      }

      setMessage("회원가입이 완료되었습니다.");
      setForm({
        username: "",
        password: "",
        nickname: "",
        bank: "",
        accountNumber: "",
        withdrawPassword: "",
        phone: "",
        referralCode: "",
        signupCode: "",
        siteName: "",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>회원가입</h1>

        <div className="signup-grid">
          <input
            type="text"
            placeholder="아이디"
            value={form.username}
            onChange={(e) => onChange("username", e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(e) => onChange("password", e.target.value)}
          />
          <input
            type="text"
            placeholder="닉네임"
            value={form.nickname}
            onChange={(e) => onChange("nickname", e.target.value)}
          />
          <input
            type="text"
            placeholder="은행"
            value={form.bank}
            onChange={(e) => onChange("bank", e.target.value)}
          />
          <input
            type="text"
            placeholder="계좌번호"
            value={form.accountNumber}
            onChange={(e) => onChange("accountNumber", e.target.value)}
          />
          <input
            type="password"
            placeholder="환전 비밀번호"
            value={form.withdrawPassword}
            onChange={(e) => onChange("withdrawPassword", e.target.value)}
          />
          <input
            type="text"
            placeholder="휴대폰번호"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
          <input
            type="text"
            placeholder="추천인 코드"
            value={form.referralCode}
            onChange={(e) => onChange("referralCode", e.target.value)}
          />
          <input
            type="text"
            placeholder="가입코드"
            value={form.signupCode}
            onChange={(e) => onChange("signupCode", e.target.value)}
          />

          <div className="signup-divider">---- 이 사 비 신 청 ----</div>

          <input
            type="text"
            placeholder="이용 중인 사이트 이름"
            value={form.siteName}
            onChange={(e) => onChange("siteName", e.target.value)}
          />
        </div>

        <div className="signup-actions">
          <button onClick={handleSignup} disabled={loading}>
            {loading ? "처리중..." : "회원가입"}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            뒤로가기
          </button>
        </div>

        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
}
