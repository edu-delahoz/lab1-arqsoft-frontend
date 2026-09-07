import { groupPlain, parseToPlain } from "../utils/format";

// Input de dinero: muestra separador de miles mientras se escribe (1.000.000)
// y entrega al padre un string numérico plano (decimal con punto).
export default function MoneyInput({ id, value, onChange, placeholder = "0", required }) {
  const handle = (e) => onChange(parseToPlain(e.target.value));
  return (
    <div className="money-input">
      <span className="money-prefix" aria-hidden="true">$</span>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        value={groupPlain(value)}
        onChange={handle}
        required={required}
      />
    </div>
  );
}
