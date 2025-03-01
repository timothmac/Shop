"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  CircularProgress,
  Typography,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchOrders, Order, deleteOrder } from "../api/ordersAPI";
import OrderDetails from "../componets/OrderDetails";
import OrderEditForm from "../componets/OrderEditForm";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      const formattedOrders = data.map((order) => ({
        id: order.id,
        customerName: order.user?.fullName || "Невідомо",
        address: order.address,
        totalPrice: order.totalPrice,
        status: order.status,
        orderItems: order.orderItems || [],
        city: order.city,
        paymentMethod: order.paymentMethod,
        deliveryMethod: order.deliveryMethod,
        fullName: order.fullName,
        email: order.email,
        phone: order.phone,
        comment: order.comment,
        createdAt: order.createdAt,
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Помилка завантаження замовлень:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (confirm("Ви впевнені, що хочете видалити це замовлення?")) {
      try {
        await deleteOrder(orderId);
        loadOrders();
      } catch (error) {
        console.error("Помилка видалення замовлення:", error);
      }
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Список замовлень
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ boxShadow: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID замовлення</TableCell>
                  <TableCell>Клієнт</TableCell>
                  <TableCell>Сума</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Дії</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.totalPrice} грн</TableCell>
                      <TableCell>
                        <Chip label={order.status} color="primary" />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Деталі замовлення">
                          <IconButton
                            color="info"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Редагувати замовлення">
                          <IconButton
                            color="primary"
                            onClick={() => setEditOrder(order)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Видалити замовлення">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(order.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="textSecondary">
                        Замовлень поки немає
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      {editOrder && (
        <OrderEditForm
          order={editOrder}
          onClose={() => setEditOrder(null)}
          onUpdate={loadOrders}
        />
      )}
    </Box>
  );
}
