import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }

  return createClient(url, serviceRoleKey);
}

function verifyToken(token: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET 환경변수가 없습니다.");
  }

  const [base, signature] = token.split(".");
  if (!base || !signature) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(base).digest("hex");
  if (expected !== signature) {
    return false;
  }

  const payload = JSON.parse(Buffer.from(base, "base64url").toString("utf8")) as {
    exp: number;
  };

  if (Date.now() > payload.exp) {
    return false;
  }

  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

    if (!token || !verifyToken(token)) {
      return res.status(401).json({ message: "관리자 인증이 필요합니다." });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("members")
      .select(
        "id, username, password, nickname, bank_name, account_number, exchange_password, phone_number, referral_code, signup_code, site_name, created_at",
      )
      .order("id", { ascending: false });

    if (error) {
      return res.status(500).json({ message: `회원 목록 조회 실패: ${error.message}` });
    }

    return res.status(200).json({
      members: data ?? [],
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
    });
  }
}
