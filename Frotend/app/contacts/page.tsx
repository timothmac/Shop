"use client";
import { Container, Typography, Paper, Box } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const Page: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Контакти
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
          <PhoneIcon />
          <Typography variant="body1">+38 088 88 88 88</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
          <PhoneIcon />
          <Typography variant="body1">+38 088 88 88 89</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
          <EmailIcon />
          <Typography variant="body1">doeskejohn@gmail.com</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Page;
