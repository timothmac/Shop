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
  Box,
} from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { fetchProducts, Product } from "./api/productAPI";

// Определяем базовый URL для бэкенда
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
    router.push(`/product/${id}`);
  };

  // Функция для формирования корректного URL изображения
  const getImageUrl = (image: string | undefined) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    // Если image не начинается со слэша, добавляем его
    const formattedPath = image.startsWith("/") ? image : `/${image}`;
    return `${API_URL}${formattedPath}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Продукти
      </Typography>

      {/* Сетка карточек продуктов */}
      <Grid container spacing={4}>
        {products.map((product) => {
          const imageUrl = getImageUrl(product.image);
          console.log(`Product ID ${product.id} image URL:`, imageUrl); // для отладки

          return (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                sx={{ boxShadow: 3, borderRadius: 2, cursor: "pointer" }}
                onClick={() => handleProductClick(product.id)}
              >
                {product.image ? (
                  <CardMedia
                    component="img"
                    height="180"
                    image={imageUrl}
                    alt={product.name}
                    onError={(e) => {
                      // Если произошла ошибка загрузки изображения, можно заменить на иконку
                      e.currentTarget.onerror = null; // чтобы не зациклить замену
                      e.currentTarget.src = "";
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <ImageNotSupportedIcon sx={{ fontSize: 50, color: "grey" }} />
                  </Box>
                )}
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
          );
        })}
      </Grid>
    </Container>
  );
}
