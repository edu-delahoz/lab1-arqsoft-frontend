import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTransactionsByAccount } from "../api/client";
import { useCustomers } from "../hooks/useCustomers";
import { useMyAccount } from "../hooks/useMyAccount";
import { formatCurrency, formatDate } from "../utils/format";
import Icon from "../components/Icon";
import AccountSelect from "../components/AccountSelect";

export default function TransactionHistoryView() {
  const { customers } = useCustomers();
  const { myAccount } = useMyAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [queried, setQueried] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState(null);

  const runQuery = async (acc) => {
    const value = String(acc).trim();
    if (!value) return;
    setMessage(null);
    try {
      const { data } = await getTransactionsByAccount(value);
      setTransactions(data);
      setQueried(value);
      setSearched(true);
    } catch {
      setMessage({ type: "error", text: "No se pudo consultar el histórico. ¿El backend está corriendo?" });
      setTransactions([]);
      setSearched(true);
    }
  };

  // Precarga desde Inicio (click en un movimiento).
  useEffect(() => {
    const acc = location.state?.account;
    if (acc) {
      setAccountNumber(String(acc));
      runQuery(acc);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    runQuery(accountNumber);
  };

  return (
    <section>
      <header className="page-head">
        <h2>Histórico</h2>
        <p>Consulta todos los movimientos de una cuenta, enviados y recibidos.</p>
      </header>

      <form className="card inline-form" onSubmit={handleSubmit}>
        <div className="field grow">
          <div className="field-label-row">
            <label htmlFor="account">Número de cuenta</label>
            {myAccount && String(accountNumber) !== String(myAccount) && (
              <button
                type="button"
                className="chip chip-mine"
                onClick={() => setAccountNumber(myAccount)}
              >
                <Icon name="star" size={13} /> Usar mi cuenta
              </button>
            )}
          </div>
          <AccountSelect
            id="account"
            value={accountNumber}
            onChange={setAccountNumber}
            customers={customers}
            placeholder="Cuenta o nombre…"
            required
          />
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
                    <th className="col-action"></th>
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
                        <td className="col-action">
                          <button
                            className="icon-btn"
                            title="Repetir esta transferencia"
                            aria-label="Repetir esta transferencia"
                            onClick={() =>
                              navigate("/transferir", {
                                state: {
                                  sender: t.senderAccountNumber,
                                  receiver: t.receiverAccountNumber,
                                  amount: t.amount,
                                },
                              })
                            }
                          >
                            <Icon name="repeat" size={16} />
                          </button>
                        </td>
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
