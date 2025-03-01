export interface Category {
    id: number;
    name: string;
  }
  
export async function fetchCategories(): Promise<Category[]> {
 
    const response = await fetch("http://localhost:3000/categories");
    if (!response.ok) {
      throw new Error("Помилка завантаження категорій");
    }
    console.log(response)
    return response.json();
  }
  