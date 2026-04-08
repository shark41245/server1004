export type SignupPayload = {
  username: string;
  password: string;
};

export type MemberRow = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

export async function signup(payload: SignupPayload) {
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "회원가입에 실패했습니다.");
  }

  return data;
}

export async function adminLogin(password: string) {
  const response = await fetch("/api/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "관리자 로그인에 실패했습니다.");
  }

  return data as { token: string };
}

export async function getMembers(token: string) {
  const response = await fetch("/api/admin-members", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "회원 목록을 불러오지 못했습니다.");
  }

  return data as { members: MemberRow[] };
}
