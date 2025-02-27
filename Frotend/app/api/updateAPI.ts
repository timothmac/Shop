export interface UpdateUserPayload {
    email?: string;
    fullName?: string;
    address?: string;
    phoneNumber?: string;
    city?: string;
  }
  
  export interface UpdateUserResponse {
    user: {
      id: number;
      email: string;
      fullName: string;
      address: string;
      phoneNumber: string;
      city: string;
      role: string;
    };
    accessToken: string;
  }
  
  export async function updateUser(payload: UpdateUserPayload): Promise<UpdateUserResponse> {
    console.log(payload)
    const token = localStorage.getItem('user');
    const accessToken = token ? JSON.parse(token).accessToken : null;
    const id = token ? JSON.parse(token).user.id : null
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || "Помилка оновлення користувача");
    }
  
    return data;
  }