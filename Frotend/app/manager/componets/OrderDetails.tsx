"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from "@mui/material";
import { Order } from "../api/ordersAPI";

interface OrderDetailsProps {
  order?: Order | null;
  onClose: () => void;
}

export default function OrderDetails({ order, onClose }: OrderDetailsProps) {
  if (!order) return null;

  return (
    <Dialog open={!!order} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        Деталі замовлення #{order.id}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Інформація про замовлення
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Клієнт:</strong> {order.customerName}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Адреса:</strong> {order.address}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Місто:</strong> {order.city || "Не вказано"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Телефон:</strong> {order.phone || "Не вказано"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email:</strong> {order.email || "Не вказано"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Спосіб оплати:</strong> {order.paymentMethod || "Не вказано"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Метод доставки:</strong> {order.deliveryMethod || "Не вказано"}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Статус:</strong> {order.status}
          </Typography>
          {order.comment && (
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Коментар:</strong> {order.comment}
            </Typography>
          )}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            Склад замовлення
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {order.orderItems && order.orderItems.length > 0 ? (
            <List>
              {order.orderItems.map((item) => (
                <ListItem key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {item.product.id} - {item.product.name} (x{item.quantity})
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="textSecondary">
                        Ціна: {item.price} грн, Загальна:{" "}
                        {parseFloat(item.price) * item.quantity} грн
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Немає товарів у замовленні
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Підсумкова сума: {order.totalPrice} грн
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Дата створення: {new Date(order.createdAt).toLocaleString()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="contained" sx={{ borderRadius: 2 }}>
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
