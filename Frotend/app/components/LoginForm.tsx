"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Link,
} from "@mui/material";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Невірний формат email")
    .required("Обов'язкове поле"),
  password: Yup.string()
    .min(6, "Мінімум 6 символів")
    .required("Обов'язкове поле"),
});

export default function LoginForm({ onClose }: { onClose: () => void }) {
  return (
    <Formik
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("Форма входу відправлена", values);
        onClose(); // Закрываем диалог после успешного сабмита
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
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
              label="Логін"
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

            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={values.rememberMe}
                  onChange={(e) => setFieldValue("rememberMe", e.target.checked)}
                  color="primary"
                />
              }
              label="Запам'ятати мене"
            />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Link href="/register" variant="body2" underline="hover">
                Реєстрація
              </Link>
              <Link href="#" variant="body2" underline="hover">
                Забули пароль?
              </Link>
            </Box>

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
              Увійти
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
