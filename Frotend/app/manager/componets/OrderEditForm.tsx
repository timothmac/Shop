"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { OrderStatus, updateOrder } from "../api/ordersAPI"; // Припускаємо, що updateOrder та enum імпортуються звідси

const orderStatusOptions = [
  { value: OrderStatus.PENDING, label: "Очікується" },
  { value: OrderStatus.SHIPPED, label: "Відправлено" },
  { value: OrderStatus.COMPLETED, label: "Завершено" },
  { value: OrderStatus.CANCELLED, label: "Скасовано" },
];

interface OrderEditFormProps {
  order: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderEditForm({ order, onClose, onUpdate }: OrderEditFormProps) {
  const [status, setStatus] = useState(order.status || OrderStatus.PENDING);

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      console.log("Оновлення статусу замовлення:", { id: order.id, status });
      const updatedOrder = await updateOrder(order.id, { status });
      console.log("Замовлення оновлено:", updatedOrder);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Помилка оновлення замовлення:", error);
    }
  };

  return (
    <Dialog open={!!order} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Редагування статусу замовлення #{order.id}</DialogTitle>
      <DialogContent>
        <TextField
          select
          margin="dense"
          label="Статус"
          name="status"
          fullWidth
          value={status}
          onChange={handleStatusChange}
        >
          {orderStatusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Скасувати
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
