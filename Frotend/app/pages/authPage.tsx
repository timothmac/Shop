import { useState } from "react";
import { Button, Card } from "@mui/material";
import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Modal from "../components/Modal";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-lg rounded-2xl bg-white">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? "Вход" : "Регистрация"}
        </h2>
        {isLogin ? <LoginForm /> : <RegisterForm />}
        <div className="mt-4 text-center">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Войти"}
          </button>
        </div>
      </Card>
      <Button className="mt-4" onClick={() => setShowModal(true)}>
        Открыть всплывающее окно
      </Button>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default AuthPage;