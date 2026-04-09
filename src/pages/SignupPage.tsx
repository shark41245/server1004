import { useState } from "react";
import { Link } from "react-router-dom";
import { signup, type SignupPayload } from "../lib/api";

const initialForm: SignupPayload = {
  username: "",
  password: "",
  nickname: "",
  bankName: "",
  accountNumber: "",
  exchangePassword: "",
  phoneNumber: "",
  referralCode: "",
  signupCode: "",
  siteName: "",
};

export default function SignupPage() {
  const [form, setForm] = useState<SignupPayload>(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateField = <K extends keyof SignupPayload>(key: K, value: SignupPayload[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const requiredFields: Array<[keyof SignupPayload, string]> = [
        ["username", "아이디"],
        ["password", "비밀번호"],
        ["nickname", "닉네임"],
        ["bankName", "은행"],
        ["accountNumber", "계좌번호"],
        ["exchangePassword", "환전 비밀번호"],
        ["phoneNumber", "휴대폰번호"],
        ["signupCode", "가입코드"],
        ["siteName", "이용 중인 사이트 이름"],
      ];

      const missing = requiredFields.find(([key]) => !String(form[key]).trim());
      if (missing) {
        setMessage(`${missing[1]}을(를) 입력해 주세요.`);
        return;
      }

      await signup({
        username: form.username.trim(),
        password: form.password.trim(),
        nickname: form.nickname.trim(),
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        exchangePassword: form.exchangePassword.trim(),
        phoneNumber: form.phoneNumber.trim(),
        referralCode: form.referralCode.trim(),
        signupCode: form.signupCode.trim(),
        siteName: form.siteName.trim(),
      });

      setMessage("회원가입이 완료되었습니다.");
      setForm(initialForm);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="inner-page signup-page">
      <section className="signup-hero">
        <p className="eyebrow dark">CREATE ACCOUNT</p>
        <h1>회원가입 정보를 차분하게 입력할 수 있는 별도 페이지입니다.</h1>
        <p className="hero-text dark-text">
          기존 기능은 유지하면서 가입코드 확인과 추가 회원 정보를 받을 수 있게 구성했습니다.
        </p>
        <Link to="/" className="inline-back-link">
          로그인 화면으로 돌아가기
        </Link>
      </section>

      <section className="card-panel signup-panel">
        <div className="split-grid">
          <div className="field">
            <label htmlFor="signup-username">아이디</label>
            <input
              id="signup-username"
              type="text"
              placeholder="아이디 입력"
              value={form.username}
              onChange={(event) => updateField("username", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              type="password"
              placeholder="비밀번호 입력"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-nickname">닉네임</label>
            <input
              id="signup-nickname"
              type="text"
              placeholder="닉네임 입력"
              value={form.nickname}
              onChange={(event) => updateField("nickname", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-bank">은행</label>
            <input
              id="signup-bank"
              type="text"
              placeholder="은행명 입력"
              value={form.bankName}
              onChange={(event) => updateField("bankName", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-account">계좌번호</label>
            <input
              id="signup-account"
              type="text"
              placeholder="계좌번호 입력"
              value={form.accountNumber}
              onChange={(event) => updateField("accountNumber", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-exchange-password">환전 비밀번호</label>
            <input
              id="signup-exchange-password"
              type="password"
              placeholder="환전 비밀번호 입력"
              value={form.exchangePassword}
              onChange={(event) => updateField("exchangePassword", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-phone">휴대폰번호</label>
            <input
              id="signup-phone"
              type="text"
              placeholder="휴대폰번호 입력"
              value={form.phoneNumber}
              onChange={(event) => updateField("phoneNumber", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="signup-referral">추천인 코드</label>
            <input
              id="signup-referral"
              type="text"
              placeholder="추천인 코드 입력"
              value={form.referralCode}
              onChange={(event) => updateField("referralCode", event.target.value)}
            />
          </div>

          <div className="field field-full">
            <label htmlFor="signup-code">가입코드</label>
            <input
              id="signup-code"
              type="text"
              placeholder="가입코드 입력"
              value={form.signupCode}
              onChange={(event) => updateField("signupCode", event.target.value)}
            />
          </div>

          <div className="form-divider field-full">---- 이 사 비 신 청 ----</div>

          <div className="field field-full">
            <label htmlFor="signup-site-name">이용 중인 사이트 이름</label>
            <input
              id="signup-site-name"
              type="text"
              placeholder="이용 중인 사이트 이름 입력"
              value={form.siteName}
              onChange={(event) => updateField("siteName", event.target.value)}
            />
          </div>
        </div>

        <div className="stack-buttons signup-actions">
          <button type="button" className="primary-button" onClick={handleSubmit} disabled={loading}>
            {loading ? "처리중..." : "회원가입 완료"}
          </button>
          <Link to="/" className="ghost-button dark-ghost">
            로그인 화면으로 이동
          </Link>
        </div>

        {message ? <p className="status-message dark-message">{message}</p> : null}
      </section>
    </main>
  );
}
