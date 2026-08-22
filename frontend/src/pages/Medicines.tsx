import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Medicines() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", unit: "", mrp: "", rate: "", lowStockAt: "10" });
  const [error, setError] = useState("");

  function load() {
    api.getMedicines().then(setMedicines).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function submit() {
    try {
      await api.createMedicine({
        name: form.name, category: form.category, unit: form.unit,
        mrp: Number(form.mrp), rate: Number(form.rate), lowStockAt: Number(form.lowStockAt),
      });
      setForm({ name: "", category: "", unit: "", mrp: "", rate: "", lowStockAt: "10" });
      setShowForm(false);
      load();
    } catch (e: any) { setError(e.message); }
  }

  const canEdit = user?.role === "ADMIN";

  return (
    <div>
      <div className="page-head">
        <h1>Medicines &amp; Stock</h1>
        {canEdit && <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>+ Naya Medicine</button>}
      </div>
      {error && <div className="error-note">{error}</div>}
      {showForm && (
        <div className="card form-card">
          <div className="form-grid">
            <input placeholder="Naam" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input placeholder="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <input placeholder="MRP" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
            <input placeholder="Wholesale Rate" type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
            <input placeholder="Low stock alert" type="number" value={form.lowStockAt} onChange={(e) => setForm({ ...form, lowStockAt: e.target.value })} />
          </div>
          <button className="btn-primary" onClick={submit}>Add Medicine</button>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Unit</th><th>Rate</th><th>MRP</th><th>Total Stock</th></tr></thead>
          <tbody>
            {medicines.map((m) => {
              const stock = (m.batches || []).reduce((s: number, b: any) => s + b.quantity, 0);
              return (
                <tr key={m.id} className={stock <= m.lowStockAt ? "row-warn" : ""}>
                  <td>{m.name}</td>
                  <td>{m.category}</td>
                  <td>{m.unit}</td>
                  <td>₹{Number(m.rate).toLocaleString("en-IN")}</td>
                  <td>₹{Number(m.mrp).toLocaleString("en-IN")}</td>
                  <td>{stock}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
