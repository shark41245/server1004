import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

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

function hashText(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  try {
    const body = req.body ?? {};

    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "").trim();
    const nickname = String(body.nickname ?? "").trim();
    const bank = String(body.bank ?? "").trim();

    const accountNumber = String(
      body.account_number ?? body.accountNumber ?? ""
    ).trim();

    const withdrawPassword = String(
      body.withdraw_password ?? body.withdrawPassword ?? ""
    ).trim();

    const phone = String(body.phone ?? "").trim();
    const referralCode = String(
      body.referral_code ?? body.referralCode ?? ""
    ).trim();

    const signupCode = String(
      body.signup_code ?? body.signupCode ?? ""
    ).trim();

    const siteName = String(
      body.site_name ?? body.siteName ?? ""
    ).trim();

    if (!username || !password) {
      return res.status(400).json({
        message: "아이디와 비밀번호를 입력해 주세요."
      });
    }

    if (!nickname || !bank || !accountNumber) {
      return res.status(400).json({
        message: "닉네임, 은행, 계좌번호를 입력해 주세요."
      });
    }

    if (!withdrawPassword || !phone || !signupCode || !siteName) {
      return res.status(400).json({
        message: "필수 입력값이 비어 있습니다."
      });
    }

    const expectedSignupCode = String(process.env.SIGNUP_CODE ?? "").trim();

    if (!expectedSignupCode) {
      return res.status(500).json({
        message: "SIGNUP_CODE 환경변수가 설정되지 않았습니다."
      });
    }

    if (signupCode !== expectedSignupCode) {
      return res.status(400).json({
        message: "가입코드가 올바르지 않습니다."
      });
    }

    const supabase = getSupabase();

    const { data: existingUser, error: checkError } = await supabase
      .from("members")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        message: `중복 확인 실패: ${checkError.message}`
      });
    }

    if (existingUser) {
      return res.status(409).json({
        message: "이미 존재하는 아이디입니다."
      });
    }

    const { data, error } = await supabase
      .from("members")
      .insert({
        username,
        password_hash: hashText(password),
        nickname,
        bank,
        account_number: accountNumber,
        withdraw_password: hashText(withdrawPassword),
        phone,
        referral_code: referralCode,
        signup_code: signupCode,
        site_name: siteName
      })
      .select("id, username, nickname, bank, account_number, phone, created_at")
      .single();

    if (error) {
      return res.status(500).json({
        message: `회원가입 저장 실패: ${error.message}`
      });
    }

    return res.status(200).json({
      message: "회원가입이 완료되었습니다.",
      member: data
    });

  } catch (error) {
    console.error("signup api error:", error);

    return res.status(500).json({
      message: error instanceof Error ? error.message : "서버 오류가 발생했습니다."
    });
  }
}
