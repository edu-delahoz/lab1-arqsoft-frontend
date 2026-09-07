import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import CustomersView from "./pages/CustomersView";
import TransferView from "./pages/TransferView";
import TransactionHistoryView from "./pages/TransactionHistoryView";
import Icon from "./components/Icon";
import "./App.css";

const NAV = [
  { to: "/clientes", label: "Clientes", icon: "users" },
  { to: "/transferir", label: "Transferir", icon: "transfer" },
  { to: "/historico", label: "Histórico", icon: "history" },
];

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark"><Icon name="landmark" size={20} /></span>
          <span className="brand-text">
            <strong>Banco UdeA</strong>
            <span className="brand-sub">Laboratorio 1 · Arquitectura de Software</span>
          </span>
        </div>
        <nav aria-label="Secciones">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </NavLink>
          ))}
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
