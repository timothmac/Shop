"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useState } from "react";
import { loginUser } from "../api/loginAPI"; // API-функція для входу

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Невірний формат email")
    .required("Обов'язкове поле"),
  password: Yup.string().required("Обов'язкове поле"),
});

export default function AdminLoginForm({
  onLoginSuccess,
}: {
  onLoginSuccess: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setErrorMessage(""); // Очистка попередньої помилки
        try {
          const response = await loginUser({
            email: values.email,
            password: values.password,
          });

          console.log("Успішний вхід:", response);

          // Очікується, що відповідь містить дані користувача з роллю
          if (!response.user || (response.user.role !== "admin" && response.user.role !== "manager")) {
            throw new Error("Недостатньо прав для доступу ");
          }

          // Збереження користувача в локальному сховищі
          localStorage.setItem("user", JSON.stringify(response));

          // Викликаємо колбек після успішного входу
          onLoginSuccess();
          
        } catch (error: any) {
          setErrorMessage(error.message || "Помилка входу");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Box
            sx={{
              width: 350,
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 3,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              fullWidth
            />

            <TextField
              label="Пароль"
              variant="outlined"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              fullWidth
            />

            {errorMessage && (
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                backgroundColor: "#FFC107",
                color: "#000",
                "&:hover": { backgroundColor: "#FFB300" },
              }}
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? "Вхід..." : "Увійти"}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
