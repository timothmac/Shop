// File: app/search/RealSearchPage.tsx
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
  Box,
} from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { fetchProductsByName, Product } from "@/app/api/searchAPI";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Функция для формирования корректного URL изображения
const getImageUrl = (image: string | undefined): string => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  const formattedPath = image.startsWith("/") ? image : `/${image}`;
  return `${API_URL}${formattedPath}`;
};

export default function RealSearchPage() {
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

    if (name.trim()) {
      loadProducts();
    } else {
      setLoading(false);
    }
  }, [name]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

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
              {product.image ? (
                <CardMedia
                  component="img"
                  height="180"
                  image={getImageUrl(product.image)}
                  alt={product.name}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f0f0f0",
                    borderRadius: 2,
                  }}
                >
                  <ImageNotSupportedIcon sx={{ fontSize: 60, color: "grey" }} />
                </Box>
              )}
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" fontWeight="bold">
                  {product.price} грн
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
