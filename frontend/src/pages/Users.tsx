import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  function load() {
    api.listUsers().then(setUsers).catch((e) => setError(e.message));
  }
  useEffect(load, []);

  async function submit() {
    try {
      await api.createUser(form);
      setForm({ name: "", email: "", password: "", role: "STAFF" });
      setShowForm(false);
      setMsg("Naya user ban gaya!");
      setTimeout(() => setMsg(""), 3000);
      load();
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div>
      <div className="page-head">
        <h1>Users</h1>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>+ Naya User</button>
      </div>
      {error && <div className="error-note">{error}</div>}
      {msg && <div className="success-note">{msg}</div>}

      {showForm && (
        <div className="card form-card">
          <div className="form-grid">
            <input placeholder="Naam" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="STAFF">Staff / Salesman</option>
              <option value="RETAILER">Retailer / Customer</option>
              <option value="ACCOUNTANT">Accountant</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button className="btn-primary" onClick={submit}>User Banao</button>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Naam</th><th>Email</th><th>Role</th><th>Status</th><th>Bana</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? "Active" : "Inactive"}</td>
                <td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
