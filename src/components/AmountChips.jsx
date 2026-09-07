import { formatNumber } from "../utils/format";

// Chips de monto rápido. Entrega el valor como string numérico plano (compatible con MoneyInput).
const PRESETS = [10000, 20000, 50000, 100000];

export default function AmountChips({ onSelect }) {
  return (
    <div className="amount-chips" role="group" aria-label="Montos rápidos">
      {PRESETS.map((amount) => (
        <button
          key={amount}
          type="button"
          className="chip"
          onClick={() => onSelect(String(amount))}
        >
          ${formatNumber(amount)}
        </button>
      ))}
    </div>
  );
}
