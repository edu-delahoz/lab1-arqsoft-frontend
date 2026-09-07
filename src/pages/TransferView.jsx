import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { transfer } from "../api/client";
import { useCustomers } from "../hooks/useCustomers";
import { useMyAccount } from "../hooks/useMyAccount";
import { formatCurrency, formatDate } from "../utils/format";
import Icon from "../components/Icon";
import MoneyInput from "../components/MoneyInput";
import AccountSelect from "../components/AccountSelect";
import AmountChips from "../components/AmountChips";
import CopyButton from "../components/CopyButton";

const emptyForm = { senderAccountNumber: "", receiverAccountNumber: "", amount: "" };

export default function TransferView() {
  const { customers } = useCustomers();
  const { myAccount } = useMyAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  // Precarga desde otras vistas (Clientes "Transferir", Histórico "Repetir").
  useEffect(() => {
    const s = location.state;
    if (s && (s.sender || s.receiver || s.amount)) {
      setForm((f) => ({
        senderAccountNumber: s.sender ?? f.senderAccountNumber,
        receiverAccountNumber: s.receiver ?? f.receiverAccountNumber,
        amount: s.amount != null ? String(s.amount) : f.amount,
      }));
      navigate(location.pathname, { replace: true, state: null }); // evitar re-precarga
    }
  }, [location.state, location.pathname, navigate]);

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const sender = customers.find((c) => String(c.accountNumber) === String(form.senderAccountNumber));
  const senderBalance = sender ? Number(sender.balance) : null;
  const amountNum = parseFloat(form.amount || "0");
  const insufficient = senderBalance != null && amountNum > senderBalance;

  const swap = () =>
    setForm((f) => ({
      ...f,
      senderAccountNumber: f.receiverAccountNumber,
      receiverAccountNumber: f.senderAccountNumber,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setResult(null);
    if (insufficient) {
      setMessage({ type: "error", text: "Saldo insuficiente en la cuenta origen." });
      return;
    }
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

  const isMine = myAccount && String(form.senderAccountNumber) === String(myAccount);

  return (
    <section>
      <header className="page-head">
        <h2>Transferir</h2>
        <p>Mueve dinero entre dos cuentas registradas.</p>
      </header>

      <form className="card" onSubmit={handleSubmit}>
        <div className="transfer-fields">
          <div className="field">
            <div className="field-label-row">
              <label htmlFor="senderAccountNumber">Cuenta origen</label>
              {myAccount && !isMine && (
                <button
                  type="button"
                  className="chip chip-mine"
                  onClick={() => setField("senderAccountNumber", myAccount)}
                >
                  <Icon name="star" size={13} /> Usar mi cuenta
                </button>
              )}
            </div>
            <AccountSelect
              id="senderAccountNumber"
              value={form.senderAccountNumber}
              onChange={(v) => setField("senderAccountNumber", v)}
              customers={customers}
              excludeAccount={form.receiverAccountNumber}
              placeholder="De… (cuenta o nombre)"
              required
            />
            {senderBalance != null && (
              <span className={`balance-hint${insufficient ? " neg" : ""}`}>
                Saldo disponible: {formatCurrency(senderBalance)}
              </span>
            )}
          </div>

          <button
            type="button"
            className="icon-btn swap-btn"
            onClick={swap}
            title="Intercambiar origen y destino"
            aria-label="Intercambiar origen y destino"
          >
            <Icon name="swap" size={16} />
          </button>

          <div className="field">
            <label htmlFor="receiverAccountNumber">Cuenta destino</label>
            <AccountSelect
              id="receiverAccountNumber"
              value={form.receiverAccountNumber}
              onChange={(v) => setField("receiverAccountNumber", v)}
              customers={customers}
              excludeAccount={form.senderAccountNumber}
              placeholder="Para… (cuenta o nombre)"
              required
            />
          </div>
        </div>

        <div className="field amount-field">
          <label htmlFor="amount">Monto</label>
          <MoneyInput id="amount" value={form.amount} onChange={(v) => setField("amount", v)} required />
          <AmountChips onSelect={(v) => setField("amount", v)} />
        </div>

        <div className="card-actions">
          <button type="submit" className="btn primary" disabled={insufficient}>
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
            <div>
              <dt>ID transacción</dt>
              <dd className="mono">{result.id} <CopyButton text={result.id} title="Copiar ID" /></dd>
            </div>
            <div>
              <dt>Cuenta origen</dt>
              <dd className="mono">{result.senderAccountNumber} <CopyButton text={result.senderAccountNumber} title="Copiar cuenta origen" /></dd>
            </div>
            <div>
              <dt>Cuenta destino</dt>
              <dd className="mono">{result.receiverAccountNumber} <CopyButton text={result.receiverAccountNumber} title="Copiar cuenta destino" /></dd>
            </div>
            <div><dt>Fecha</dt><dd>{formatDate(result.timestamp)}</dd></div>
          </dl>
        </div>
      )}
    </section>
  );
}
