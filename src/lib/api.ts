export type SignupPayload = {
  username: string;
  password: string;
  nickname: string;
  bankName: string;
  accountNumber: string;
  exchangePassword: string;
  phoneNumber: string;
  referralCode: string;
  signupCode: string;
  siteName: string;
};

export type MemberRow = {
  id: number;
  username: string;
  password: string;
  nickname: string;
  bank_name: string;
  account_number: string;
  exchange_password: string;
  phone_number: string;
  referral_code: string;
  signup_code: string;
  site_name: string;
  created_at: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { message?: string };

  if (!response.ok) {
    throw new Error(data.message || "요청 처리에 실패했습니다.");
  }

  return data;
}

export async function signup(payload: SignupPayload) {
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ message: string }>(response);
}

export async function adminLogin(password: string) {
  const response = await fetch("/api/admin-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  return parseResponse<{ token: string }>(response);
}

export async function getMembers(token: string) {
  const response = await fetch("/api/admin-members", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse<{ members: MemberRow[] }>(response);
}
