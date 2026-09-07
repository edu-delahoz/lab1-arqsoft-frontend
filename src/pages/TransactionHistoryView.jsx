import { useState } from "react";
import { getTransactionsByAccount } from "../api/client";
import { formatCurrency, formatDate } from "../utils/format";
import Icon from "../components/Icon";

export default function TransactionHistoryView() {
  const [accountNumber, setAccountNumber] = useState("");
  const [queried, setQueried] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const acc = accountNumber.trim();
    try {
      const { data } = await getTransactionsByAccount(acc);
      setTransactions(data);
      setQueried(acc);
      setSearched(true);
    } catch {
      setMessage({ type: "error", text: "No se pudo consultar el histórico. ¿El backend está corriendo?" });
      setTransactions([]);
      setSearched(true);
    }
  };

  return (
    <section>
      <header className="page-head">
        <h2>Histórico</h2>
        <p>Consulta todos los movimientos de una cuenta, enviados y recibidos.</p>
      </header>

      <form className="card inline-form" onSubmit={handleSubmit}>
        <div className="field grow">
          <label htmlFor="account">Número de cuenta</label>
          <input id="account" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Ej. 1023456789" required />
        </div>
        <button type="submit" className="btn primary">
          <Icon name="search" size={16} /> Consultar
        </button>
      </form>

      {message && (
        <p className="message error" role="status" aria-live="polite">
          <Icon name="alert" size={16} />
          {message.text}
        </p>
      )}

      {searched && !message && (
        <div className="card">
          <div className="card-title">
            <Icon name="history" size={16} />
            <h3>Movimientos de la cuenta <span className="mono">{queried}</span></h3>
            <span className="badge">{transactions.length}</span>
          </div>

          {transactions.length === 0 ? (
            <div className="empty">
              <Icon name="inbox" size={28} />
              <p>Esta cuenta no tiene transacciones.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th className="num">Monto</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => {
                    const isOut = t.senderAccountNumber === queried;
                    return (
                      <tr key={t.id}>
                        <td>
                          <span className={`flow ${isOut ? "out" : "in"}`} title={isOut ? "Enviada" : "Recibida"}>
                            <Icon name={isOut ? "arrowUp" : "arrowDown"} size={14} />
                            {isOut ? "Enviada" : "Recibida"}
                          </span>
                        </td>
                        <td className="mono">{t.senderAccountNumber}</td>
                        <td className="mono">{t.receiverAccountNumber}</td>
                        <td className={`num money ${isOut ? "neg" : "pos"}`}>
                          {isOut ? "−" : "+"}{formatCurrency(t.amount)}
                        </td>
                        <td>{formatDate(t.timestamp)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
