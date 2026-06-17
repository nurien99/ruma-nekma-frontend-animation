// Booking page: calendar, guest details, and ToyyibPay handoff.
import React from 'react';
import { PageEnter } from './door';
import { RN_I18N } from './i18n';

const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

const MONTH_NAMES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_NAMES_MS = ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"];
const DAY_LABELS_EN = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_LABELS_MS = ["A", "I", "S", "R", "K", "J", "S"];

const fmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const nightsBetween = (a, b) => Math.round((b - a) / 86400000);

const displayDate = (d, lang) => {
  if (!d) return "-";
  return new Intl.DateTimeFormat(lang === "ms" ? "ms-MY" : "en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

function MonthGrid({ month, year, lang, availability, availabilityLoaded, selectStart, selectEnd, onPick }) {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const inRange = (d) => {
    if (!d || !selectStart) return false;
    if (!selectEnd) return fmt(d) === fmt(selectStart);
    return d >= selectStart && d <= selectEnd;
  };

  return (
    <div className="cal">
      <div className="cal__head">
        <div className="cal__month">{(lang === "ms" ? MONTH_NAMES_MS : MONTH_NAMES_EN)[month]} {year}</div>
      </div>
      <div className="cal__weekdays">
        {(lang === "ms" ? DAY_LABELS_MS : DAY_LABELS_EN).map((d, i) => <span key={i}>{d}</span>)}
      </div>
      <div className="cal__grid">
        {cells.map((d, i) => {
          if (!d) return <span key={i} className="cal__cell cal__cell--empty" />;

          const k = fmt(d);
          const status = availability[k];
          const isPast = d < TODAY;
          const isSel = inRange(d);
          const isStart = selectStart && fmt(selectStart) === k;
          const isEnd = selectEnd && fmt(selectEnd) === k;
          const cls = ["cal__cell"];

          if (status) cls.push("cal__cell--" + status);
          if (isPast) cls.push("cal__cell--past");
          if (isSel) cls.push("cal__cell--sel");
          if (isStart) cls.push("cal__cell--start");
          if (isEnd) cls.push("cal__cell--end");

          return (
            <button
              key={i}
              type="button"
              className={cls.join(" ")}
              disabled={isPast || !availabilityLoaded || !!status}
              onClick={() => onPick(d)}
              aria-label={displayDate(d, lang)}
            >
              <span className="cal__num">{d.getDate()}</span>
              {status && <span className="cal__dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BookingPage({ t, lang }) {
  const monthOne = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  const monthTwo = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 1);
  const calendarEnd = new Date(TODAY.getFullYear(), TODAY.getMonth() + 2, 0);

  const [availability, setAvailability] = React.useState({});
  const [availabilityLoaded, setAvailabilityLoaded] = React.useState(false);
  const [selectStart, setSelectStart] = React.useState(null);
  const [selectEnd, setSelectEnd] = React.useState(null);
  const [guests, setGuests] = React.useState(4);
  const [paying, setPaying] = React.useState(false);
  const [guest, setGuest] = React.useState({ name: "", email: "", phone: "", notes: "" });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;

    const loadAvailability = async () => {
      try {
        const res = await fetch(`/api/bookings/availability?start=${fmt(monthOne)}&end=${fmt(calendarEnd)}`, {
          headers: { "Accept": "application/json" },
        });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Availability could not be loaded");
        }

        if (cancelled) return;

        const nextAvailability = {};
        (json.data || []).forEach(({ date, status }) => {
          if (date && status) nextAvailability[date] = status;
        });
        setAvailability(nextAvailability);
        setAvailabilityLoaded(true);
      } catch (err) {
        if (!cancelled) {
          setAvailabilityLoaded(false);
          setError(lang === "ms"
            ? "Kalendar tidak dapat dimuatkan. Sila cuba semula."
            : "Calendar availability could not be loaded. Please try again.");
        }
      }
    };

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, []);

  const rangeHasConflict = (start, end) => {
    for (let d = new Date(start); d < end; d = addDays(d, 1)) {
      if (availability[fmt(d)]) return true;
    }
    return false;
  };

  const pick = (d) => {
    if (!selectStart || (selectStart && selectEnd)) {
      setError("");
      setSelectStart(d);
      setSelectEnd(null);
    } else if (d > selectStart) {
      if (rangeHasConflict(selectStart, d)) {
        setError(lang === "ms"
          ? "Julat tarikh itu bertembung dengan tempahan lain."
          : "That date range overlaps another booking.");
        return;
      }
      setError("");
      setSelectEnd(d);
    } else {
      setError("");
      setSelectStart(d);
      setSelectEnd(null);
    }
  };

  const nights = selectStart && selectEnd ? nightsBetween(selectStart, selectEnd) : 0;
  const rate = 380;
  const subtotal = nights * rate;
  const cleaning = nights ? 80 : 0;
  const total = subtotal + cleaning;

  const pay = async () => {
    if (!nights || paying) return;
    if (!availabilityLoaded) {
      setError(lang === "ms"
        ? "Kalendar belum dimuatkan. Sila cuba semula."
        : "Calendar availability is not loaded yet. Please try again.");
      return;
    }
    if (rangeHasConflict(selectStart, selectEnd)) {
      setError(lang === "ms"
        ? "Julat tarikh itu bertembung dengan tempahan lain."
        : "That date range overlaps another booking.");
      return;
    }
    if (!guest.name.trim() || !guest.email.trim() || !guest.phone.trim()) {
      setError(lang === "ms" ? "Sila isi nama, emel dan nombor telefon." : "Please enter your name, email and phone.");
      return;
    }

    setPaying(true);
    setError("");

    try {
      const bookingRes = await fetch("/api/bookings/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          guest_name: guest.name,
          guest_email: guest.email,
          guest_phone: guest.phone,
          number_of_guests: guests,
          check_in: fmt(selectStart),
          check_out: fmt(selectEnd),
          special_requests: guest.notes || null,
        }),
      });

      const bookingJson = await bookingRes.json();
      if (!bookingRes.ok || !bookingJson.success) {
        throw new Error(bookingJson.message || "Booking failed");
      }

      const paymentRes = await fetch("/api/payments/create-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          booking_reference: bookingJson.data.booking_reference,
          guest_email: guest.email,
        }),
      });

      const paymentJson = await paymentRes.json();
      if (!paymentRes.ok || !paymentJson.success) {
        throw new Error(paymentJson.message || "Payment could not be created");
      }

      window.location.href = paymentJson.data.payment_url;
    } catch (err) {
      setError(err.message || (lang === "ms" ? "Tempahan gagal. Sila cuba lagi." : "Booking failed. Please try again."));
      setPaying(false);
    }
  };

  return (
    <PageEnter keyId="booking">
      <div className="page page--booking">
        <header className="page__head">
          <div className="kicker">104 - {t("door_booking")}</div>
          <h2 className="display display--md">{t("book_h")}</h2>
          <p className="lede">{t("book_sub")}</p>
        </header>

        <div className="book__grid">
          <div className="book__cal card">
            <div className="cal__legend">
              <span><span className="dot dot--avail" />{t("book_legend_avail")}</span>
              <span><span className="dot dot--direct" />{t("book_legend_booked")}</span>
              <span><span className="dot dot--external" />{t("book_legend_external")}</span>
              <span><span className="dot dot--blocked" />{t("book_legend_blocked")}</span>
            </div>
            <div className="book__months">
              <MonthGrid month={monthOne.getMonth()} year={monthOne.getFullYear()} lang={lang} availability={availability} availabilityLoaded={availabilityLoaded} selectStart={selectStart} selectEnd={selectEnd} onPick={pick} />
              <MonthGrid month={monthTwo.getMonth()} year={monthTwo.getFullYear()} lang={lang} availability={availability} availabilityLoaded={availabilityLoaded} selectStart={selectStart} selectEnd={selectEnd} onPick={pick} />
            </div>
          </div>

          <aside className="book__side card">
            <div className="card__kicker">{t("book_summary")}</div>
            <div className="book__dates">
              <div>
                <span>{t("book_checkin")}</span>
                <strong>{displayDate(selectStart, lang)}</strong>
              </div>
              <div className="book__arrow">-&gt;</div>
              <div>
                <span>{t("book_checkout")}</span>
                <strong>{displayDate(selectEnd, lang)}</strong>
              </div>
            </div>

            <label className="book__guests">
              <span>{t("book_guests")}</span>
              <div className="qty">
                <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}>-</button>
                <span>{guests}</span>
                <button type="button" onClick={() => setGuests(Math.min(8, guests + 1))}>+</button>
              </div>
            </label>

            <div className="book__section-title">{lang === "ms" ? "Maklumat tetamu" : "Guest details"}</div>
            <div className="book__form">
              <label className="book__field">
                <span>{lang === "ms" ? "Nama penuh" : "Full name"}</span>
                <input
                  type="text"
                  value={guest.name}
                  onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                  autoComplete="name"
                  placeholder={lang === "ms" ? "Nama seperti dalam IC/pasport" : "Name as shown on ID/passport"}
                />
              </label>
              <label className="book__field">
                <span>{lang === "ms" ? "Emel" : "Email"}</span>
                <input
                  type="email"
                  value={guest.email}
                  onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                  autoComplete="email"
                  placeholder="name@example.com"
                />
              </label>
              <label className="book__field">
                <span>{lang === "ms" ? "Telefon" : "Phone"}</span>
                <input
                  type="tel"
                  value={guest.phone}
                  onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
                  autoComplete="tel"
                  placeholder="+60"
                />
              </label>
              <label className="book__field">
                <span>{lang === "ms" ? "Permintaan khas" : "Special requests"}</span>
                <textarea
                  rows={3}
                  value={guest.notes}
                  onChange={(e) => setGuest({ ...guest, notes: e.target.value })}
                  placeholder={lang === "ms" ? "Masa tiba, keperluan keluarga, atau nota lain" : "Arrival time, family needs, or other notes"}
                />
              </label>
            </div>

            <div className="book__lines">
              <div className="book__line">
                <span>RM {rate} {t("book_per_night")} x {lang === "ms" ? RN_I18N.book_nights_ms(nights) : RN_I18N.book_nights_en(nights)}</span>
                <strong>RM {subtotal.toFixed(2)}</strong>
              </div>
              <div className="book__line">
                <span>{t("book_cleaning")}</span>
                <strong>RM {cleaning.toFixed(2)}</strong>
              </div>
              <div className="book__line book__line--total">
                <span>{t("book_total")}</span>
                <strong>RM {total.toFixed(2)}</strong>
              </div>
            </div>

            <button
              className="btn btn--primary btn--xl"
              disabled={!availabilityLoaded || !nights || paying}
              onClick={pay}
            >
              {paying
                ? (lang === "ms" ? "Mengalihkan ke ToyyibPay..." : "Redirecting to ToyyibPay...")
                : nights
                  ? t("book_pay")
                  : (lang === "ms" ? "Pilih tarikh dahulu" : "Select dates first")}
            </button>
            {error && <div className="staff-err">{error}</div>}
            <div className="book__trust">
              <span>SSL - ToyyibPay - FPX</span>
              <span>{lang === "ms" ? "Kalendar disemak sebelum bayaran" : "Calendar checked before payment"}</span>
            </div>
          </aside>
        </div>
      </div>
    </PageEnter>
  );
}

export { BookingPage };
