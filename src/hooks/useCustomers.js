import { useCallback, useEffect, useState } from "react";
import { getCustomers } from "../api/client";

// Carga la lista de clientes desde el backend y expone estado + recarga.
// Se reutiliza en el selector de cuentas, Inicio y Transferir.
export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { customers, loading, error, reload };
}
