"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { getUsers, createUser, updateUser, deleteUser } from "../api/usersAPI";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  city?: string;
  address?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Фільтруючі стани
  const [filterText, setFilterText] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Помилка завантаження користувачів:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredUsers.map((u) => u.id);
      setSelectedUserIds(allIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds((prev) => [...prev, id]);
    } else {
      setSelectedUserIds((prev) => prev.filter((uid) => uid !== id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedUserIds.length) return;
    if (!confirm("Видалити обраних користувачів?")) return;
    try {
      setLoading(true);
      for (const id of selectedUserIds) {
        await deleteUser(id);
      }
      // Оновлюємо стан, видаляючи користувачів, ID яких було видалено
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedUserIds.includes(user.id)));
      setSelectedUserIds([]);
    } catch (error) {
      console.error("Помилка видалення користувачів:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.fullName?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email?.toLowerCase().includes(filterText.toLowerCase()) ||
      user.phoneNumber?.toLowerCase().includes(filterText.toLowerCase());
    const roleMatch = roleFilter ? user.role === roleFilter : true;
    return searchMatch && roleMatch;
  });

  const handleOpenDialog = (mode: "create" | "edit", user?: User) => {
    setDialogMode(mode);
    setOpenDialog(true);
    if (mode === "edit" && user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Схема валідації з перевіркою паролю
  const validationSchema = Yup.object({
    fullName: Yup.string().required("Обов'язкове поле"),
    email: Yup.string()
      .email("Невірний формат email")
      .required("Обов'язкове поле"),
    phoneNumber: Yup.string().required("Обов'язкове поле"),
    role: Yup.string().required("Обов'язкове поле"),
    city: Yup.string().when("role", {
      is: "client",
      then: () => Yup.string().required("Обов'язкове поле"),
      otherwise: () => Yup.string(),
    }),
    address: Yup.string().when("role", {
      is: "client",
      then: () => Yup.string().required("Обов'язкове поле"),
      otherwise: () => Yup.string(),
    }),
    password:
      dialogMode === "create"
        ? Yup.string()
            .min(6, "Пароль має містити мінімум 6 символів")
            .max(30, "Максимальна довжина паролю 30 символів")
            .required("Обов'язкове поле")
        : Yup.string()
            .min(6, "Пароль має містити мінімум 6 символів")
            .max(30, "Максимальна довжина паролю 30 символів"),
  });

  const handleIndividualDelete = async (id: string) => {
    if (!confirm("Видалити користувача?")) return;
    try {
      setLoading(true);
      await deleteUser(id);
      // Оновлюємо список користувачів локально
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Помилка видалення користувача:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Керування користувачами
      </Typography>

      {/* Фільтри */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Пошук (Ім'я, Email, Телефон)"
          variant="outlined"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          fullWidth
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="role-filter-label">Роль</InputLabel>
          <Select
            labelId="role-filter-label"
            label="Роль"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">Всі</MenuItem>
            <MenuItem value="client">Клієнт</MenuItem>
            <MenuItem value="admin">Адмін</MenuItem>
            <MenuItem value="manager">Менеджер</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && <Typography>Завантаження...</Typography>}

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("create")}
        >
          Додати користувача
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteSelected}
          disabled={!selectedUserIds.length}
        >
          Видалити обраних
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={
                  filteredUsers.length > 0 &&
                  selectedUserIds.length === filteredUsers.length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableCell>
            <TableCell>Ім'я</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Телефон</TableCell>
            <TableCell>Роль</TableCell>
            <TableCell align="right">Дії</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedUserIds.includes(user.id)}
                  onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                />
              </TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="right">
                <Tooltip title="Редагувати">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog("edit", user)}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Видалити">
                  <IconButton
                    color="error"
                    onClick={() => handleIndividualDelete(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {!filteredUsers.length && !loading && (
            <TableRow>
              <TableCell colSpan={6}>Користувачів немає</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {dialogMode === "create" ? "Додати користувача" : "Редагувати користувача"}
        </DialogTitle>
        <DialogContent dividers>
          <Formik
            initialValues={{
              fullName: selectedUser?.fullName || "",
              email: selectedUser?.email || "",
              phoneNumber: selectedUser?.phoneNumber || "",
              role: selectedUser?.role || "",
              city: selectedUser?.city || "",
              address: selectedUser?.address || "",
              password: "",
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const userData: any = {
                  fullName: values.fullName,
                  email: values.email,
                  phoneNumber: values.phoneNumber,
                  role: values.role,
                };
                if (values.role === "client") {
                  userData.city = values.city;
                  userData.address = values.address;
                }
                if (values.password) {
                  userData.password = values.password;
                }
                if (dialogMode === "create") {
                  await createUser(userData);
                } else if (dialogMode === "edit" && selectedUser) {
                  await updateUser(selectedUser.id, userData);
                }
                setUsers((prev) =>
                  dialogMode === "create"
                    ? [...prev, { id: Date.now().toString(), ...userData }] // або перезавантаження списку через loadUsers()
                    : prev.map((u) =>
                        u.id === selectedUser?.id ? { ...u, ...userData } : u
                      )
                );
                handleCloseDialog();
              } catch (error) {
                console.error("Помилка збереження користувача:", error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Ім'я"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                  />
                  <TextField
                    label="Телефон"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel id="role-select-label">Роль</InputLabel>
                    <Select
                      labelId="role-select-label"
                      name="role"
                      value={values.role}
                      label="Роль"
                      onChange={handleChange}
                    >
                      <MenuItem value="client">Клієнт</MenuItem>
                      <MenuItem value="admin">Адмін</MenuItem>
                      <MenuItem value="manager">Менеджер</MenuItem>
                    </Select>
                  </FormControl>
                  {values.role === "client" && (
                    <>
                      <TextField
                        label="Місто"
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.city && Boolean(errors.city)}
                        helperText={touched.city && errors.city}
                        fullWidth
                      />
                      <TextField
                        label="Адреса"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        fullWidth
                      />
                    </>
                  )}
                  <TextField
                    label="Пароль"
                    name="password"
                    type="text"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    fullWidth
                  />
                </Box>
                <DialogActions sx={{ mt: 2, p: 0 }}>
                  <Button onClick={handleCloseDialog} color="inherit">
                    Скасувати
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {dialogMode === "create" ? "Створити" : "Зберегти"}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
