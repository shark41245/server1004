import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("SUPABASE_URL 환경변수가 없습니다.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.");
  }

  return createClient(url, serviceRoleKey);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  try {
    const {
      username,
      password,
      nickname,
      bankName,
      accountNumber,
      exchangePassword,
      phoneNumber,
      referralCode,
      signupCode,
      siteName,
    } = req.body ?? {};

    const normalized = {
      username: String(username ?? "").trim(),
      password: String(password ?? "").trim(),
      nickname: String(nickname ?? "").trim(),
      bankName: String(bankName ?? "").trim(),
      accountNumber: String(accountNumber ?? "").trim(),
      exchangePassword: String(exchangePassword ?? "").trim(),
      phoneNumber: String(phoneNumber ?? "").trim(),
      referralCode: String(referralCode ?? "").trim(),
      signupCode: String(signupCode ?? "").trim(),
      siteName: String(siteName ?? "").trim(),
    };

    if (!normalized.username || !normalized.password) {
      return res.status(400).json({ message: "아이디와 비밀번호를 입력해 주세요." });
    }

    if (!normalized.nickname || !normalized.bankName || !normalized.accountNumber) {
      return res.status(400).json({ message: "닉네임, 은행, 계좌번호를 입력해 주세요." });
    }

    if (!normalized.exchangePassword || !normalized.phoneNumber) {
      return res.status(400).json({ message: "환전 비밀번호와 휴대폰번호를 입력해 주세요." });
    }

    if (!normalized.signupCode) {
      return res.status(400).json({ message: "가입코드를 입력해 주세요." });
    }

    if (!normalized.siteName) {
      return res.status(400).json({ message: "이용 중인 사이트 이름을 입력해 주세요." });
    }

    if (normalized.username.length < 2) {
      return res.status(400).json({ message: "아이디는 2자 이상이어야 합니다." });
    }

    if (normalized.password.length < 4) {
      return res.status(400).json({ message: "비밀번호는 4자 이상이어야 합니다." });
    }

    const requiredSignupCode = String(process.env.SIGNUP_CODE ?? "").trim();

    if (!requiredSignupCode) {
      return res.status(500).json({ message: "SIGNUP_CODE 환경변수가 설정되지 않았습니다." });
    }

    if (normalized.signupCode !== requiredSignupCode) {
      return res.status(400).json({ message: "가입코드가 올바르지 않습니다." });
    }

    const supabase = getSupabase();

    const { data: existingUser, error: checkError } = await supabase
      .from("members")
      .select("id")
      .eq("username", normalized.username)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        message: `중복 확인 실패: ${checkError.message}`,
      });
    }

    if (existingUser) {
      return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }

    const { error: insertError } = await supabase.from("members").insert({
      username: normalized.username,
      password: normalized.password,
      nickname: normalized.nickname,
      bank_name: normalized.bankName,
      account_number: normalized.accountNumber,
      exchange_password: normalized.exchangePassword,
      phone_number: normalized.phoneNumber,
      referral_code: normalized.referralCode,
      signup_code: normalized.signupCode,
      site_name: normalized.siteName,
    });

    if (insertError) {
      return res.status(500).json({
        message: `회원가입 저장 실패: ${insertError.message}`,
      });
    }

    return res.status(200).json({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    console.error("signup api error:", error);

    return res.status(500).json({
      message: error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
    });
  }
}
