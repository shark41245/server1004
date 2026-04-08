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

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({ message: "아이디와 비밀번호를 입력해 주세요." });
    }

    const cleanedUsername = String(username).trim();
    const cleanedPassword = String(password).trim();

    if (cleanedUsername.length < 2) {
      return res.status(400).json({ message: "아이디는 2자 이상이어야 합니다." });
    }

    if (cleanedPassword.length < 4) {
      return res.status(400).json({ message: "비밀번호는 4자 이상이어야 합니다." });
    }

    const supabase = getSupabase();

    const { data: existingUser, error: checkError } = await supabase
      .from("members")
      .select("id")
      .eq("username", cleanedUsername)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({ message: "중복 확인 중 오류가 발생했습니다." });
    }

    if (existingUser) {
      return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }

    const passwordHash = hashPassword(cleanedPassword);

    const { error: insertError } = await supabase.from("members").insert({
      username: cleanedUsername,
      password_hash: passwordHash,
    });

    if (insertError) {
      return res.status(500).json({ message: "회원가입 저장에 실패했습니다." });
    }

    return res.status(200).json({
      message: "회원가입이 완료되었습니다.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
    });
  }
}
