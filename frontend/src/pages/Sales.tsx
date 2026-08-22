import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [customerId, setCustomerId] = useState("");
  const [cart, setCart] = useState<Record<string, number>>({});

  function load() {
    api.getSales().then(setSales).catch((e) => setError(e.message));
    api.getCustomers().then(setCustomers).catch(() => {});
    api.getMedicines().then(setMedicines).catch(() => {});
  }
  useEffect(load, []);

  function setQty(id: string, qty: number) {
    setCart((c) => ({ ...c, [id]: Math.max(0, qty) }));
  }

  async function submit() {
    const items = Object.entries(cart).filter(([, q]) => q > 0).map(([medicineId, quantity]) => ({ medicineId, quantity }));
    if (!customerId || items.length === 0) return;
    try {
      await api.createSale({ customerId, items });
      setCart({});
      setCustomerId("");
      load();
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div>
      <h1>Sales / Billing</h1>
      {error && <div className="error-note">{error}</div>}

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
          <h3>Bill</h3>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Customer chuno</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button className="btn-primary full" style={{ marginTop: 12 }} onClick={submit}>Bill Banao</button>
        </div>
      </div>

      <h3 style={{ marginTop: 20 }}>Recent Bills</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Customer</th><th>Total</th><th>Paid</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td>{s.customer?.name}</td>
                <td>₹{Number(s.total).toLocaleString("en-IN")}</td>
                <td>₹{Number(s.paid).toLocaleString("en-IN")}</td>
                <td>{s.status}</td>
                <td>{new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
