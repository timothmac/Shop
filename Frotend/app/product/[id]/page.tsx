"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Grid,
  CardMedia,
  Button,
  Box,
  IconButton,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonIcon from "@mui/icons-material/Person";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { useCart } from "../../contetx/cartContext"; // Проверьте путь!

// Определяем базовый URL для бэкенда
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Интерфейс продукта (с отзывами)
interface Product {
  id: string;
  name: string;
  price: number;
  article: string;
  unit: string;
  image: string;
  description: string;
  reviews: Review[];
}

// Интерфейс отзывов
interface Review {
  id: string;
  rating: number;
  content: string;
  user: {
    fullName: string;
  };
}

// Функция для формирования корректного URL изображения
const getImageUrl = (image: string | undefined): string => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  // Если image не начинается со слэша, добавляем его
  const formattedPath = image.startsWith("/") ? image : `/${image}`;
  return `${API_URL}${formattedPath}`;
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart(); // Получаем функцию добавления в корзину

  // Загрузка данных с бэкенда
  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        if (!response.ok) {
          throw new Error("Товар не знайдено");
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Если загрузка данных
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // Если возникла ошибка
  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ❌ {error || "Товар не знайдено"}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Можливо, ви перейшли за невірним посиланням або товар видалено.
        </Typography>
      </Container>
    );
  }

  // Добавить товар в корзину
  const handleBuy = () => {
    addToCart(product, quantity);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Изображение товара */}
        <Grid item xs={12} md={6}>
          {product.image ? (
            <CardMedia
              component="img"
              height="300"
              image={getImageUrl(product.image)}
              alt={product.name}
              sx={{ borderRadius: 2 }}
            />
          ) : (
            <Box
              sx={{
                height: 300,
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
        </Grid>

        {/* Информация о товаре */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Артикул: {product.article}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Единицы измерения: {product.unit}
          </Typography>
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{ mt: 2 }}
          >
            {product.price} ₴
          </Typography>

          {/* Выбор количества */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <IconButton
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6">{quantity}</Typography>
            <IconButton onClick={() => setQuantity(quantity + 1)}>
              <AddIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{
              mt: 2,
              textTransform: "none",
              fontWeight: "bold",
              width: "100%",
            }}
            onClick={handleBuy}
          >
            Купити
          </Button>
        </Grid>
      </Grid>

      {/* Табуляция "Опис", "Характеристики", "Відгуки" */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)}>
          <Tab label="ОПИСАННЯ" />
          <Tab label="ХАРАКТЕРИСТИКИ" />
          <Tab label={`ВІДГУКИ (${product.reviews.length})`} />
        </Tabs>
        <Divider sx={{ mb: 2 }} />

        {tab === 0 && (
          <Typography variant="body1" color="textSecondary">
            {product.description}
          </Typography>
        )}
        {tab === 1 && (
          <Typography variant="body1" color="textSecondary">
            Технічні характеристики товару будуть тут...
          </Typography>
        )}
        {tab === 2 && (
          <Box>
            {product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <Box
                  key={review.id}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  {/* Аватар пользователя */}
                  <Avatar sx={{ bgcolor: "gray", mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    {/* Имя пользователя */}
                    <Typography variant="subtitle1" fontWeight="bold">
                      {review.user.fullName}
                    </Typography>
                    {/* Рейтинг */}
                    <Typography variant="body2" color="textSecondary">
                      Оцінка: {review.rating} ⭐
                    </Typography>
                    {/* Текст отзыва */}
                    <Typography variant="body1">{review.content}</Typography>
                    <Divider sx={{ mt: 1 }} />
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                Поки відгуків немає. Будьте першим, хто залишить відгук!
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}
