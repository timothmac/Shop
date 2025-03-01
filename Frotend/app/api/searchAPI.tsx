export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  image: string;
}

export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  console.log(`Fetching products by category: ${categoryId}`);
  try {
    const response = await fetch(`http://localhost:3000/products/search?category=${categoryId}`);
    if (!response.ok) {
      console.error("Error fetching products by category:", response.status, response.statusText);
      throw new Error("Помилка завантаження продуктів");
    }
    const products: Product[] = await response.json();
    console.log("Fetched products by category:", products);
    return products;
  } catch (error) {
    console.error("Error in fetchProductsByCategory:", error);
    throw error;
  }
}

export async function fetchProductsByName(name: string): Promise<Product[]> {
  console.log(`Fetching products by name: ${name}`);
  try {
    const response = await fetch(`http://localhost:3000/products/search?name=${encodeURIComponent(name)}`);
    if (!response.ok) {
      console.error("Error fetching products by name:", response.status, response.statusText);
      throw new Error("Помилка завантаження продуктів");
    }
    const products: Product[] = await response.json();
    console.log("Fetched products by name:", products);
    return products;
  } catch (error) {
    console.error("Error in fetchProductsByName:", error);
    throw error;
  }
}
