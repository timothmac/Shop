"use client";
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  Button,
  Box,
  RadioGroup,
  Radio,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { createOrder, OrderItem, Order } from '../api/orderAPI';
// import { LoginForm } from "../components/LoginForm"; 
import {cities} from "../data/adress";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Обов'язкове поле"),
  email: Yup.string().email("Некоректний email").required("Обов'язкове поле"),
  phone: Yup.string()
    .matches(/^\+?380\d{9}$/, "Некоректний номер телефону")
    .required("Обов'язкове поле"),
  city: Yup.string().required("Оберіть місто"),
  address: Yup.string().required("Обов'язкове поле"),
});

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState('courier');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  const [orderData, setOrderData] = useState<{ items: OrderItem[]; totalPrice: number }>({
    items: [],
    totalPrice: 0,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  });

 
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
   
    const storedOrder = localStorage.getItem('order');
    if (storedOrder) {
     
      setOrderData(JSON.parse(storedOrder));
    }
  }, []);

  useEffect(() => {
    
    const user = localStorage.getItem("user");
    const loggedIn = !!user;
    setIsLoggedIn(loggedIn);

    if (user) {
      try {
        const parsedUser = JSON.parse(user).user;
        
        setUserData({
          fullName: parsedUser.fullName || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          city: parsedUser.city || '',
          address: parsedUser.address || '',
        });
      } catch (error) {
        console.error("Помилка парсингу даних користувача:", error);
      }
    }

    
    if (!loggedIn) {
      setOpenDialog(true);
    }
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Оформлення замовлення
      </Typography>

      {/* Модальне вікно з попередженням про необхідність увійти у кабінет */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="h6">Увійдіть в кабінет</Typography>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography>
            Для продовження оформлення замовлення необхідно увійти в кабінет.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={() => setOpenDialog(false)}>
            Закрити
          </Button>
          {/*
            Тут можна додати кнопку для переходу на сторінку логіну або виклику компонента LoginForm:
            <Button variant="contained" color="primary" onClick={() => router.push('/login')}>
              Увійти
            </Button>
          */}
        </DialogActions>
      </Dialog>

      {/* Якщо користувач не авторизований – форму не відображаємо */}
      {!isLoggedIn ? (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="body1">
            Будь ласка, увійдіть у свій кабінет, щоб продовжити оформлення замовлення.
          </Typography>
        </Paper>
      ) : (
        <Formik
          initialValues={{
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            city: userData.city,
            address: userData.address,
            comment: '',
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            const newOrder: Order = {
              ...values,
              deliveryMethod,
              paymentMethod,
              
              orderItems: orderData.items,
              totalPrice: orderData.totalPrice,
            };

            try {
              const result = await createOrder(newOrder);
              console.log('Відповідь від сервера:', result);
              localStorage.removeItem("order");
              alert('замовлення оформлено')
              actions.resetForm();
          
              
              
            } catch (error) {
              console.log('Помилка при створенні замовлення:', error);
            }
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
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Інформація про покупця
                    </Typography>
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
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.phone && Boolean(errors.phone)}
                      helperText={touched.phone && errors.phone}
                      margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Оберіть місто</InputLabel>
                      <Select
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.city && Boolean(errors.city)}
                      >
                        {cities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.city && errors.city && (
                        <Typography variant="caption" color="error">
                          {errors.city}
                        </Typography>
                      )}
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Адреса доставки"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Коментар"
                      name="comment"
                      value={values.comment}
                      onChange={handleChange}
                      margin="normal"
                      multiline
                      rows={2}
                    />
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Служба доставки
                    </Typography>
                    <RadioGroup
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="courier"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center">
                            <LocalShippingIcon sx={{ mr: 1 }} />
                            Доставка кур'єром
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="pickup"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center">
                            <StorefrontIcon sx={{ mr: 1 }} />
                            Самовивіз
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </Paper>

                  <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Платіжна система
                    </Typography>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="cash_on_delivery"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center">
                            <AttachMoneyIcon sx={{ mr: 1 }} />
                            Готівкою кур'єру
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="postpaid"
                        control={<Radio />}
                        label={
                          <Box display="flex" alignItems="center">
                            <PaymentIcon sx={{ mr: 1 }} />
                            Післяплата
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      p: 1.5,
                    }}
                    disabled={isSubmitting}
                  >
                    Підтвердити замовлення
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
}
