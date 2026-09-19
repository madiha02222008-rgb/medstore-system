import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function Medicines() {
  const { user } = useAuth();
  const { t } = useLanguage();
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
        <h1>{t("medicinesTitle")}</h1>
        {canEdit && <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>{t("newMedicine")}</button>}
      </div>
      {error && <div className="error-note">{error}</div>}
      {showForm && (
        <div className="card form-card">
          <div className="form-grid">
            <input placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder={t("category")} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input placeholder={t("unit")} value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <input placeholder={t("mrp")} type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} />
            <input placeholder={t("wholesaleRate")} type="number" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
            <input placeholder={t("lowStockAlert")} type="number" value={form.lowStockAt} onChange={(e) => setForm({ ...form, lowStockAt: e.target.value })} />
          </div>
          <button className="btn-primary" onClick={submit}>{t("addMedicine")}</button>
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>{t("name")}</th><th>{t("category")}</th><th>{t("unit")}</th><th>{t("purchaseRate")}</th><th>{t("mrp")}</th><th>{t("currentStock")}</th></tr></thead>
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
