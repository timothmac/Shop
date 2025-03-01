const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Читаємо URL з env

// Функція для отримання заголовків авторизації з localStorage
const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${parsedUser.accessToken}`,
        };
      } catch (error) {
        console.error("Помилка парсингу токена:", error);
      }
    }
  }
  return { "Content-Type": "application/json" };
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include", // якщо використовуєте cookies
  });
  if (!response.ok) throw new Error("Помилка при отриманні списку користувачів");
  return response.json();
};

export const getUserById = async (id: string) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Помилка при отриманні користувача");
  return response.json();
};

export const createUser = async (userData: any) => {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Помилка при створенні користувача");
  return response.json();
};

export const updateUser = async (id: string, userData: any) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Помилка при оновленні користувача");
  return response.json();
};

export const deleteUser = async (id: string) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Помилка при видаленні користувача");
  // Якщо відповідь пуста, повертаємо {}
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
};

