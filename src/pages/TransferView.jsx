import { useState } from "react";
import { transfer } from "../api/client";
import { formatCurrency, formatDate } from "../utils/format";
import Icon from "../components/Icon";
import MoneyInput from "../components/MoneyInput";

const emptyForm = { senderAccountNumber: "", receiverAccountNumber: "", amount: "" };

export default function TransferView() {
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setResult(null);
    try {
      const { data } = await transfer({
        senderAccountNumber: form.senderAccountNumber,
        receiverAccountNumber: form.receiverAccountNumber,
        amount: parseFloat(form.amount || "0"),
      });
      setResult(data);
      setMessage({ type: "success", text: "Transferencia realizada con éxito." });
      setForm(emptyForm);
    } catch (err) {
      const text = err?.response?.data || "Error al realizar la transferencia.";
      setMessage({ type: "error", text: String(text) });
    }
  };

  return (
    <section>
      <header className="page-head">
        <h2>Transferir</h2>
        <p>Mueve dinero entre dos cuentas registradas.</p>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="senderAccountNumber">Cuenta origen</label>
            <input id="senderAccountNumber" name="senderAccountNumber" value={form.senderAccountNumber} onChange={handleChange} placeholder="De…" required />
          </div>
          <div className="field">
            <label htmlFor="receiverAccountNumber">Cuenta destino</label>
            <input id="receiverAccountNumber" name="receiverAccountNumber" value={form.receiverAccountNumber} onChange={handleChange} placeholder="Para…" required />
          </div>
          <div className="field">
            <label htmlFor="amount">Monto</label>
            <MoneyInput id="amount" value={form.amount} onChange={(v) => setForm((f) => ({ ...f, amount: v }))} required />
          </div>
        </div>
        <div className="card-actions">
          <button type="submit" className="btn primary">
            <Icon name="send" size={16} /> Transferir
          </button>
        </div>
      </form>

      {message && (
        <p className={`message ${message.type}`} role="status" aria-live="polite">
          <Icon name={message.type === "success" ? "check" : "alert"} size={16} />
          {message.text}
        </p>
      )}

      {result && (
        <div className="card receipt-card">
          <div className="card-title">
            <Icon name="check" size={16} />
            <h3>Comprobante</h3>
          </div>
          <div className="receipt-amount">{formatCurrency(result.amount)}</div>
          <dl className="receipt">
            <div><dt>ID transacción</dt><dd className="mono">{result.id}</dd></div>
            <div><dt>Cuenta origen</dt><dd className="mono">{result.senderAccountNumber}</dd></div>
            <div><dt>Cuenta destino</dt><dd className="mono">{result.receiverAccountNumber}</dd></div>
            <div><dt>Fecha</dt><dd>{formatDate(result.timestamp)}</dd></div>
          </dl>
        </div>
      )}
    </section>
  );
}
