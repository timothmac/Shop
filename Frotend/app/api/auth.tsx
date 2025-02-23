// api/auth.ts

export interface RegisterPayload {
    email: string;
    password: string;
    fullName: string;
    address: string;
    phoneNumber: string;
  }
  
  export interface RegisterResponse {
    user: {
      id: number;
      email: string;
      fullName: string;
      address: string;
      phoneNumber: string;
    };
    accessToken: string;
  }
  
  export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Помилка реєстрації");
    }
  
    return data;
  }
  