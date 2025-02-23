"use client";
import { Container, Typography, Paper } from "@mui/material";

const Page: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Доставка
        </Typography>
        <Typography variant="body1">
          Ми здійснюємо доставку по всій Україні через кур’єрські служби: Нова Пошта, Укрпошта, 
          а також власною кур'єрською службою у деяких містах.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Вартість доставки:
        </Typography>
        <ul>
          <li>Безкоштовна при замовленні від 2000 грн</li>
          <li>Стандартний тариф перевізника</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Page;
