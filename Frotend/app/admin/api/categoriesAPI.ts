import axios from "axios";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Функція для отримання заголовків авторизації з localStorage
const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.accessToken) {
          return {
            Authorization: `Bearer ${parsedUser.accessToken}`,
          };
        }
      } catch (error) {
        console.error("Помилка парсингу токена:", error);
      }
    }
  }
  return {};
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // дозволяє відправляти куки
});

// Функція для отримання всіх категорій
export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await axiosInstance.get("/categories", {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Помилка завантаження категорій:", error);
    throw new Error("Помилка завантаження категорій");
  }
}

// Функція для отримання категорії по ID
export async function fetchCategoryById(categoryId: string): Promise<Category> {
  try {
    const response = await axiosInstance.get(`/categories/${categoryId}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error(`❌ Помилка завантаження категорії (ID: ${categoryId}):`, error);
    throw new Error(`Помилка завантаження категорії ${categoryId}`);
  }
}

// Функція для створення категорії
export async function createCategory(categoryData: { name: string; description: string }): Promise<Category> {
  try {
    const response = await axiosInstance.post("/categories", categoryData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Помилка при створенні категорії:", error);
    throw new Error("Помилка при створенні категорії");
  }
}
