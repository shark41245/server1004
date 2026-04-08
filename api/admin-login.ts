import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

function createToken() {
  const payload = {
    exp: Date.now() + 1000 * 60 * 60 * 8,
  };

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET 환경변수가 없습니다.");
  }

  const base = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(base).digest("hex");

  return `${base}.${signature}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "허용되지 않은 메서드입니다." });
  }

  try {
    const { password } = req.body ?? {};
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({ message: "ADMIN_PASSWORD 환경변수가 없습니다." });
    }

    if (!password || String(password) !== adminPassword) {
      return res.status(401).json({ message: "관리자 비밀번호가 올바르지 않습니다." });
    }

    const token = createToken();

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "관리자 로그인 처리 중 오류",
    });
  }
}
