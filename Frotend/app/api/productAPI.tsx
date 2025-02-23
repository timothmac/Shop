export interface Product {
    id: number;
    name: string;
    price: string;  // или number, если на бэкенде число
    image: string;
  }
  
  // ===== Функция для загрузки продуктов с бэкенда =====
  export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) {
      throw new Error("Помилка завантаження продуктів");
    }
    return response.json();
  }