"use client";
import { Container, Typography, Paper, Box } from "@mui/material";

const Page: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Про компанію
        </Typography>
        <Typography variant="body1">
          Ми – сучасний інтернет-магазин будівельних матеріалів, який працює для вас. 
          Наша компанія спеціалізується на постачанні якісних товарів для ремонту та будівництва.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Наші переваги:</Typography>
          <ul>
            <li>Великий вибір товарів</li>
            <li>Доставка по всій Україні</li>
            <li>Гарантія якості</li>
            <li>Зручна система оплати</li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
};

export default Page;
