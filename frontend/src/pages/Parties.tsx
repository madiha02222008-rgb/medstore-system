import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";

export default function Parties() {
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [custForm, setCustForm] = useState({ name: "", phone: "" });
  const [supForm, setSupForm] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");

  function load() {
    api.getCustomers().then(setCustomers).catch((e) => setError(e.message));
    api.getSuppliers().then(setSuppliers).catch(() => {});
  }
  useEffect(load, []);

  async function addCustomer() {
    if (!custForm.name) return;
    await api.createCustomer(custForm);
    setCustForm({ name: "", phone: "" });
    load();
  }

  async function addSupplier() {
    if (!supForm.name) return;
    await api.createSupplier(supForm);
    setSupForm({ name: "", phone: "" });
    load();
  }

  return (
    <div>
      <h1>{t("partiesTitle")}</h1>
      {error && <div className="error-note">{error}</div>}

      <div className="split">
        <div className="card">
          <h3>{t("customers")}</h3>
          <div className="form-grid">
            <input placeholder={t("name")} value={custForm.name} onChange={(e) => setCustForm({ ...custForm, name: e.target.value })} />
            <input placeholder={t("phone")} value={custForm.phone} onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })} />
          </div>
          <button className="btn-primary" style={{ marginTop: 8 }} onClick={addCustomer}>+ {t("addCustomer")}</button>
          <div style={{ marginTop: 12 }}>
            {customers.map((c) => <div className="list-row" key={c.id}><span>{c.name}</span><span>{c.phone}</span></div>)}
          </div>
        </div>

        <div className="card">
          <h3>{t("suppliers")}</h3>
          <div className="form-grid">
            <input placeholder={t("name")} value={supForm.name} onChange={(e) => setSupForm({ ...supForm, name: e.target.value })} />
            <input placeholder={t("phone")} value={supForm.phone} onChange={(e) => setSupForm({ ...supForm, phone: e.target.value })} />
          </div>
          <button className="btn-primary" style={{ marginTop: 8 }} onClick={addSupplier}>+ {t("addSupplier")}</button>
          <div style={{ marginTop: 12 }}>
            {suppliers.map((s) => <div className="list-row" key={s.id}><span>{s.name}</span><span>{s.phone}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
