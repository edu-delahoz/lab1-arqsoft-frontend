import { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../api/client";
import { formatCurrency, randomAccountNumber } from "../utils/format";
import Icon from "../components/Icon";
import MoneyInput from "../components/MoneyInput";

const emptyForm = { accountNumber: "", firstName: "", lastName: "", balance: "" };

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
    } catch {
      setMessage({ type: "error", text: "No se pudieron cargar los clientes. ¿El backend está corriendo?" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer({
        accountNumber: form.accountNumber,
        firstName: form.firstName,
        lastName: form.lastName,
        balance: parseFloat(form.balance || "0"),
      });
      setForm(emptyForm);
      setMessage({ type: "success", text: "Cliente creado correctamente." });
      loadCustomers();
    } catch (err) {
      const text = err?.response?.data?.message || err?.response?.data || "Error al crear el cliente.";
      setMessage({ type: "error", text: String(text) });
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar a ${name}?`)) return;
    try {
      await deleteCustomer(id);
      setMessage({ type: "success", text: "Cliente eliminado." });
      loadCustomers();
    } catch {
      setMessage({ type: "error", text: "No se pudo eliminar el cliente." });
    }
  };

  return (
    <section>
      <header className="page-head">
        <h2>Clientes</h2>
        <p>Registra cuentas y consulta el saldo de cada cliente del banco.</p>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <div className="card-title">
          <Icon name="plus" size={16} />
          <h3>Nuevo cliente</h3>
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="accountNumber">Número de cuenta</label>
            <div className="input-with-action">
              <input id="accountNumber" name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Ej. 1023456789" required />
              <button
                type="button"
                className="icon-btn"
                title="Generar número de cuenta aleatorio"
                aria-label="Generar número de cuenta aleatorio"
                onClick={() => setField("accountNumber", randomAccountNumber())}
              >
                <Icon name="shuffle" size={16} />
              </button>
            </div>
          </div>
          <div className="field">
            <label htmlFor="firstName">Nombre</label>
            <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="lastName">Apellido</label>
            <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="balance">Saldo inicial</label>
            <MoneyInput id="balance" value={form.balance} onChange={(v) => setField("balance", v)} required />
          </div>
        </div>
        <div className="card-actions">
          <button type="submit" className="btn primary">
            <Icon name="check" size={16} /> Crear cliente
          </button>
        </div>
      </form>

      {message && (
        <p className={`message ${message.type}`} role="status" aria-live="polite">
          <Icon name={message.type === "success" ? "check" : "alert"} size={16} />
          {message.text}
        </p>
      )}

      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <Icon name="users" size={16} />
            <h3>Clientes registrados</h3>
            <span className="badge">{customers.length}</span>
          </div>
          <button className="btn ghost" onClick={loadCustomers} aria-label="Refrescar listado">
            <Icon name="refresh" size={16} /> Refrescar
          </button>
        </div>

        {loading ? (
          <p className="empty">Cargando…</p>
        ) : customers.length === 0 ? (
          <div className="empty">
            <Icon name="inbox" size={28} />
            <p>Aún no hay clientes. Crea el primero arriba.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Nombre</th>
                  <th className="num">Saldo</th>
                  <th className="col-action"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="mono">{c.accountNumber}</td>
                    <td>{c.firstName} {c.lastName}</td>
                    <td className="num money">{formatCurrency(c.balance)}</td>
                    <td className="col-action">
                      <button
                        className="icon-btn danger"
                        title="Eliminar cliente"
                        aria-label={`Eliminar a ${c.firstName} ${c.lastName}`}
                        onClick={() => handleDelete(c.id, `${c.firstName} ${c.lastName}`)}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
