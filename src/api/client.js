import axios from "axios";

// URL base del backend Spring Boot (ver application.properties -> server.port=8080).
// Se puede sobreescribir con la variable de entorno VITE_API_URL.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// ----- Clientes -----
export const getCustomers = () => api.get("/api/customers");
export const getCustomerById = (id) => api.get(`/api/customers/${id}`);
export const createCustomer = (customer) => api.post("/api/customers", customer);
export const updateCustomer = (id, customer) => api.put(`/api/customers/${id}`, customer);
export const deleteCustomer = (id) => api.delete(`/api/customers/${id}`);

// ----- Transacciones -----
export const transfer = (payload) => api.post("/api/transactions", payload);
export const getTransactionsByAccount = (accountNumber) =>
  api.get(`/api/transactions/${accountNumber}`);

export default api;
