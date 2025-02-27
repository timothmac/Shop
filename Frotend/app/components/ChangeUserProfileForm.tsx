import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { cities } from "../data/adress";
import { updateUser } from "../api/updateAPI";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Обов'язкове поле"),
  email: Yup.string().email("Некоректний email").required("Обов'язкове поле"),
  phoneNumber: Yup.string()
    .matches(/^\+?380\d{9}$/, "Некоректний номер телефону")
    .required("Обов'язкове поле"),
  city: Yup.string().required("Оберіть місто"),
  address: Yup.string().required("Обов'язкове поле"),
});

const ChangeUserProfileForm = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user).user;
        setUserData({
          fullName: parsedUser.fullName || "",
          email: parsedUser.email || "",
          phoneNumber: parsedUser.phoneNumber || "",
          city: parsedUser.city || "",
          address: parsedUser.address || "",
        });
      } catch (error) {
        console.error("Помилка парсингу даних користувача:", error);
      }
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <AccountCircleIcon sx={{ mr: 1, color: "primary.main" }} />
          Редагування профілю
        </Typography>
        <Formik
          initialValues={userData}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const data = await updateUser(values);
              console.log(data)
              localStorage.setItem("user", JSON.stringify({
                user: {
                  ...data.user,
                },
                  accessToken: data.accessToken
                
              }));
              alert("Дані оновлено!");
              window.location.reload();
            } catch (error) {
              alert("Помилка оновлення користувача");
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ПІБ"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="E-Mail"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Телефон"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Місто"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.city && Boolean(errors.city)}
                    helperText={touched.city && errors.city}
                    margin="normal"
                  >
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Адреса"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={isSubmitting}
                    >
                      Зберегти зміни
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default ChangeUserProfileForm;
