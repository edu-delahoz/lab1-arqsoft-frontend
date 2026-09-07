import { Link } from "react-router-dom";
import Icon from "./Icon";
import CopyButton from "./CopyButton";
import { formatCurrency, maskAccount } from "../utils/format";

// Tarjeta "hero" de la cuenta favorita (estilo Nequi). Si no hay cuenta fijada,
// muestra un CTA para elegirla desde Clientes.
export default function BalanceCard({ myAccount, customer }) {
  if (!myAccount) {
    return (
      <div className="balance-card empty-account">
        <div className="balance-card-icon"><Icon name="wallet" size={22} /></div>
        <div>
          <p className="balance-card-title">Aún no eliges tu cuenta</p>
          <p className="balance-card-sub">
            Marca una cuenta como tuya con la ⭐ en Clientes para verla aquí.
          </p>
        </div>
        <Link to="/clientes" className="btn primary">
          <Icon name="users" size={16} /> Ir a Clientes
        </Link>
      </div>
    );
  }

  const name = customer ? `${customer.firstName} ${customer.lastName}` : "Mi cuenta";

  return (
    <div className="balance-card">
      <div className="balance-card-head">
        <span className="balance-card-label">
          <Icon name="wallet" size={15} /> Mi cuenta
        </span>
        <span className="balance-card-account mono">
          {maskAccount(myAccount)}
          <CopyButton text={myAccount} title="Copiar número de cuenta" />
        </span>
      </div>
      <p className="balance-card-name">{name}</p>
      <p className="balance-card-amount">
        {customer ? formatCurrency(customer.balance) : "—"}
      </p>
      {!customer && (
        <p className="balance-card-warn">
          <Icon name="alert" size={14} /> Esta cuenta ya no está registrada.
        </p>
      )}
    </div>
  );
}
