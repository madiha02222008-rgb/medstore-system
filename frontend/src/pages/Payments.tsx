import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Payments() {
  const [sales, setSales] = useState<any[]>([]);
  const [outstanding, setOutstanding] = useState<any[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  function load() {
    api.getSales().then(setSales).catch((e) => setError(e.message));
    api.outstanding().then(setOutstanding).catch(() => {});
  }
  useEffect(load, []);

  async function pay(saleId: string) {
    const amt = Number(amounts[saleId]);
    if (!amt || amt <= 0) return;
    try {
      await api.recordPayment(saleId, amt, "Cash");
      setAmounts({ ...amounts, [saleId]: "" });
      load();
    } catch (e: any) { setError(e.message); }
  }

  const due = sales.filter((s) => s.status !== "PAID");

  return (
    <div>
      <h1>Payments</h1>
      {error && <div className="error-note">{error}</div>}

      <div className="card">
        <h3>Baaki Payments</h3>
        {due.map((s) => (
          <div className="list-row" key={s.id}>
            <span>{s.customer?.name} · Balance ₹{(Number(s.total) - Number(s.paid)).toLocaleString("en-IN")}</span>
            <span className="pay-input">
              <input type="number" placeholder="Amount" value={amounts[s.id] || ""} onChange={(e) => setAmounts({ ...amounts, [s.id]: e.target.value })} />
              <button className="btn-primary small" onClick={() => pay(s.id)}>Mark Paid</button>
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Udhaar Summary (Customer-wise)</h3>
        {outstanding.map((o, i) => (
          <div className="list-row" key={i}><span>{o.name}</span><span className="bad">₹{o.balance.toLocaleString("en-IN")}</span></div>
        ))}
      </div>
    </div>
  );
}
