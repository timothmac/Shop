"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import { styled } from "@mui/material/styles";
import Cart from "./Cart";

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

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([
    { id: 1, name: "Цегла червона", price: 15, quantity: 2 },
    { id: 2, name: "Штукатурка", price: 250, quantity: 1 },
    { id: 3, name: "Цегла червона", price: 15, quantity: 2 },
    { id: 4, name: "Штукатурка", price: 250, quantity: 1 },
  ]);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#fff", color: "#000" }}>
        <Toolbar sx={{ minHeight: "40px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0e0e0" }}>
          <Box sx={{ display: "flex", gap: 2, fontSize: "0.9rem" }}>
            <Typography variant="body2" component="span">
              <Link href="/about" style={{ textDecoration: "none", color: "black" }}>Про компанію</Link>
            </Typography>
            <Typography variant="body2" component="span">
              <Link href="/delivery" style={{ textDecoration: "none", color: "black" }}>Доставка</Link>
            </Typography>
            <Typography variant="body2" component="span">
              <Link href="/returns" style={{ textDecoration: "none", color: "black" }}>Повернення</Link>
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon fontSize="small" />
              <Typography variant="body2">+38 088 888 88 88</Typography>
            </Box>
            <Button variant="contained" sx={{ backgroundColor: "#FFC107", color: "#000", "&:hover": { backgroundColor: "#FFB300" } }} startIcon={<AccountCircleIcon />}>
              Особистий кабінет
            </Button>

            {/* Кнопка открытия корзины */}
            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
              <Badge badgeContent={cart.length} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: "60px", backgroundColor: "#3E3E48", color: "#fff", display: "flex", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            STROYZONE
          </Typography>
        </Box>
        <Box>
          <Button startIcon={<MenuIcon />} sx={{ color: "#fff", fontSize: "1rem" }} onClick={(event) => setAnchorEl(event.currentTarget)}>
            КАТАЛОГ ТОВАРІВ
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => setAnchorEl(null)}>Будматеріали</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Інструменти</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Сантехніка</MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>Електрика</MenuItem>
          </Menu>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <SearchWrapper>
          <SearchInput placeholder="Що шукаєте?" />
        </SearchWrapper>
        <Button variant="contained" sx={{ ml: 2, backgroundColor: "#FFC107", color: "#000", "&:hover": { backgroundColor: "#FFB300" } }}>
          Знайти
        </Button>
      </Toolbar>
      {/* Вызов компонента корзины */}
      <Cart cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
