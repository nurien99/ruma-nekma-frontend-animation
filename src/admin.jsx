// Admin / Owner dashboard backed by Laravel API.
import React from 'react';
import { PageEnter } from './door';
import { API_BASE } from './config';

function roleLabel(role, lang) {
  if (role === "admin") return lang === "ms" ? "Pentadbir" : "Admin";
  return lang === "ms" ? "Pemilik" : "Owner";
}

function money(value) {
  const n = Number(value || 0);
  return "RM " + n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function dateOnly(value) {
  if (!value) return "-";
  return String(value).slice(0, 10);
}

function normalizePage(payload) {
  const data = payload?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function authHeaders(staff) {
  return {
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(staff?.token ? { "Authorization": `Bearer ${staff.token}` } : {}),
  };
}

async function apiGet(path, staff) {
  const res = await fetch(API_BASE + path, {
    headers: authHeaders(staff),
    credentials: "same-origin",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    const err = new Error(json.message || "Request failed");
    err.status = res.status;
    throw err;
  }
  return json.data;
}

function EmptyState({ children }) {
  return <div className="card" style={{ padding: 24 }}>{children}</div>;
}

function AdminPage({ t, lang, staff, onSignOut }) {
  const [tab, setTab] = React.useState("overview");
  const [stats, setStats] = React.useState(null);
  const [bookings, setBookings] = React.useState([]);
  const [reviews, setReviews] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const onSignOutRef = React.useRef(onSignOut);
  React.useEffect(() => { onSignOutRef.current = onSignOut; }, [onSignOut]);

  const loadDashboard = React.useCallback(async () => {
    setLoading(true);
    setError("");

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);

    try {
      const [statsData, bookingData, reviewData, calendarData] = await Promise.all([
        apiGet("/api/owner/dashboard/stats", staff),
        apiGet("/api/owner/bookings?per_page=20&sort_by=created_at&sort_order=desc", staff),
        apiGet("/api/owner/reviews?per_page=20&sort_by=created_at&sort_order=desc", staff),
        apiGet(`/api/owner/calendar?start_date=${start}&end_date=${end}`, staff),
      ]);

      setStats(statsData);
      setBookings(normalizePage(bookingData));
      setReviews(normalizePage(reviewData));
      setEvents(calendarData?.events || []);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        onSignOutRef.current();
        return;
      }
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [staff]);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const currentMonthDays = React.useMemo(() => {
    const now = new Date();
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const event = events.find((item) => dateOnly(item.start) <= iso && dateOnly(item.end) >= iso);
      const eventType = event?.type === "block"
        ? (event.block_type === "external" ? "external" : "blocked")
        : event
          ? "direct"
          : "";
      return { day, event, eventType };
    });
  }, [events]);

  const initials = staff?.name
    ? staff.name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase()
    : "RN";

  const pendingReviews = stats?.reviews?.pending ?? reviews.filter((r) => r.status === "pending").length;

  return (
    <PageEnter keyId="admin">
      <div className="page page--admin">
        <header className="page__head page__head--admin">
          <div>
            <div className="kicker kicker--dark">S-01 - {t("door_admin")}</div>
            <h2 className="display display--md">{t("adm_h")}</h2>
          </div>
          <div className="adm__staff">
            <div className="adm__avatar">{initials}</div>
            <div>
              <div>{staff ? staff.name : "Ruma Nekma"}</div>
              <small>{roleLabel(staff?.role, lang)}</small>
            </div>
            <button className="adm__signout" onClick={onSignOut} title={t("staff_signout")}>
              {t("staff_signout")}
            </button>
          </div>
        </header>

        <div className="adm__tabs-row">
          <nav className="adm__tabs">
            {[
              ["overview", t("adm_tab_overview")],
              ["bookings", t("adm_tab_bookings")],
              ["calendar", t("adm_tab_calendar")],
              ["reviews", t("adm_tab_reviews")],
              ["ops", t("adm_tab_ops")],
            ].map(([k, l]) => (
              <button key={k} className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>
                {l}
              </button>
            ))}
          </nav>
          <button type="button" className="adm__refresh" onClick={loadDashboard} title={lang === "ms" ? "Segar semula" : "Refresh"}>
            ↻
          </button>
        </div>

        {error && <div className="staff-err">{error}</div>}
        {loading && <EmptyState>{lang === "ms" ? "Memuatkan data produksi..." : "Loading production data..."}</EmptyState>}

        {!loading && tab === "overview" && (
          <div className="adm__grid">
            <div className="kpi card">
              <div className="kpi__num">{money(stats?.revenue?.this_month)}</div>
              <div className="kpi__lbl">{lang === "ms" ? "Hasil bulan ini" : "Revenue this month"}</div>
              <div className="kpi__delta">{money(stats?.revenue?.pending)} {lang === "ms" ? "belum selesai" : "pending"}</div>
            </div>
            <div className="kpi card">
              <div className="kpi__num">{stats?.occupancy_rate ?? 0}%</div>
              <div className="kpi__lbl">{lang === "ms" ? "Penghunian bulan ini" : "Monthly occupancy"}</div>
              <div className="kpi__delta">{stats?.bookings?.today_check_ins ?? 0} {lang === "ms" ? "check-in hari ini" : "check-ins today"}</div>
            </div>
            <div className="kpi card">
              <div className="kpi__num">{stats?.bookings?.pending ?? 0}</div>
              <div className="kpi__lbl">{lang === "ms" ? "Tempahan menunggu" : "Pending bookings"}</div>
              <div className="kpi__delta">{stats?.upcoming_bookings?.length ?? 0} {lang === "ms" ? "akan datang" : "upcoming"}</div>
            </div>
            <div className="kpi card">
              <div className="kpi__num">{stats?.reviews?.average_rating ?? 0}/5</div>
              <div className="kpi__lbl">{lang === "ms" ? "Purata ulasan" : "Average rating"}</div>
              <div className="kpi__delta">{pendingReviews} {lang === "ms" ? "perlu semakan" : "to review"}</div>
            </div>

            <div className="card adm__sync">
              <div className="card__kicker">{lang === "ms" ? "Operasi hari ini" : "Today's operations"}</div>
              <div className="syncrow">
                <span className="syncrow__chan">{lang === "ms" ? "Daftar masuk" : "Check-ins"}</span>
                <span className="syncrow__time">{stats?.bookings?.today_check_ins ?? 0}</span>
                <span className="syncrow__status syncrow__status--ok">OK</span>
              </div>
              <div className="syncrow">
                <span className="syncrow__chan">{lang === "ms" ? "Daftar keluar" : "Check-outs"}</span>
                <span className="syncrow__time">{stats?.bookings?.today_check_outs ?? 0}</span>
                <span className="syncrow__status syncrow__status--ok">OK</span>
              </div>
              <div className="syncrow">
                <span className="syncrow__chan">{lang === "ms" ? "Ulasan pending" : "Pending reviews"}</span>
                <span className="syncrow__time">{pendingReviews}</span>
                <span className="syncrow__status syncrow__status--off">{pendingReviews ? "!" : "OK"}</span>
              </div>
            </div>
          </div>
        )}

        {!loading && tab === "bookings" && (
          bookings.length ? (
            <div className="card adm__table">
              <table>
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>{lang === "ms" ? "Tetamu" : "Guest"}</th>
                    <th>{lang === "ms" ? "Daftar masuk" : "Check-in"}</th>
                    <th>{lang === "ms" ? "Daftar keluar" : "Check-out"}</th>
                    <th>{lang === "ms" ? "Jumlah" : "Total"}</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id || b.booking_reference}>
                      <td><code>{b.booking_reference || `#${b.id}`}</code></td>
                      <td>{b.guest_name}</td>
                      <td>{dateOnly(b.check_in)}</td>
                      <td>{dateOnly(b.check_out)}</td>
                      <td>{money(b.total_price)}</td>
                      <td><span className={"badge badge--" + (b.status?.value || b.status)}>{b.status?.value || b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <EmptyState>{lang === "ms" ? "Belum ada tempahan dalam database." : "No bookings in the database yet."}</EmptyState>
        )}

        {!loading && tab === "calendar" && (
          <div className="card">
            <div className="cal__legend">
              <span><span className="dot dot--avail" />{t("book_legend_avail")}</span>
              <span><span className="dot dot--direct" />{lang === "ms" ? "Tempahan" : "Booking"}</span>
              <span><span className="dot dot--external" />External</span>
              <span><span className="dot dot--blocked" />{lang === "ms" ? "Disekat" : "Blocked"}</span>
            </div>
            <div className="adm__cal">
              {currentMonthDays.map(({ day, event, eventType }) => (
                <div key={day} className={"adm__caldate " + (eventType ? "adm__caldate--" + eventType : "")}>
                  <span>{day}</span>
                  {event && <em>{event.title}</em>}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tab === "reviews" && (
          reviews.length ? (
            <div className="adm__reviews">
              {reviews.map((r) => (
                <div key={r.id} className="card adm__review">
                  <div className="adm__review-head">
                    <strong>{r.display_name || r.guest_name || "Guest"}</strong>
                    <span className="stars">{Number(r.overall_rating || 0).toFixed(1)}/5</span>
                  </div>
                  <p>{r.comment}</p>
                  <div className="adm__replied">
                    {(r.status?.value || r.status) === "approved"
                      ? (lang === "ms" ? "Diluluskan" : "Approved")
                      : (lang === "ms" ? "Menunggu semakan" : "Pending review")}
                  </div>
                </div>
              ))}
            </div>
          ) : <EmptyState>{lang === "ms" ? "Belum ada ulasan dalam database." : "No reviews in the database yet."}</EmptyState>
        )}

        {!loading && tab === "ops" && (
          <div className="adm__postswrap">
            <div className="card adm__post-new">
              <div className="card__kicker">{lang === "ms" ? "Status produksi" : "Production status"}</div>
              <p>{lang === "ms"
                ? "Dashboard ini kini membaca terus dari API Laravel dan database production."
                : "This dashboard now reads directly from the Laravel API and production database."}</p>
              <p>{lang === "ms"
                ? "Pengumuman awam tidak diterbitkan dari panel ini sehingga endpoint publishing disediakan."
                : "Public announcements are not published from this panel until a publishing endpoint is enabled."}</p>
              <button className="btn btn--primary" type="button" onClick={loadDashboard}>
                {lang === "ms" ? "Semak semula data" : "Recheck data"}
              </button>
            </div>
          </div>
        )}
      </div>
    </PageEnter>
  );
}

export { AdminPage };
