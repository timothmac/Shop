"use client";

import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string; description: string }) => void;
}

// Схема валідації з Yup
const CategorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Назва категорії обов’язкова!"),
  description: Yup.string().trim(), // опис не є обов’язковим
});

export default function CategoryForm({
  open,
  onClose,
  onSubmit,
}: CategoryFormProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Створити категорію</DialogTitle>
      <Formik
        initialValues={{ name: "", description: "" }}
        validationSchema={CategorySchema}
        onSubmit={(values, { resetForm }) => {
          onSubmit({
            name: values.name.trim(),
            description: values.description.trim(),
          });
          resetForm();
          onClose();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
        }) => (
          <Form>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  autoFocus
                  label="Назва категорії"
                  name="name"
                  fullWidth
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name ? errors.name : ""}
                />
                <TextField
                  label="Опис категорії"
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.description && Boolean(errors.description)}
                  helperText={
                    touched.description && errors.description
                      ? errors.description
                      : ""
                  }
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Скасувати</Button>
              <Button type="submit" variant="contained" color="primary">
                Створити
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
