"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";
import ProductDetails from "../components/ProductDetails";
import CategoryForm from "../components/CategoryForm"; // компонент для создания категории
import { Product } from "../types/Product";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productsAPI";
import {
  fetchCategories,
  createCategory,
  Category,
} from "../api/categoriesAPI";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Помилка завантаження товарів:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Помилка завантаження категорій:", error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: "",
      image: "",
    });
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Видалити товар?")) return;
    try {
      setLoading(true);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error("Помилка при видаленні товару:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product: Product) => {
    setViewProduct(product);
  };

  // Открыть форму создания категории
  const handleAddCategory = () => {
    setShowCategoryForm(true);
  };

  // Обработка отправки формы создания категории
  const handleCategorySubmit = async (values: { name: string }) => {
    try {
      await createCategory(values);
      await loadCategories();
      setShowCategoryForm(false);
    } catch (error) {
      console.error("Помилка при створенні категорії:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Заголовок и панель действий */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Адміністрування товарів
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={handleAddProduct}
          >
            Додати товар
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleAddCategory}
          >
            Створити категорію
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ProductList
          products={products}
          categories={categories}
          onEdit={handleEditProduct}
          onView={handleViewProduct}
          onAdd={handleAddProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {selectedProduct && (
        <ProductForm
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSubmit={async (values) => {
            if (values.id) {
              await updateProduct(values.id, values);
            } else {
              await createProduct(values);
            }
            await loadProducts();
            setSelectedProduct(null);
          }}
          categories={categories}
          initialValues={selectedProduct}
          isEditing={!!selectedProduct.id}
        />
      )}

      {viewProduct && (
        <ProductDetails
          product={viewProduct}
          categories={categories}
          onClose={() => setViewProduct(null)}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          open={showCategoryForm}
          onClose={() => setShowCategoryForm(false)}
          onSubmit={handleCategorySubmit}
        />
      )}
    </Container>
  );
}
