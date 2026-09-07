import { useState } from "react";
import Icon from "./Icon";

// Copia un texto al portapapeles con feedback (copy -> check) y fallback a prompt().
export default function CopyButton({ text, title = "Copiar", label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const value = String(text ?? "");
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback si la API de portapapeles no está disponible (http plano, permisos).
      window.prompt("Copia el valor:", value);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      className={`icon-btn${copied ? " ok" : ""}`}
      onClick={handleCopy}
      title={copied ? "¡Copiado!" : title}
      aria-label={copied ? "Copiado" : title}
    >
      <Icon name={copied ? "check" : "copy"} size={16} />
      {label && <span className="copy-label">{copied ? "¡Copiado!" : label}</span>}
    </button>
  );
}
