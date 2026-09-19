import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useLanguage } from "../i18n/LanguageContext";

export default function Ledger() {
  const { t } = useLanguage();
  const [payments, setPayments] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getLedger().then(setPayments).catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1>{t("ledgerTitle")}</h1>
      {error && <div className="error-note">{error}</div>}

      <div className="table-wrap">
        <table>
          <thead><tr><th>{t("customer")}</th><th>{t("amount")}</th><th>{t("mode")}</th><th>{t("billTotal")}</th><th>{t("date")}</th></tr></thead>
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
