"use client"; // Обязательно в начале файла, если используете App Router

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
} from "@mui/material";
import {fetchProducts , Product } from "./api/productAPI";
// // ===== Интерфейс, описывающий структуру продукта =====
// interface Product {
//   id: number;
//   name: string;
//   price: string;  // или number, если на бэкенде число
//   image: string;
// }

// // ===== Функция для загрузки продуктов с бэкенда =====
// async function fetchProducts(): Promise<Product[]> {
//   const response = await fetch("http://localhost:3000/products");
//   if (!response.ok) {
//     throw new Error("Помилка завантаження продуктів");
//   }
//   return response.json();
// }

// ===== Главный компонент страницы, отображающий продукты =====
export default function ProductsPage() {
  const router = useRouter();

  // Состояния
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем продукты при монтировании
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Помилка завантаження продуктів:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Переход на детальную страницу продукта (пример)
  const handleProductClick = (id: number) => {
    // Предполагается, что у вас есть маршрут [id].tsx в /app/product/ или /pages/product/...
    router.push(`/product/${id}`);
  };

  // Показать индикатор загрузки, пока запрос не завершён
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Основной рендер
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Продукти
      </Typography>

      {/* Сетка карточек продуктов */}
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card
              sx={{ boxShadow: 3, borderRadius: 2, cursor: "pointer" }}
              onClick={() => handleProductClick(product.id)}
            >
              <CardMedia
                component="img"
                height="180"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="textSecondary"
                  fontWeight="bold"
                >
                  {product.price}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
                >
                  Купити
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
