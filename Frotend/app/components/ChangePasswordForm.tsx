import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

// Схема валидации
const validationSchema = Yup.object({
  currentPassword: Yup.string().required("Обов'язкове поле"),
  newPassword: Yup.string()
    .min(6, "Пароль повинен містити мінімум 6 символів")
    .required("Обов'язкове поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Паролі не співпадають")
    .required("Обов'язкове поле"),
});

const ChangePasswordForm = ({ onClose }) => {
  return (
    <Formik
      initialValues={{
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Новий пароль:", values.newPassword);
        alert("Пароль змінено!");
        setSubmitting(false);
        onClose(); // Закрываем модальное окно
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <LockIcon sx={{ mr: 1, color: "primary.main" }} />
            Змінити пароль
          </Typography>

          <Field
            as={TextField}
            fullWidth
            label="Поточний пароль"
            name="currentPassword"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.currentPassword && Boolean(errors.currentPassword)}
            helperText={touched.currentPassword && errors.currentPassword}
            margin="normal"
          />

          <Field
            as={TextField}
            fullWidth
            label="Новий пароль"
            name="newPassword"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.newPassword && Boolean(errors.newPassword)}
            helperText={touched.newPassword && errors.newPassword}
            margin="normal"
          />

          <Field
            as={TextField}
            fullWidth
            label="Підтвердити пароль"
            name="confirmPassword"
            type="password"
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            helperText={touched.confirmPassword && errors.confirmPassword}
            margin="normal"
          />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              Змінити пароль
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePasswordForm;
