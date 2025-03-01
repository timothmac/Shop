"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { fetchProductsByCategory, Product } from "../../api/searchAPI";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id; // Получаем id категории из URL

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProductsByCategory(categoryId);
        setProducts(data);
      } catch (error) {
        console.error("Помилка завантаження продуктів:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [categoryId]);

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
        Продукти в категорії
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
                image={
                  product.image
                    ? product.image.startsWith("http")
                      ? product.image
                      : `${API_URL}${product.image}`
                    : "/placeholder.png"
                }
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png";
                }}
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
