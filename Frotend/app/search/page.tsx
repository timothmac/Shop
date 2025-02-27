"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { fetchProductsByName, Product } from "@/app/api/searchAPI";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || ""; // Получаем значение name из URL (?name=...).

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем продукты, когда меняется значение name в URL
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProductsByName(name);
        setProducts(data);
      } catch (error) {
        console.error("Помилка завантаження продуктів:", error);
      } finally {
        setLoading(false);
      }
    }

    // Если name пустое, не вызываем запрос
    if (name.trim()) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [name]);

  // Показываем индикатор, пока идёт загрузка
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Если товаров по поиску нет
  if (!products.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Результати пошуку для: {name}
        </Typography>
        <Typography variant="body1">Нічого не знайдено</Typography>
      </Container>
    );
  }

  // Основной рендер продуктов
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Результати пошуку для: {name}
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card
              sx={{ boxShadow: 3, borderRadius: 2, cursor: "pointer" }}
              onClick={() => router.push(`/product/${product.id}`)}
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
                <Typography variant="body1" color="textSecondary" fontWeight="bold">
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
