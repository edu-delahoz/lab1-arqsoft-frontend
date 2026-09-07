import { useState } from "react";
import { transfer } from "../api/client";

const emptyForm = {
  senderAccountNumber: "",
  receiverAccountNumber: "",
  amount: "",
};

export default function TransferView() {
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setResult(null);
    try {
      const { data } = await transfer({
        senderAccountNumber: form.senderAccountNumber,
        receiverAccountNumber: form.receiverAccountNumber,
        amount: parseFloat(form.amount),
      });
      setResult(data);
      setMessage({ type: "success", text: "Transferencia realizada con éxito." });
      setForm(emptyForm);
    } catch (err) {
      // El backend devuelve el mensaje de error como texto plano (badRequest().body(msg))
      const text = err?.response?.data || "Error al realizar la transferencia.";
      setMessage({ type: "error", text: String(text) });
    }
  };

  return (
    <section>
      <h2>Transferencia entre cuentas</h2>

      <form className="card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Cuenta origen
            <input name="senderAccountNumber" value={form.senderAccountNumber} onChange={handleChange} required />
          </label>
          <label>
            Cuenta destino
            <input name="receiverAccountNumber" value={form.receiverAccountNumber} onChange={handleChange} required />
          </label>
          <label>
            Monto
            <input name="amount" type="number" step="0.01" min="0" value={form.amount} onChange={handleChange} required />
          </label>
        </div>
        <button type="submit">Transferir</button>
      </form>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}

      {result && (
        <div className="card">
          <h3>Comprobante</h3>
          <ul className="receipt">
            <li><strong>ID transacción:</strong> {result.id}</li>
            <li><strong>Origen:</strong> {result.senderAccountNumber}</li>
            <li><strong>Destino:</strong> {result.receiverAccountNumber}</li>
            <li><strong>Monto:</strong> ${Number(result.amount).toFixed(2)}</li>
            <li><strong>Fecha:</strong> {result.timestamp ? new Date(result.timestamp).toLocaleString() : "-"}</li>
          </ul>
        </div>
      )}
    </section>
  );
}
