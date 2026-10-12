// Top nav + bilingual toggle + breadcrumb key tag
import React from 'react';
import { KeyTag } from './door';
import { useDialogA11y } from './a11y';

function TopNav({ lang, setLang, route, goHome, seoOpen, setSeoOpen, t }) {
  const crumbMap = {
    landing: { num: "00", label: t("brand") },
    lobby: { num: "01", label: t("lobby_title") },
    info: { num: "101", label: t("door_info") },
    facilities: { num: "102", label: t("door_facilities") },
    reviews: { num: "103", label: t("door_reviews") },
    booking: { num: "104", label: t("door_booking") },
    faq: { num: "105", label: t("door_faq") },
    admin: { num: "201", label: t("door_admin") },
  };
  const crumb = crumbMap[route] || crumbMap.landing;

  return (
    <header className="topnav">
      <button type="button" className="topnav__brand" onClick={goHome} aria-label={t("brand")}>
        <div className="logo">
          <img src="/logo.jpeg" alt="" className="logo__img" />
          <div className="logo__wordmark">
            <div className="logo__word">RUMA NEKMA</div>
            <div className="logo__sub">MELAKA · HOMESTAY</div>
          </div>
        </div>
      </button>

      <div className="topnav__crumb">
        <KeyTag number={crumb.num} label={crumb.label} size={0.55} />
      </div>

      <div className="topnav__right">
        <button
          className="seo-pill"
          onClick={() => setSeoOpen(!seoOpen)}
          title="SEO / GEO / AEO"
          aria-expanded={seoOpen}
          aria-controls="seo-drawer"
        >
          <span className="seo-pill__dot" aria-hidden="true" />
          <span className="seo-pill__txt">SEO 98 · AEO · GEO</span>
        </button>
        <div className="lang-toggle" role="group" aria-label={lang === "ms" ? "Bahasa" : "Language"}>
          <button
            type="button"
            className={lang === "ms" ? "is-on" : ""}
            aria-pressed={lang === "ms"}
            onClick={() => setLang("ms")}
          >
            BM
          </button>
          <button
            type="button"
            className={lang === "en" ? "is-on" : ""}
            aria-pressed={lang === "en"}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}

// SEO/AEO/GEO drawer — visible chrome the user wanted to "show"
function SeoDrawer({ open, onClose, t }) {
  const ref = useDialogA11y(open, onClose);
  return (
    <div
      id="seo-drawer"
      ref={ref}
      className={"seodrawer" + (open ? " is-open" : "")}
      role="dialog"
      aria-modal="true"
      aria-labelledby="seo-drawer-title"
      aria-hidden={!open}
      inert={open ? undefined : ""}
    >
      <div className="seodrawer__head">
        <div className="seodrawer__title" id="seo-drawer-title">SEO · GEO · AEO health</div>
        <button type="button" className="seodrawer__close" onClick={onClose} aria-label="Close">×</button>
      </div>
      <div className="seodrawer__grid">
        <div className="seocard">
          <div className="seocard__score">98</div>
          <div className="seocard__label">Lighthouse</div>
          <div className="seocard__bar"><div style={{ width: "98%" }} /></div>
        </div>
        <div className="seocard">
          <div className="seocard__score">A+</div>
          <div className="seocard__label">Schema.org</div>
          <div className="seocard__meta">LodgingBusiness · FAQPage · Review</div>
        </div>
        <div className="seocard">
          <div className="seocard__score">2.31°N</div>
          <div className="seocard__label">Geo-tagged</div>
          <div className="seocard__meta">Melaka, MY · 102.27°E</div>
        </div>
        <div className="seocard">
          <div className="seocard__score">8</div>
          <div className="seocard__label">AEO answers indexed</div>
          <div className="seocard__meta">FAQ + AI concierge</div>
        </div>
      </div>
      <div className="seodrawer__lang">
        <div className="seodrawer__sub">hreflang declared</div>
        <code>ms-MY · en-MY</code>
      </div>
    </div>
  );
}

export { TopNav, SeoDrawer };
