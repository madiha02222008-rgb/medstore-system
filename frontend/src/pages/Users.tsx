import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";

export default function Users() {
  const { t } = useLanguage();
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
      setMsg(t("userCreated"));
      setTimeout(() => setMsg(""), 3000);
      load();
    } catch (e: any) { setError(e.message); }
  }

  async function toggleActive(u: any) {
    try {
      if (u.isActive) {
        if (!window.confirm(t("confirmDeactivate"))) return;
        await api.deactivateUser(u.id);
      } else {
        await api.reactivateUser(u.id);
      }
      load();
    } catch (e: any) { setError(e.message); }
  }

  const roleLabels: Record<string, string> = {
    ADMIN: t("roleAdmin"),
    STAFF: t("roleStaff"),
    RETAILER: t("roleRetailer"),
    ACCOUNTANT: t("roleAccountant"),
  };

  return (
    <div>
      <div className="page-head">
        <h1>{t("usersTitle")}</h1>
        <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>{t("newUser")}</button>
      </div>
      {error && <div className="error-note">{error}</div>}
      {msg && <div className="success-note">{msg}</div>}

      {showForm && (
        <div className="card form-card">
          <div className="form-grid">
            <input placeholder={t("name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder={t("emailLabel")} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input placeholder={t("passwordLabel")} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="STAFF">{t("roleStaff")}</option>
              <option value="RETAILER">{t("roleRetailer")}</option>
              <option value="ACCOUNTANT">{t("roleAccountant")}</option>
              <option value="ADMIN">{t("roleAdmin")}</option>
            </select>
          </div>
          <button className="btn-primary" onClick={submit}>{t("createUserButton")}</button>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t("name")}</th><th>{t("emailLabel")}</th><th>{t("role")}</th>
              <th>{t("status")}</th><th>{t("created")}</th><th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{roleLabels[u.role] || u.role}</td>
                <td className={u.isActive ? "good" : "bad"}>{u.isActive ? t("active") : t("inactive")}</td>
                <td>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                <td>
                  <button
                    className={u.isActive ? "btn-secondary small" : "btn-primary small"}
                    onClick={() => toggleActive(u)}
                  >
                    {u.isActive ? t("deactivate") : t("reactivate")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
