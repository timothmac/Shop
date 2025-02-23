"use client";
import { Container, Typography, Paper } from "@mui/material";

const Page: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Блог
        </Typography>
        <Typography variant="h5" sx={{ color: "gray", mt: 3 }}>
          Скоро буде!
        </Typography>
      </Paper>
    </Container>
  );
};

export default Page;
