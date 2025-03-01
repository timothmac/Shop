import axios from "axios";

export interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
  };
  quantity: number;
  price: string;
}

export interface Order {
  id: string;
  user: {
    id: string;
    email: string;
    role: string;
    city: string;
    fullName: string;
    address: string;
    phoneNumber: string;
  };
  orderItems: OrderItem[];
  totalPrice: string;
  status: string;
  city: string;
  address: string;
  paymentMethod: string;
  deliveryMethod: string;
  fullName: string;
  email: string;
  phone: string;
  comment: string;
  createdAt: string;
}
export enum OrderStatus {
    PENDING = 'pending',
    SHIPPED = 'shipped',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
  }
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

export async function fetchOrders(): Promise<Order[]> {
  try {
    const response = await axios.get(`${API_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Помилка отримання замовлень користувача:", error);
    throw new Error("Помилка отримання замовлень користувача");
  }
}

export async function updateOrder(id: string, updateData: Partial<Order>): Promise<Order> {
  try {
    const response = await axios.patch(`${API_URL}/orders/${id}`, updateData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Помилка оновлення замовлення:", error);
    throw new Error("Помилка оновлення замовлення");
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Помилка видалення замовлення:", error);
    throw new Error("Помилка видалення замовлення");
  }
}
