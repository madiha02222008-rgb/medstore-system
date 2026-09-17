import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Medicines from "./pages/Medicines";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Parties from "./pages/Parties";
import Payments from "./pages/Payments";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Ledger from "./pages/Ledger";
import "./styles.css";

function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navByRole: Record<string, { to: string; label: string }[]> = {
    ADMIN: [
      { to: "/medicines", label: "Medicines & Stock" },
      { to: "/purchases", label: "Purchases" },
      { to: "/orders", label: "Orders" },
      { to: "/sales", label: "Sales" },
      { to: "/parties", label: "Customers & Suppliers" },
      { to: "/payments", label: "Payments" },
      { to: "/users", label: "Users" },
    ],
    STAFF: [
      { to: "/medicines", label: "Stock" },
      { to: "/purchases", label: "Purchases" },
      { to: "/orders", label: "Orders" },
      { to: "/sales", label: "New Bill" },
    ],
    RETAILER: [{ to: "/orders", label: "Order Karo" }],
    ACCOUNTANT: [
      { to: "/sales", label: "Bills" },
      { to: "/payments", label: "Payments & Udhaar" },
      { to: "/ledger", label: "Ledger" },
    ],
  };

  const links = user ? navByRole[user.role] || [] : [];

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">MedStock</div>
        {user && (
          <div className="who">
            <div className="who-role">{user.role}</div>
            <div className="who-name">{user.name}</div>
          </div>
        )}
        <nav>
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="nav-item">{l.label}</Link>
          ))}
        </nav>
        {user && (
          <button className="nav-item logout" onClick={() => { logout(); navigate("/login"); }}>
            Logout
          </button>
        )}
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/orders" replace />;
  return <Shell>{children}</Shell>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === "RETAILER" ? "/orders" : "/medicines"} /> : <Login />} />
      <Route path="/medicines" element={<ProtectedRoute roles={["ADMIN", "STAFF", "ACCOUNTANT"]}><Medicines /></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute roles={["ADMIN", "STAFF", "ACCOUNTANT"]}><Purchases /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute roles={["ADMIN", "STAFF", "RETAILER"]}><Orders /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute roles={["ADMIN", "STAFF", "ACCOUNTANT"]}><Sales /></ProtectedRoute>} />
      <Route path="/parties" element={<ProtectedRoute roles={["ADMIN", "STAFF"]}><Parties /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}><Payments /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute roles={["ADMIN"]}><Users /></ProtectedRoute>} />
      <Route path="/ledger" element={<ProtectedRoute roles={["ADMIN", "ACCOUNTANT"]}><Ledger /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
