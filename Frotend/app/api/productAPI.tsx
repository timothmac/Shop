export interface Product {
    id: number;          
    name: string;        
    description: string; 
    price: number;       
    stock: number;       
    categoryId: string;  
    image: string;       
  }
  

  export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch("http://localhost:3000/products");
    if (!response.ok) {
      throw new Error("Помилка завантаження продуктів");
    }
    return response.json();
  }