"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  CircularProgress,
  Typography,
  TextField,
  FormControl,
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { Product } from "../types/Product";
import { getProducts, deleteProduct, updateProduct } from "../api/productsAPI";
import { fetchCategories, Category } from "../api/categoriesAPI";
import ProductUpdateForm from "../components/ProductUpdateForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Props {
  onView: (product: Product) => void;
}

export default function ProductList({ onView }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Состояние для редактируемого товара
  const [updateProductItem, setUpdateProductItem] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("❌ Помилка завантаження товарів:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("❌ Помилка завантаження категорій:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цей товар?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error("❌ Помилка при видаленні товару:", error);
    }
  };

  // Фильтрация товаров по поиску и категории
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // Поддержка как вложенного объекта, так и прямого поля categoryId
    const productCategoryId = product.category?.id || product.categoryId;
    const matchesCategory =
      selectedCategory === "all" || productCategoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box sx={{ mt: 2 }}>
      {/* Панель поиска и фильтрации */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Paper
          component="form"
          sx={{
            p: "4px 8px",
            display: "flex",
            alignItems: "center",
            flex: 1,
          }}
        >
          <TextField
            placeholder="Пошук товарів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel id="filter-category-label">Категорія</InputLabel>
          <Select
            labelId="filter-category-label"
            label="Категорія"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="all">Всі категорії</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ boxShadow: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Назва</TableCell>
                  <TableCell>Ціна</TableCell>
                  <TableCell>Категорія</TableCell>
                  <TableCell>Зображення</TableCell>
                  <TableCell align="right">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price} грн</TableCell>
                      <TableCell>
                        {product.category?.name ||
                          product.categoryId ||
                          "Невідомо"}
                      </TableCell>
                      <TableCell>
                        {product.image ? (
                          <img
                            src={
                              product.image.startsWith("http")
                                ? product.image
                                : `${API_URL}${product.image}`
                            }
                            alt={product.name}
                            style={{ height: 50 }}
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.png";
                            }}
                          />
                        ) : (
                          "Немає"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Переглянути">
                          <IconButton
                            color="info"
                            onClick={() => onView(product)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Редагувати">
                          <IconButton
                            color="primary"
                            onClick={() => setUpdateProductItem(product)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Видалити">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(product.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="textSecondary">
                        Товарів немає
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Форма обновления товара */}
      {updateProductItem && (
        <ProductUpdateForm
          open={Boolean(updateProductItem)}
          onClose={() => setUpdateProductItem(null)}
          onSubmit={async (values) => {
            await updateProduct(values.id, values);
            await loadProducts();
            setUpdateProductItem(null);
          }}
          categories={categories}
          initialValues={updateProductItem as any}
        />
      )}
    </Box>
  );
}
