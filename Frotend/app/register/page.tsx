"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { registerUser } from "../api/auth"; // путь может отличаться в зависимости от структуры проекта

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Невірний формат email")
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(6, "Мінімум 6 символів")
    .required("Обов'язкове поле"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Паролі не співпадають")
    .required("Обов'язкове поле"),
  fullName: Yup.string().required("Обов'язкове поле"),
  address: Yup.string().required("Обов'язкове поле"),
  phoneNumber: Yup.string()
    .matches(/^\+?\d{10,15}$/, "Невірний формат номера телефону")
    .required("Обов'язкове поле"),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        address: "",
        phoneNumber: "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setLoading(true);
        try {
          // Удаляем confirmPassword перед отправкой
          const { confirmPassword, ...payload } = values;
          const data = await registerUser(payload);
          console.log(data)
          // Если сервер вернул токен, сохраняем его
          if (data.accessToken) {
            localStorage.setItem("user", JSON.stringify(data));
          }

          alert("Реєстрація успішна!");
         console.log(data)
        } catch (error: any) {
          alert(error.message);
        } finally {
          setLoading(false);
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form>
          <Box
            sx={{
              maxWidth: 400,
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 4,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mx: "auto",
              mt: 4,
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Реєстрація
            </Typography>

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
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Підтвердження пароля"
              variant="outlined"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Повне ім'я"
              variant="outlined"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullName && Boolean(errors.fullName)}
              helperText={touched.fullName && errors.fullName}
              fullWidth
            />

            <TextField
              label="Адреса"
              variant="outlined"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
              fullWidth
            />

            <TextField
              label="Номер телефону"
              variant="outlined"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phoneNumber && Boolean(errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                backgroundColor: "#FFC107",
                color: "#000",
                "&:hover": { backgroundColor: "#FFB300" },
              }}
              disabled={isSubmitting || loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Зареєструватися"}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
