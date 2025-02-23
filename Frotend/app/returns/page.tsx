"use client";
import { Container, Typography, Paper } from "@mui/material";

const Page: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Повернення товару
        </Typography>
        <Typography variant="body1">
          Ви можете повернути товар протягом 14 днів з моменту покупки за умови, що він не був 
          використаний та має оригінальне пакування.
        </Typography>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Як повернути товар?
        </Typography>
        <ul>
          <li>Зателефонувати нашому менеджеру</li>
          <li>Заповнити заявку на повернення</li>
          <li>Надіслати товар через Нову Пошту</li>
        </ul>
      </Paper>
    </Container>
  );
};

export default Page;
