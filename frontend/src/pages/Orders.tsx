import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  CONVERTED: "Converted",
  REJECTED: "Rejected",
};

// RETAILER view: naya order place karo + apni order history dekho
function RetailerOrders() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  function load() {
    api.getMedicines().then(setMedicines).catch((e) => setError(e.message));
    api.myOrders().then(setOrders).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  function setQty(id: string, qty: number) {
    setCart((c) => ({ ...c, [id]: Math.max(0, qty) }));
  }

  async function submit() {
    const items = Object.entries(cart).filter(([, q]) => q > 0).map(([medicineId, quantity]) => ({ medicineId, quantity }));
    if (items.length === 0) return;
    try {
      await api.createOrder(items);
      setCart({});
      setMsg("Order bhej diya gaya!");
      setTimeout(() => setMsg(""), 3000);
      load();
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div>
      <h1>Order Karo</h1>
      {error && <div className="error-note">{error}</div>}
      {msg && <div className="success-note">{msg}</div>}

      <div className="split">
        <div className="card">
          <h3>Medicines</h3>
          {medicines.map((m) => {
            const stock = (m.batches || []).reduce((s: number, b: any) => s + b.quantity, 0);
            return (
              <div className="product-row" key={m.id}>
                <div>
                  <div className="product-name">{m.name}</div>
                  <div className="product-meta">Stock: {stock} · ₹{Number(m.mrp)}/unit</div>
                </div>
                <div className="qty-control">
                  <button onClick={() => setQty(m.id, (cart[m.id] || 0) - 1)}>−</button>
                  <span>{cart[m.id] || 0}</span>
                  <button onClick={() => setQty(m.id, (cart[m.id] || 0) + 1)}>+</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <h3>Order Bhejo</h3>
          <button className="btn-primary full" onClick={submit}>Order Bhejo</button>
        </div>
      </div>

      <h3 style={{ marginTop: 20 }}>Mere Orders</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Items</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.items.map((i: any) => `${i.medicine.name} x${i.quantity}`).join(", ")}</td>
                <td className={o.status === "REJECTED" ? "bad" : o.status === "CONVERTED" ? "good" : ""}>
                  {statusLabel[o.status]}
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ADMIN/STAFF view: pending orders ki list, "Bill Banao" ya "Reject"
function ManageOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  function load() {
    api.listPendingOrders().then(setOrders).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function convert(id: string) {
    try {
      await api.convertOrder(id);
      setMsg("Bill ban gaya!");
      setTimeout(() => setMsg(""), 3000);
      load();
    } catch (e: any) { setError(e.message); }
  }

  async function reject(id: string) {
    try {
      await api.rejectOrder(id);
      load();
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div>
      <h1>Orders</h1>
      {error && <div className="error-note">{error}</div>}
      {msg && <div className="success-note">{msg}</div>}

      {orders.length === 0 && <p>Koi pending order nahi hai.</p>}

      {orders.map((o) => (
        <div className="card" key={o.id} style={{ marginBottom: 12 }}>
          <div className="page-head">
            <strong>{o.customer?.name}</strong>
            <span>{new Date(o.createdAt).toLocaleString("en-IN")}</span>
          </div>
          <ul>
            {o.items.map((i: any) => (
              <li key={i.id}>{i.medicine.name} — Qty: {i.quantity}</li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary small" onClick={() => convert(o.id)}>Bill Banao</button>
            <button className="btn-secondary small" onClick={() => reject(o.id)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  if (user?.role === "RETAILER") return <RetailerOrders />;
  return <ManageOrders />;
}
