import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Функція для отримання заголовків авторизації з localStorage
const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.accessToken) {
          return { Authorization: `Bearer ${parsedUser.accessToken}` };
        }
      } catch (error) {
        console.error("Помилка парсингу токена:", error);
      }
    }
  }
  return {};
};

// Конфігурація axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Якщо API працює з куками
});

// Функція для отримання всіх продуктів
export const getProducts = async () => {
  try {

    const response = await axiosInstance.get("/products", {
      headers: getAuthHeaders(),
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Помилка при отриманні списку продуктів:", error);
    throw new Error("Помилка при отриманні списку продуктів");
  }
};

// Функція для отримання продукту за ID
export const getProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при отриманні продукту:", error);
    throw new Error("Помилка при отриманні продукту");
  }
};

// Функція для створення продукту
export const createProduct = async (productData: FormData) => {
  try {
    console.log(productData)
    const response = await axiosInstance.post("/products", productData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data", // Важливо для FormData
      },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при створенні продукту:", error);
    throw new Error("Помилка при створенні продукту");
  }
};

// Функція для оновлення продукту
export const updateProduct = async (id: string, productData: FormData) => {
  try {
    const response = await axiosInstance.patch(`/products/${id}`, productData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при оновленні продукту:", error);
    throw new Error("Помилка при оновленні продукту");
  }
};

// Функція для видалення продукту
export const deleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Помилка при видаленні продукту:", error);
    throw new Error("Помилка при видаленні продукту");
  }
};
