"use client";

import { Container, Typography, Grid, Card, CardContent, CardMedia, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const products = [
  { id: 1, name: "Цегла червона", price: "15 грн", image: "https://teslabatteries.kiev.ua/wp-content/uploads/2021/02/sravnit1-1080x675.jpg" },
  { id: 2, name: "Штукатурка", price: "250 грн", image: "https://teslabatteries.kiev.ua/wp-content/uploads/2021/02/sravnit1-1080x675.jpg" },
  { id: 3, name: "Дриль Makita", price: "3200 грн", image: "https://teslabatteries.kiev.ua/wp-content/uploads/2021/02/sravnit1-1080x675.jpg" },
  { id: 4, name: "Перфоратор Bosch", price: "4500 грн", image: "https://teslabatteries.kiev.ua/wp-content/uploads/2021/02/sravnit1-1080x675.jpg" },
  { id: 11, name: "Цегла червона", price: "15 грн", image: "https://teslabatteries.kiev.ua/wp-content/uploads/2021/02/sravnit1-1080x675.jpg" },
  { id: 21, name: "Штукатурка", price: "250 грн", image: "https://teslabatteries.kiev.ua/wp-content/uploads/2021/02/sravnit1-1080x675.jpg" },
  { id: 31, name: "Дриль Makita", price: "3200 грн", image: "https://teslabatteries.kiev.ua/wp-content/uploads/2021/02/sravnit1-1080x675.jpg" },
  { id: 41, name: "Перфоратор Bosch", price: "4500 грн", image: "https://teslabatteries.kiev.ua/wp-content/uploads/2021/02/sravnit1-1080x675.jpg" },
];

const ProductsPage: React.FC = () => {
  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/product/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card sx={{ boxShadow: 3, borderRadius: 2, cursor: "pointer" }} onClick={() => handleProductClick(product.id)}>
              <CardMedia component="img" height="180" image={product.image} alt={product.name} />
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body1" color="textSecondary" fontWeight="bold">
                  {product.price}
                </Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}>
                  Купити
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductsPage;
