import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

export default function Login() {
  const { login } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/medicines");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="login-brand">{t("brand")}</div>

        <div className="login-lang-picker">
          <div className="login-lang-label">{t("chooseLanguage")}</div>
          <div className="lang-switch large">
            <button type="button" className={lang === "en" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("en")}>English</button>
            <button type="button" className={lang === "hi" ? "lang-btn active" : "lang-btn"} onClick={() => setLang("hi")}>हिंदी</button>
          </div>
        </div>

        <p className="login-sub">{t("loginSubtitle")}</p>
        <label>{t("emailLabel")}</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>{t("passwordLabel")}</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <div className="error-note">{error}</div>}
        <button className="btn-primary full" disabled={loading}>{loading ? t("loggingIn") : t("loginButton")}</button>
        <div className="login-note">{t("firstLoginNote")}</div>
      </form>
    </div>
  );
}
