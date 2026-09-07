import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "./Icon";
import Avatar from "./Avatar";
import { formatCurrency, maskAccount } from "../utils/format";

// Combobox de cuentas: se puede teclear el número directamente o buscar por nombre.
// `value`/`onChange` manejan el número de cuenta (string). `customers` alimenta las sugerencias.
export default function AccountSelect({
  id,
  value,
  onChange,
  customers = [],
  placeholder = "Buscar cuenta o nombre…",
  excludeAccount,
  required,
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);

  // Cerrar al hacer click fuera.
  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const query = String(value ?? "").trim().toLowerCase();
  const options = useMemo(() => {
    const list = customers.filter((c) => String(c.accountNumber) !== String(excludeAccount));
    if (!query) return list;
    return list.filter((c) => {
      const name = `${c.firstName} ${c.lastName}`.toLowerCase();
      return String(c.accountNumber).includes(query) || name.includes(query);
    });
  }, [customers, query, excludeAccount]);

  const selected = customers.find((c) => String(c.accountNumber) === String(value));

  const choose = (c) => {
    onChange(String(c.accountNumber));
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (open && active >= 0 && options[active]) {
        e.preventDefault();
        choose(options[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div className="account-select" ref={wrapRef}>
      <div className="input-with-action">
        <input
          id={id}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          required={required}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
        />
        <button
          type="button"
          className="icon-btn"
          tabIndex={-1}
          aria-label={open ? "Cerrar sugerencias" : "Ver cuentas"}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name="chevronDown" size={16} />
        </button>
      </div>

      {selected && (
        <span className="account-select-hint">
          {selected.firstName} {selected.lastName} · {formatCurrency(selected.balance)}
        </span>
      )}

      {open && options.length > 0 && (
        <ul className="account-options" id={`${id}-list`} role="listbox">
          {options.map((c, i) => (
            <li
              key={c.id ?? c.accountNumber}
              role="option"
              aria-selected={i === active}
              className={`account-option${i === active ? " active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault(); // evita blur antes del click
                choose(c);
              }}
            >
              <Avatar firstName={c.firstName} lastName={c.lastName} size={30} />
              <span className="account-option-text">
                <span className="account-option-name">{c.firstName} {c.lastName}</span>
                <span className="account-option-sub mono">{maskAccount(c.accountNumber)}</span>
              </span>
              <span className="account-option-balance mono">{formatCurrency(c.balance)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
