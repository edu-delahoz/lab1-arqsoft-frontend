import { useState } from "react";
import { getTransactionsByAccount } from "../api/client";

export default function TransactionHistoryView() {
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const { data } = await getTransactionsByAccount(accountNumber.trim());
      setTransactions(data);
      setSearched(true);
    } catch (err) {
      setMessage({ type: "error", text: "No se pudo consultar el histórico. ¿El backend está corriendo?" });
      setTransactions([]);
      setSearched(true);
    }
  };

  return (
    <section>
      <h2>Histórico de transacciones</h2>

      <form className="card inline-form" onSubmit={handleSubmit}>
        <label>
          Número de cuenta
          <input
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Ej. 123456789"
            required
          />
        </label>
        <button type="submit">Consultar</button>
      </form>

      {message && <p className={`message ${message.type}`}>{message.text}</p>}

      {searched && !message && (
        <div className="card">
          <h3>Movimientos de la cuenta {accountNumber}</h3>
          {transactions.length === 0 ? (
            <p>Esta cuenta no tiene transacciones.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Origen</th>
                  <th>Destino</th>
                  <th>Monto</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => {
                  const isOutgoing = t.senderAccountNumber === accountNumber.trim();
                  return (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.senderAccountNumber}</td>
                      <td>{t.receiverAccountNumber}</td>
                      <td>${Number(t.amount).toFixed(2)}</td>
                      <td>
                        <span className={isOutgoing ? "tag out" : "tag in"}>
                          {isOutgoing ? "Enviada" : "Recibida"}
                        </span>
                      </td>
                      <td>{t.timestamp ? new Date(t.timestamp).toLocaleString() : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
