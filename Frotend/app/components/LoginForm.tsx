import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@mui/material";;

const LoginForm = () => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Невірний формат email").required("Обов'язкове поле"),
        password: Yup.string().min(6, "Мінімум 6 символів").required("Обов'язкове поле"),
      })}
      onSubmit={(values) => {
        console.log("Форма входу відправлена", values);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Field type="email" name="email" className="w-full p-2 border rounded" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <Field type="password" name="password" className="w-full p-2 border rounded" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Увійти
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
