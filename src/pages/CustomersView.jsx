import { useEffect, useState } from "react";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
} from "../api/client";

const emptyForm = {
  accountNumber: "",
  firstName: "",
  lastName: "",
  balance: "",
};

export default function CustomersView() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await getCustomers();
      setCustomers(data);
      setMessage(null);
    } catch (err) {
      setMessage({ type: "error", text: "No se pudieron cargar los clientes. ¿El backend está corriendo?" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer({
        accountNumber: form.accountNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        balance: parseFloat(form.balance),
      });
      setForm(emptyForm);
      setMessage({ type: "success", text: "Cliente creado correctamente." });
      loadCustomers();
    } catch (err) {
      const text = err?.response?.data?.message || err?.response?.data || "Error al crear el cliente.";
      setMessage({ type: "error", text: String(text) });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await deleteCustomer(id);
      setMessage({ type: "success", text: "Cliente eliminado." });
      loadCustomers();
    } catch (err) {
      setMessage({ type: "error", text: "No se pudo eliminar el cliente." });
    }
  };

  return (
    <section>
      <h2>Clientes</h2>

      <form className="card" onSubmit={handleSubmit}>
        <h3>Crear nuevo cliente</h3>
        <div className="form-grid">
          <label>
            Número de cuenta
            <input name="accountNumber" value={form.accountNumber} onChange={handleChange} required />
          </label>
          <label>
            Nombre
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>
          <label>
            Apellido
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>
          <label>
            Saldo inicial
            <input name="balance" type="number" step="0.01" value={form.balance} onChange={handleChange} required />
          </label>
        </div>
        <button type="submit">Crear cliente</button>
      </form>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}

      <div className="card">
        <div className="card-header">
          <h3>Listado de clientes</h3>
          <button className="secondary" onClick={loadCustomers}>Refrescar</button>
        </div>
        {loading ? (
          <p>Cargando...</p>
        ) : customers.length === 0 ? (
          <p>No hay clientes registrados.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cuenta</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Saldo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.accountNumber}</td>
                  <td>{c.firstName}</td>
                  <td>{c.lastName}</td>
                  <td>${Number(c.balance).toFixed(2)}</td>
                  <td>
                    <button className="danger" onClick={() => handleDelete(c.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
