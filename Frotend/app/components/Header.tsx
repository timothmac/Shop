"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Paper,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";

import Cart from "./Cart";
import LoginForm from "./LoginForm";
import { useCart } from "../contetx/cartContext";
import { fetchCategories, Category } from "../api/categoryAPI";

const SearchWrapper = styled(Paper)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 400,
  padding: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
}));

const Header: React.FC = () => {
  // Открытие/закрытие меню каталога
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // Открытие/закрытие корзины
  const [cartOpen, setCartOpen] = useState(false);
  // Открытие/закрытие диалога авторизации
  const [loginOpen, setLoginOpen] = useState(false);

  // Данные корзины из контекста
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Категории товаров
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <>
      {/* Верхняя панель с информацией */}
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000" }}>
        <Toolbar
          sx={{
            minHeight: "40px",
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {/* Ссылки слева */}
          <Box sx={{ display: "flex", gap: 2, fontSize: "0.9rem" }}>
            <Typography variant="body2" component="span">
              <Link href="/about" style={{ textDecoration: "none", color: "black" }}>
                Про компанію
              </Link>
            </Typography>
            <Typography variant="body2" component="span">
              <Link href="/delivery" style={{ textDecoration: "none", color: "black" }}>
                Доставка
              </Link>
            </Typography>
            <Typography variant="body2" component="span">
              <Link href="/returns" style={{ textDecoration: "none", color: "black" }}>
                Повернення
              </Link>
            </Typography>
          </Box>

          {/* Контактная информация и кнопки справа */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon fontSize="small" />
              <Typography variant="body2">+38 088 888 88 88</Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFC107",
                color: "#000",
                "&:hover": { backgroundColor: "#FFB300" },
              }}
              startIcon={<AccountCircleIcon />}
              onClick={() => setLoginOpen(true)}
            >
              Особистий кабінет
            </Button>
            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Вторая панель с логотипом, меню каталога и поиском */}
      <Toolbar
        sx={{
          minHeight: "60px",
          backgroundColor: "#3E3E48",
          color: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Логотип */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            STROYZONE
          </Typography>
        </Box>

        {/* Кнопка и меню каталога */}
        <Box>
          <Button
            startIcon={<MenuIcon />}
            sx={{ color: "#fff", fontSize: "1rem" }}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            КАТАЛОГ ТОВАРІВ
          </Button>
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setAnchorEl(null)}>
            {loading ? (
              <MenuItem disabled>
                <CircularProgress size={24} />
              </MenuItem>
            ) : (
              categories.map((category) => (
                <MenuItem key={category.id} onClick={() => setAnchorEl(null)}>
                  {category.name}
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>

        {/* Пробел для выравнивания по сторонам */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Поисковая строка */}
        <SearchWrapper>
          <SearchInput placeholder="Що шукаєте?" />
        </SearchWrapper>
        <Button
          variant="contained"
          sx={{
            ml: 2,
            backgroundColor: "#FFC107",
            color: "#000",
            "&:hover": { backgroundColor: "#FFB300" },
          }}
        >
          Знайти
        </Button>
      </Toolbar>

      {/* Диалоговое окно авторизации */}
      <Dialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
  
      >
        <LoginForm onClose={() => setLoginOpen(false)} />
      </Dialog>

      {/* Компонент корзины */}
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
