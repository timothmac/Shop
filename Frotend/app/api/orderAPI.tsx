// order.types.ts

export interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  comment: string;
  deliveryMethod: string;
  paymentMethod: string;
  totalPrice:number;
  orderItems: OrderItem[];
}

// orderService.ts

import axios from 'axios';



const API_URL = 'http://localhost:3000';

export async function createOrder(order: Order) {
  // Отримуємо токен з localStorage, припускаючи, що він збережений під ключем "userToken"
  const token = localStorage.getItem('user');
  const Authorization = JSON.parse(token).accessToken;
  console.log(order);
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Якщо токен існує, додаємо його в заголовок Authorization
      ...(Authorization && { Authorization: `Bearer ${Authorization}` }),
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error('Помилка створення замовлення');
  }

  return response.json();
}
export async function getOrdersByUserId(userId: string) {
  const token = localStorage.getItem('user');
  const Authorization = token ? JSON.parse(token).accessToken : null;

  const response = await fetch(`${API_URL}/orders/my-orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(Authorization && { Authorization: `Bearer ${Authorization}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Помилка отримання замовлень користувача');
  }

  return response.json();
}
export async function fetchOrders() {
  const token = localStorage.getItem('user');
  const Authorization = token ? JSON.parse(token).accessToken : null;

  const response = await fetch(`${API_URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(Authorization && { Authorization: `Bearer ${Authorization}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Помилка отримання замовлень користувача');
  }

  return response.json();
}