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
    const response = await fetch(`http://localhost:3000/products/search?category=${categoryId}`);
  
    if (!response.ok) {
      throw new Error("Помилка завантаження продуктів");
    }
  
    return response.json();
  }
    
  export async function fetchProductsByName(name: string): Promise<Product[]> {
    const response = await fetch(`http://localhost:3000/products/search?name=${name}`);
  
    if (!response.ok) {
      throw new Error("Помилка завантаження продуктів");
    }
  
    return response.json();
  }
  