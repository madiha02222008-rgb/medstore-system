import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Medicines from "./pages/Medicines";
import Sales from "./pages/Sales";
import Purchases from "./pages/Purchases";
import Parties from "./pages/Parties";
import Payments from "./pages/Payments";
import "./styles.css";

function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navByRole: Record<string, { to: string; label: string }[]> = {
    ADMIN: [
      { to: "/medicines", label: "Medicines & Stock" },
      { to: "/purchases", label: "Purchases" },
      { to: "/sales", label: "Sales" },
      { to: "/parties", label: "Customers & Suppliers" },
      { to: "/payments", label: "Payments" },
    ],
    STAFF: [
      { to: "/medicines", label: "Stock" },
      { to: "/purchases", label: "Purchases" },
      { to: "/sales", label: "New Bill" },
    ],
    RETAILER: [{ to: "/sales", label: "My Orders" }],
    ACCOUNTANT: [
      { to: "/sales", label: "Bills" },
      { to: "/payments", label: "Payments & Udhaar" },
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Shell>{children}</Shell>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/medicines" /> : <Login />} />
      <Route path="/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
      <Route path="/parties" element={<ProtectedRoute><Parties /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
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
