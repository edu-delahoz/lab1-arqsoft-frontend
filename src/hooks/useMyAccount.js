import { useCallback, useEffect, useState } from "react";

// "Mi cuenta" favorita: número de cuenta guardado en localStorage y sincronizado
// entre todas las vistas montadas (evento propio) y entre pestañas (evento "storage").

const KEY = "banco-udea:mi-cuenta";
const EVENT = "banco-udea:mi-cuenta-change";

function read() {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function useMyAccount() {
  const [myAccount, setMyAccountState] = useState(read);

  useEffect(() => {
    const sync = () => setMyAccountState(read());
    // Cambios dentro de la misma pestaña (otras vistas) y entre pestañas.
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setMyAccount = useCallback((accountNumber) => {
    try {
      localStorage.setItem(KEY, String(accountNumber || ""));
    } catch {
      // Ignorar: localStorage puede no estar disponible (modo privado).
    }
    setMyAccountState(String(accountNumber || ""));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const clearMyAccount = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Ignorar.
    }
    setMyAccountState("");
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { myAccount, setMyAccount, clearMyAccount };
}
