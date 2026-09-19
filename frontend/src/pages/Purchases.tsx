import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [medicines, setMedicines] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [itemForm, setItemForm] = useState({ medicineId: "", batchNumber: "", expiryDate: "", quantity: "", rate: "", mrp: "" });

  function load() {
    api.getPurchases().then(setPurchases).catch((e) => setError(e.message));
    api.getSuppliers().then(setSuppliers).catch(() => {});
    api.getMedicines().then(setMedicines).catch(() => {});
  }
  useEffect(load, []);

  function addItem() {
    if (!itemForm.medicineId || !itemForm.batchNumber || !itemForm.quantity || !itemForm.rate) return;
    setItems([...items, { ...itemForm, quantity: Number(itemForm.quantity), rate: Number(itemForm.rate), mrp: Number(itemForm.mrp) || 0 }]);
    setItemForm({ medicineId: "", batchNumber: "", expiryDate: "", quantity: "", rate: "", mrp: "" });
  }

  async function submitPurchase() {
    try {
      await api.createPurchase({ supplierId, items });
      setItems([]);
      setSupplierId("");
      load();
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div>
      <h1>Purchases</h1>
      {error && <div className="error-note">{error}</div>}

      <div className="card form-card">
        <h3>Naya Purchase</h3>
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
          <option value="">Supplier chuno</option>
          {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <div className="form-grid" style={{ marginTop: 10 }}>
          <select value={itemForm.medicineId} onChange={(e) => setItemForm({ ...itemForm, medicineId: e.target.value })}>
            <option value="">Medicine chuno</option>
            {medicines.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <input placeholder="Batch Number" value={itemForm.batchNumber} onChange={(e) => setItemForm({ ...itemForm, batchNumber: e.target.value })} />
          <input placeholder="Expiry (YYYY-MM-DD)" value={itemForm.expiryDate} onChange={(e) => setItemForm({ ...itemForm, expiryDate: e.target.value })} />
          <input placeholder="Quantity" type="number" value={itemForm.quantity} onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })} />
          <input placeholder="Purchase Rate" type="number" value={itemForm.rate} onChange={(e) => setItemForm({ ...itemForm, rate: e.target.value })} />
          <input placeholder="MRP" type="number" value={itemForm.mrp} onChange={(e) => setItemForm({ ...itemForm, mrp: e.target.value })} />
        </div>
        <button className="btn-ghost" style={{ marginTop: 8 }} onClick={addItem}>+ Item jodo</button>

        {items.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {items.map((it, i) => (
              <div className="list-row" key={i}>
                <span>{medicines.find((m) => m.id === it.medicineId)?.name} × {it.quantity}</span>
                <span>₹{it.rate}/unit</span>
              </div>
            ))}
          </div>
        )}

        <button className="btn-primary full" disabled={!supplierId || items.length === 0} onClick={submitPurchase} style={{ marginTop: 12 }}>
          Purchase Save Karo
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Supplier</th><th>Invoice</th><th>Total</th><th>Date</th></tr></thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td>{p.supplier?.name}</td>
                <td>{p.invoiceNo || "—"}</td>
                <td>₹{Number(p.total).toLocaleString("en-IN")}</td>
                <td>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
