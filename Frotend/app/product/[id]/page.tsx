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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCart } from "../../contetx/cartContext"; // Проверьте путь!

// Симуляция базы данных товаров
const products = [
  {
    id: 1,
    name: "АКВАПАНЕЛЬ – ЦЕМ. ПЛИТА ДЛЯ ВНУТРЕННИХ РАБОТ",
    price: 452.17, // цена хранится как число для удобства вычислений
    article: "70184625194",
    unit: "м²",
    image: "https://stroyzone.com/upload/iblock/950/70184625194.webp",
    description:
      "Возведение облицовок, перегородок або постройка стен осуществляется с помощью качественной цементной плиты Аквапанель...",
  },
  {
    id: 2,
    name: "ggfgf",
    price: 45, // цена хранится как число для удобства вычислений
    article: "70184625194",
    unit: "м²",
    image: "https://stroyzone.com/upload/iblock/950/70184625194.webp",
    description:
      "Возведение облицовок, перегородок або постройка стен осуществляется с помощью качественной цементной плиты Аквапанель...",
  },
];

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(0);
  const { addToCart } = useCart(); // Получаем функцию добавления из контекста

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === Number(id));
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ❌ Товар не знайдено
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Можливо, ви перейшли за невірним посиланням або товар видалено.
        </Typography>
      </Container>
    );
  }

  const handleBuy = () => {
    addToCart(product, quantity);
    // По желанию, можно добавить уведомление о том, что товар добавлен в корзину.
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Изображение товара */}
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            height="300"
            image={product.image}
            alt={product.name}
            sx={{ borderRadius: 2 }}
          />
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
          <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mt: 2 }}>
            {product.price} ₴
          </Typography>

          {/* Выбор количества */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
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
          <Tab label="ВІДГУКИ (0)" />
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
          <Typography variant="body1" color="textSecondary">
            Поки відгуків немає. Будьте першим, хто залишить відгук!
          </Typography>
        )}
      </Box>
    </Container>
  );
}
