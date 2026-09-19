import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Ledger() {
  const [payments, setPayments] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getLedger().then(setPayments).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1>Ledger</h1>
      {error && <div className="error-note">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Customer</th><th>Amount</th><th>Mode</th><th>Bill Total</th><th>Date</th></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.sale?.customer?.name}</td>
                <td>₹{Number(p.amount).toLocaleString("en-IN")}</td>
                <td>{p.mode}</td>
                <td>₹{Number(p.sale?.total).toLocaleString("en-IN")}</td>
                <td>{new Date(p.createdAt).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
