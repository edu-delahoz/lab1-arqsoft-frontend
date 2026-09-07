// Formato de moneda y números para Colombia (miles con ".", decimales con ",").

const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 2,
});

const NUM = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });

// 1000000.5 -> "$ 1.000.000,5"
export function formatCurrency(value) {
  const n = Number(value);
  if (!isFinite(n)) return "-";
  return COP.format(n);
}

export function formatNumber(value) {
  const n = Number(value);
  if (!isFinite(n)) return "-";
  return NUM.format(n);
}

// Fecha legible en es-CO
export function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Agrupa un string numérico "plano" (decimal con punto) para mostrarlo mientras se escribe:
// "1000000.5" -> "1.000.000,5"
export function groupPlain(plain) {
  if (plain === "" || plain == null) return "";
  const [intPart, decPart] = String(plain).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decPart !== undefined ? `${grouped},${decPart}` : grouped;
}

// Convierte lo que teclea el usuario a un string numérico plano (decimal con punto).
// Acepta dígitos y una coma decimal; ignora el resto.
export function parseToPlain(raw) {
  const cleaned = String(raw).replace(/[^\d,]/g, "");
  const parts = cleaned.split(",");
  const intPart = parts[0].replace(/\D/g, "");
  if (parts.length === 1) return intPart;
  const decPart = parts.slice(1).join("").replace(/\D/g, "").slice(0, 2);
  return `${intPart}.${decPart}`;
}

// Número de cuenta aleatorio de 10 dígitos (string), que no empiece por 0.
export function randomAccountNumber() {
  let s = String(Math.floor(Math.random() * 9) + 1); // primer dígito 1-9
  for (let i = 0; i < 9; i++) s += Math.floor(Math.random() * 10);
  return s;
}

// Enmascara un número de cuenta dejando visibles los últimos 4 dígitos: "1023456789" -> "···6789".
export function maskAccount(acc) {
  const s = String(acc ?? "");
  if (s.length <= 4) return s;
  return `···${s.slice(-4)}`;
}

// Iniciales a partir de nombre y apellido: ("Ana", "Pérez") -> "AP".
export function initials(firstName, lastName) {
  const a = String(firstName ?? "").trim();
  const b = String(lastName ?? "").trim();
  const first = a ? a[0] : "";
  const second = b ? b[0] : a.length > 1 ? a[1] : "";
  return (first + second).toUpperCase() || "?";
}

// Color de avatar estable derivado de un texto (mismo nombre -> mismo tono).
const AVATAR_COLORS = [
  "#0f7d6b", "#2563eb", "#7c3aed", "#db2777",
  "#ea580c", "#0891b2", "#4d7c0f", "#b45309",
];
export function avatarColor(seed) {
  const s = String(seed ?? "");
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
