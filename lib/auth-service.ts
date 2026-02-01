export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to login");
  }

  return response.json();
}

export async function registerUser(email: string, password: string, name?: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to register");
  }

  return response.json();
}

export async function verifyEmail(token: string) {
  const response = await fetch(`${API_URL}/auth/verify-email?token=${token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to verify email");
  }

  return response.json();
}

export async function logoutUser() {
  const token = localStorage.getItem("emobo-token");
  if (!token) return;

  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  localStorage.removeItem("emobo-token");
  localStorage.removeItem("emobo-user");

  // Clear cookies
  document.cookie = "emobo-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "emobo-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "emobo-role=; path=/; max-age=0; samesite=lax";
  document.cookie = "emobo-token=; path=/; max-age=0; samesite=lax";

  return response.ok;
}
