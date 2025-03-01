import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Product } from "../types/Product";
import { Category } from "../types/Category";

interface Props {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
}

export default function ProductDetails({ product, categories, onClose }: Props) {
  if (!product) return null;

  // Базова адреса API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  // Якщо фото відсутнє, використовується placeholder (переконайтеся, що цей файл є у public)
  const placeholderImage = "/placeholder.png";

  // Функція формування повного URL для зображення
  const getImageUrl = (image: string | undefined): string => {
    if (!image) return placeholderImage;
    if (image.startsWith("http")) return image;
    // Припускаємо, що в базі зберігається тільки ім'я файлу, тому додаємо /uploads/ як префікс
    return `${API_URL}/uploads/${image}`;
  };

  // Отримуємо URL зображення
  const imageUrl = getImageUrl(product.imageUrl);

  return (
    <Dialog open={Boolean(product)} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {product.name}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            component="img"
            src={imageUrl}
            alt={product.name}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
          <Typography variant="h6">Ціна: {product.price} грн</Typography>
          <Typography variant="h6">
            Категорія:{" "}
            {categories.find((cat) => cat.id === product.categoryId)?.name ||
              "Невідомо"}
          </Typography>
          {product.description && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              Опис: {product.description}
            </Typography>
          )}
          {product.stock !== undefined && (
            <Typography variant="body1">На складі: {product.stock}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
