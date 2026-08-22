import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Parties() {
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
      <h1>Customers &amp; Suppliers</h1>
      {error && <div className="error-note">{error}</div>}

      <div className="split">
        <div className="card">
          <h3>Customers</h3>
          <div className="form-grid">
            <input placeholder="Naam" value={custForm.name} onChange={(e) => setCustForm({ ...custForm, name: e.target.value })} />
            <input placeholder="Phone" value={custForm.phone} onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })} />
          </div>
          <button className="btn-primary" style={{ marginTop: 8 }} onClick={addCustomer}>+ Customer Jodo</button>
          <div style={{ marginTop: 12 }}>
            {customers.map((c) => <div className="list-row" key={c.id}><span>{c.name}</span><span>{c.phone}</span></div>)}
          </div>
        </div>

        <div className="card">
          <h3>Suppliers</h3>
          <div className="form-grid">
            <input placeholder="Naam" value={supForm.name} onChange={(e) => setSupForm({ ...supForm, name: e.target.value })} />
            <input placeholder="Phone" value={supForm.phone} onChange={(e) => setSupForm({ ...supForm, phone: e.target.value })} />
          </div>
          <button className="btn-primary" style={{ marginTop: 8 }} onClick={addSupplier}>+ Supplier Jodo</button>
          <div style={{ marginTop: 12 }}>
            {suppliers.map((s) => <div className="list-row" key={s.id}><span>{s.name}</span><span>{s.phone}</span></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
