"use client";

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Category } from "../types/Category";
import { Product } from "../types/Product";

export interface UpdateFormValues {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  image: File | null;
  imageUrl?: string; // текущий URL изображения, если есть
}

interface ProductUpdateFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateFormValues) => Promise<void>;
  categories: Category[];
  initialValues: UpdateFormValues;
}

const updateProductValidationSchema = Yup.object({
  name: Yup.string().required("Обов'язкове поле"),
  description: Yup.string().required("Обов'язкове поле"),
  price: Yup.number()
    .typeError("Ціна має бути числом")
    .min(0.01, "Ціна має бути не менше 0.01")
    .required("Обов'язкове поле"),
  stock: Yup.number()
    .typeError("Кількість має бути числом")
    .min(0, "Кількість має бути додатньою")
    .required("Обов'язкове поле"),
  categoryId: Yup.string().required("Обов'язкове поле"),
});

// Компонент для предварительного просмотра изображения
const ImagePreview: React.FC<{ file: File | null; imageUrl?: string }> = ({
  file,
  imageUrl,
}) => {
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (file && file instanceof Blob) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (imageUrl) {
      setPreview(imageUrl);
    } else {
      setPreview(null);
    }
  }, [file, imageUrl]);

  if (!preview) return null;
  return (
    <Box sx={{ mt: 2, textAlign: "center" }}>
      <img
        src={preview}
        alt="Попередній перегляд"
        style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
      />
    </Box>
  );
};

export default function ProductUpdateForm({
  open,
  onClose,
  onSubmit,
  categories,
  initialValues,
}: ProductUpdateFormProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Оновити товар</DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={{
            id: initialValues.id || "",
            name: initialValues.name || "",
            description: initialValues.description || "",
            price: initialValues.price !== undefined ? initialValues.price : "",
            stock: initialValues.stock !== undefined ? initialValues.stock : "",
            categoryId: initialValues.categoryId || "",
            image: initialValues.image || null,
            imageUrl: initialValues.imageUrl || "",
          }}
          validationSchema={updateProductValidationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Назва товару"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  fullWidth
                />
                <TextField
                  label="Опис товару"
                  name="description"
                  multiline
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                  fullWidth
                />
                <TextField
                  label="Ціна"
                  name="price"
                  type="number"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  fullWidth
                />
                <TextField
                  label="Кількість"
                  name="stock"
                  type="number"
                  value={values.stock}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.stock && Boolean(errors.stock)}
                  helperText={touched.stock && errors.stock}
                  fullWidth
                />
                <FormControl fullWidth>
                  <InputLabel id="update-category-select-label">
                    Категорія
                  </InputLabel>
                  <Select
                    labelId="update-category-select-label"
                    name="categoryId"
                    value={values.categoryId}
                    label="Категорія"
                    onChange={handleChange}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="outlined" component="label">
                  Завантажити нове зображення
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.currentTarget.files && e.currentTarget.files[0]) {
                        setFieldValue("image", e.currentTarget.files[0]);
                      }
                    }}
                  />
                </Button>
                <ImagePreview file={values.image} imageUrl={values.imageUrl} />
              </Box>
              <DialogActions sx={{ mt: 2, p: 0 }}>
                <Button onClick={onClose} color="inherit">
                  Скасувати
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  Оновити
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
