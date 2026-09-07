import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTransactionsByAccount } from "../api/client";
import { useCustomers } from "../hooks/useCustomers";
import { useMyAccount } from "../hooks/useMyAccount";
import { formatCurrency, formatDate } from "../utils/format";
import Icon from "../components/Icon";
import BalanceCard from "../components/BalanceCard";

const QUICK = [
  { to: "/transferir", label: "Enviar", icon: "send", desc: "Transferir dinero" },
  { to: "/historico", label: "Historial", icon: "history", desc: "Ver movimientos" },
  { to: "/clientes", label: "Clientes", icon: "users", desc: "Cuentas del banco" },
];

export default function HomeView() {
  const { customers } = useCustomers();
  const { myAccount } = useMyAccount();
  const navigate = useNavigate();
  const [movements, setMovements] = useState([]);

  const customer = customers.find((c) => String(c.accountNumber) === String(myAccount));

  useEffect(() => {
    let cancelled = false;
    if (!myAccount) {
      setMovements([]);
      return;
    }
    getTransactionsByAccount(myAccount)
      .then(({ data }) => {
        if (!cancelled) setMovements(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch(() => {
        if (!cancelled) setMovements([]);
      });
    return () => {
      cancelled = true;
    };
  }, [myAccount]);

  return (
    <section>
      <header className="page-head">
        <h2>Inicio</h2>
        <p>Tu resumen y accesos rápidos, como en tu app del banco.</p>
      </header>

      <BalanceCard myAccount={myAccount} customer={customer} />

      <div className="quick-grid">
        {QUICK.map((q) => (
          <Link key={q.to} to={q.to} className="quick-action">
            <span className="quick-action-icon"><Icon name={q.icon} size={20} /></span>
            <span className="quick-action-label">{q.label}</span>
            <span className="quick-action-desc">{q.desc}</span>
          </Link>
        ))}
      </div>

      {myAccount && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Icon name="history" size={16} />
              <h3>Últimos movimientos</h3>
            </div>
            <Link to="/historico" className="btn ghost">
              Ver todos <Icon name="arrowUp" size={14} className="rot-90" />
            </Link>
          </div>

          {movements.length === 0 ? (
            <div className="empty">
              <Icon name="inbox" size={28} />
              <p>Esta cuenta aún no tiene movimientos.</p>
            </div>
          ) : (
            <ul className="movement-list">
              {movements.map((t) => {
                const isOut = String(t.senderAccountNumber) === String(myAccount);
                const other = isOut ? t.receiverAccountNumber : t.senderAccountNumber;
                return (
                  <li
                    key={t.id}
                    className="movement"
                    onClick={() => navigate("/historico", { state: { account: myAccount } })}
                  >
                    <span className={`movement-flow ${isOut ? "out" : "in"}`}>
                      <Icon name={isOut ? "arrowUp" : "arrowDown"} size={16} />
                    </span>
                    <span className="movement-text">
                      <span className="movement-title">{isOut ? "Enviaste" : "Recibiste"}</span>
                      <span className="movement-sub mono">{other}</span>
                    </span>
                    <span className="movement-meta">
                      <span className={`movement-amount ${isOut ? "neg" : "pos"}`}>
                        {isOut ? "−" : "+"}{formatCurrency(t.amount)}
                      </span>
                      <span className="movement-date">{formatDate(t.timestamp)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
