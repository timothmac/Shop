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
// Використовуємо useRouter для переходів
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // Меню категорій
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Відкриття/закриття кошика та діалогу логіна
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Кошик з контексту
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Список категорій
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Строка пошуку
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  // Перехід до товарів конкретної категорії
  const handleCategorySelect = (categoryId: string) => {
    setAnchorEl(null);
    router.push(`/category/${categoryId}`);
  };

  // Обробка пошуку за назвою
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?name=${searchTerm}`);
    }
  };

  // Обробка кліку на кнопку особистого кабінету
  const handleAccountClick = () => {
    if (isLoggedIn) {
      router.push("/userDashboard");
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <>
      {/* Верхня панель (контакти, особистий кабінет та кошик) */}
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000" }}>
        <Toolbar
          sx={{
            minHeight: "40px",
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
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
              onClick={handleAccountClick}
            >
              {isLoggedIn ? "Особистий кабінет" : "Увійти в кабінет"}
            </Button>
            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={totalItems} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Друга панель (логотип, меню каталогу та пошук) */}
      <Toolbar
        sx={{
          minHeight: "60px",
          backgroundColor: "#3E3E48",
          color: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            STROYZONE
          </Typography>
        </Box>

        {/* Кнопка та меню каталогу */}
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
                <MenuItem key={category.id} onClick={() => handleCategorySelect(category.id)}>
                  {category.name}
                </MenuItem>
              ))
            )}
          </Menu>
        </Box>

        {/* "Гнучкий" відступ для вирівнювання елементів праворуч */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Пошукова стрічка */}
        <SearchWrapper>
          <SearchInput
            placeholder="Що шукаєте?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
        <Button
          variant="contained"
          sx={{
            ml: 2,
            backgroundColor: "#FFC107",
            color: "#000",
            "&:hover": { backgroundColor: "#FFB300" },
          }}
          onClick={handleSearch}
        >
          Знайти
        </Button>
      </Toolbar>

      {/* Діалогове вікно авторизації */}
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
        <LoginForm onClose={() => setLoginOpen(false)} />
      </Dialog>

      {/* Компонент кошика */}
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
