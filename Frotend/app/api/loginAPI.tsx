// api/auth.ts

export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    user: {
      id: number;
      email: string;
      fullName: string;
      address: string;
      phoneNumber: string;
      role: string;
    };
    accessToken: string;
  }
  
  export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Помилка входу");
    }
  
    return data;
  }
  