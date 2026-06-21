// Staff login: production auth via Laravel Sanctum.
import React from 'react';
import { API_BASE } from './config';

const STAFF_KEY = "rn_staff_auth_v1";
const ALLOWED_ROLES = new Set(["owner", "admin"]);

function roleValue(role) {
  if (!role) return "";
  if (typeof role === "string") return role;
  return role.value || role.name || "";
}

// window.RN_STAFF is kept as a runtime auth object (accessible globally)
window.RN_STAFF = {
  read() {
    try {
      const raw = localStorage.getItem(STAFF_KEY);
      if (!raw) return null;
      const v = JSON.parse(raw);
      return v && v.email ? v : null;
    } catch (e) {
      return null;
    }
  },
  write(v) {
    localStorage.setItem(STAFF_KEY, JSON.stringify(v));
  },
  clear() {
    localStorage.removeItem(STAFF_KEY);
  },
};

function StaffIntercom({ t, onTrigger, authed }) {
  return (
    <button
      type="button"
      className={"intercom" + (authed ? " intercom--on" : "")}
      onClick={onTrigger}
      aria-label={t("staff_intercom")}
      title={t("staff_intercom")}
    >
      <span className="intercom__grille">
        <span></span><span></span><span></span><span></span><span></span>
      </span>
      <span className="intercom__btn">
        <span className="intercom__led" />
      </span>
      <span className="intercom__label">STAFF</span>
    </button>
  );
}

function StaffLoginModal({ open, onClose, onAuth, t }) {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setEmail("");
      setPass("");
      setErr("");
    }
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: pass,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        throw new Error(json.message || t("staff_wrong"));
      }

      const user = json.data?.user;
      const role = roleValue(user?.role);

      if (!user || !ALLOWED_ROLES.has(role)) {
        throw new Error(t("staff_denied"));
      }

      const staff = {
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role,
        at: Date.now(),
      };

      window.RN_STAFF.write(staff);
      onAuth(staff);
    } catch (error) {
      setErr(error.message || t("staff_wrong"));
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={t("staff_login_title")}>
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__card">
        <div className="modal__keypad">
          <div className="keypad__screen">
            <span className="keypad__dot" />
            <span className="keypad__dot" />
            <span className="keypad__dot" />
            <span className="keypad__dot" />
          </div>
        </div>

        <div className="kicker">{t("staff_intercom")}</div>
        <h3 className="display display--xs">{t("staff_login_title")}</h3>
        <p className="lede lede--sm">{t("staff_login_sub")}</p>

        <form onSubmit={submit} className="staff-form">
          <label className="field">
            <span>{t("staff_email")}</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@rumanekma.com"
            />
          </label>
          <label className="field">
            <span>{t("staff_password")}</span>
            <input
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              placeholder="Password"
            />
          </label>

          {err && <div className="staff-err">{err}</div>}

          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? t("staff_signing_in") : t("staff_signin")}
          </button>

          <p className="staff-hint">{t("staff_access_hint")}</p>
        </form>

        <button type="button" className="modal__close" onClick={onClose} aria-label="Close">x</button>
      </div>
    </div>
  );
}

export { StaffIntercom, StaffLoginModal };
