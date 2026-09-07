import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import CustomersView from "./pages/CustomersView";
import TransferView from "./pages/TransferView";
import TransactionHistoryView from "./pages/TransactionHistoryView";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <h1>🏦 Banco UdeA — Laboratorio 1</h1>
        <nav>
          <NavLink to="/clientes">Clientes</NavLink>
          <NavLink to="/transferir">Transferir</NavLink>
          <NavLink to="/historico">Histórico</NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/clientes" replace />} />
          <Route path="/clientes" element={<CustomersView />} />
          <Route path="/transferir" element={<TransferView />} />
          <Route path="/historico" element={<TransactionHistoryView />} />
        </Routes>
      </main>
    </div>
  );
}
