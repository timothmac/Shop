"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LockIcon from "@mui/icons-material/Lock";
import InfoIcon from "@mui/icons-material/Info";
import ChangeUserProfileForm from "../components/ChangeUserProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { getOrdersByUserId } from "../api/orderAPI";
import OrderDetailsDialog from "../components/OrderDetails";

const UserDashboard = () => {
  const router = useRouter();

  // Дані користувача (додано role для перевірки доступу менеджера)
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    id: "",
    role: "client",
  });

  // Замовлення користувача
  const [orders, setOrders] = useState([]);

  // Модальні вікна
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user).user;
        setUserData({
          fullName: parsedUser.fullName || "Невідомий користувач",
          email: parsedUser.email || "email не вказано",
          phoneNumber: parsedUser.phoneNumber || "телефон не вказано",
          id: parsedUser.id || "",
          role: parsedUser.role || "client",
        });

        // Завантаження замовлень
        if (parsedUser.id) {
          getOrdersByUserId(parsedUser.id)
            .then(setOrders)
            .catch((error) =>
              console.error("Помилка завантаження замовлень:", error)
            );
        }
      } catch (error) {
        console.error("Помилка парсингу даних користувача:", error);
      }
    }
  }, []);

  // Функція для відкриття деталей замовлення
  const handleOpenOrderDetails = (order) => {
    setSelectedOrder(order);
    setOpenOrderDetails(true);
  };

  // Функції для менеджерських дій (логіку можна розширити відповідно до API)
  const handleCancelOrder = (orderId) => {
    console.log("Скасування замовлення з ID:", orderId);
    // Додайте тут логіку скасування замовлення
  };

  const handleChangeOrder = (order) => {
    console.log("Редагування замовлення:", order);
    // Додайте тут логіку редагування замовлення
  };

  // Загальний стиль для анімації іконок та кнопок
  const animatedStyle = {
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.1)",
    },
  };

  // Функція для виходу з кабінету
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
    window.location.reload();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
   
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <AccountCircleIcon sx={{ mr: 1, fontSize: 40, color: "primary.main" }} />
          Особистий кабінет
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Вийти
        </Button>
      </Box>

      <Grid container spacing={3}>
   
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h6">Профіль користувача</Typography>
            <Box sx={{ textAlign: "left", mt: 2 }}>
              <Typography variant="body1">
                <strong>Ім'я:</strong> {userData.fullName}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {userData.email}
              </Typography>
              <Typography variant="body1">
                <strong>Телефон:</strong> {userData.phoneNumber}
              </Typography>
            </Box>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                startIcon={<EditIcon sx={animatedStyle} />}
                sx={{ mr: 1, ...animatedStyle }}
                onClick={() => setOpenEditProfile(true)}
              >
                Редагувати профіль
              </Button>
              <Button
                variant="contained"
                startIcon={<LockIcon sx={animatedStyle} />}
                sx={{ ml: 1, ...animatedStyle }}
                onClick={() => setOpenChangePassword(true)}
              >
                Змінити пароль
              </Button>
            </Box>
          </Paper>
        </Grid>

       
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ShoppingCartIcon
                sx={{ mr: 1, color: "primary.main", fontSize: 30 }}
              />
              Мої замовлення
            </Typography>
            {orders.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID замовлення</TableCell>
                    <TableCell>Дата</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Сума</TableCell>
                    <TableCell align="center">Деталі</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell>{order.totalPrice} грн</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Детальніше" arrow>
                          <InfoIcon
                            onClick={() => handleOpenOrderDetails(order)}
                            sx={{
                              fontSize: 25,
                              color: "primary.main",
                              cursor: "pointer",
                              ...animatedStyle,
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>Замовлення відсутні</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

 
      <Dialog
        open={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Редагувати профіль</DialogTitle>
        <DialogContent>
          <ChangeUserProfileForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditProfile(false)} color="secondary">
            Закрити
          </Button>
        </DialogActions>
      </Dialog>

  
      <Dialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Змінити пароль</DialogTitle>
        <DialogContent>
          <ChangePasswordForm onClose={() => setOpenChangePassword(false)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePassword(false)} color="secondary">
            Закрити
          </Button>
        </DialogActions>
      </Dialog>


      <OrderDetailsDialog
        open={openOrderDetails}
        order={selectedOrder}
        onClose={() => setOpenOrderDetails(false)}
        isManager={userData.role === "manager"}
        onCancelOrder={handleCancelOrder}
        onChangeOrder={handleChangeOrder}
      />
    </Container>
  );
};

export default UserDashboard;
