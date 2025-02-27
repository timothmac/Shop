"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const OrderDetailsDialog = ({
  open,
  order,
  onClose,
  isManager = false,
  onCancelOrder,
  onChangeOrder,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Деталі замовлення</DialogTitle>
      <DialogContent dividers>
        <Box>
          <Typography>
            <strong>ID замовлення:</strong> {order.id}
          </Typography>
          <Typography>
            <strong>Дата:</strong> {new Date(order.createdAt).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Статус:</strong> {order.status}
          </Typography>
          <Typography>
            <strong>Сума:</strong> {order.totalPrice} грн
          </Typography>
          <Typography>
            <strong>Місто:</strong> {order.city}
          </Typography>
          <Typography>
            <strong>Адреса:</strong> {order.address}
          </Typography>
          <Typography>
            <strong>Метод оплати:</strong> {order.paymentMethod}
          </Typography>
          <Typography>
            <strong>Метод доставки:</strong> {order.deliveryMethod}
          </Typography>
          <Typography>
            <strong>Коментар:</strong> {order.comment}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Замовлені товари:</Typography>
          {order.orderItems && order.orderItems.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Назва товару</TableCell>
                  <TableCell>Кількість</TableCell>
                  <TableCell>Ціна за одиницю</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price} грн</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>Товари відсутні</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Закрити
        </Button>
        {isManager && (
          <>
            <Button onClick={() => onCancelOrder(order.id)} color="error">
              Скасувати замовлення
            </Button>
            <Button onClick={() => onChangeOrder(order)} color="primary">
              Змінити замовлення
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
