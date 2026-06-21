// Main App — routing + Tweaks
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

const ROUTE_PATHS = {
  landing: '/',
  lobby: '/',
  info: '/info',
  facilities: '/facilities',
  reviews: '/reviews',
  booking: '/booking',
  faq: '/faq',
  admin: '/admin',
};

function pathToRoute(path) {
  const clean = path.replace(/\/$/, '') || '/';
  const map = {
    '/': 'lobby',
    '/info': 'info',
    '/facilities': 'facilities',
    '/reviews': 'reviews',
    '/booking': 'booking',
    '/faq': 'faq',
    '/admin': 'admin',
  };
  return map[clean] ?? 'lobby';
}
import './app.css';

import { RN_T } from './i18n';
import { API_BASE, TWEAKS_ENABLED } from './config';
import './image-slot';

import { useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider, TweakToggle, TweakRadio, TweakSelect } from './tweaks-panel';
import { Door, PageEnter } from './door';
import { TopNav, SeoDrawer } from './nav';
import { StaffIntercom, StaffLoginModal } from './staff-login';
import { LandingPage } from './landing';
import { LobbyPage } from './lobby';
import { InfoPage } from './info';
import { FacilitiesPage } from './facilities';
import { ReviewsPage } from './reviews';
import { BookingPage } from './booking';
import { FaqPage } from './faq';
import { AdminPage } from './admin';

function App() {
  const [tw, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "doorVariant": "carved",
    "wall": "cream",
    "accent": "blue",
    "motion": 1
  }/*EDITMODE-END*/);

  const [lang, setLang] = useState("ms");
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    // Root path → show landing splash on first load; deep links go directly to their page
    return path === '/' ? 'landing' : pathToRoute(path);
  });
  const [seoOpen, setSeoOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [staff, setStaff] = useState(() => (window.RN_STAFF ? window.RN_STAFF.read() : null));
  const [staffOpen, setStaffOpen] = useState(false);

  const onAuth = (user) => {
    setStaff(user);
    setStaffOpen(false);
  };
  const onSignOut = () => {
    fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "same-origin",
    }).catch(() => {});
    if (window.RN_STAFF) window.RN_STAFF.clear();
    setStaff(null);
    if (route === "admin") navigate("lobby");
  };

  // Apply CSS vars from tweaks
  useEffect(() => {
    const r = document.documentElement;
    const wallMap = {
      cream: { wall: "#f3ead7", wall2: "#e6d8b8", wallTone: "#c8b48a" },
      mint: { wall: "#e2efe5", wall2: "#c5dccd", wallTone: "#9bc3a8" },
      slate: { wall: "#e3e7ed", wall2: "#cbd2dc", wallTone: "#9da7b6" },
      dark: { wall: "#1d2436", wall2: "#141a28", wallTone: "#0c1019" },
    };
    const accentMap = {
      blue: { primary: "oklch(0.32 0.10 250)", accent: "oklch(0.60 0.14 240)" },
      navy: { primary: "oklch(0.24 0.09 255)", accent: "oklch(0.52 0.16 240)" },
      teal: { primary: "oklch(0.32 0.08 220)", accent: "oklch(0.62 0.12 215)" },
    };
    const w = wallMap[tw.wall] || wallMap.cream;
    const a = accentMap[tw.accent] || accentMap.blue;
    r.style.setProperty("--rn-wall", w.wall);
    r.style.setProperty("--rn-wall-2", w.wall2);
    r.style.setProperty("--rn-wall-tone", w.wallTone);
    r.style.setProperty("--rn-primary", a.primary);
    r.style.setProperty("--rn-accent", a.accent);
    r.style.setProperty("--rn-text", tw.wall === "dark" ? "#f3ead7" : "oklch(0.18 0.02 250)");
  }, [tw.wall, tw.accent]);

  const navigate = useCallback((r) => {
    if (r === route) return;
    const path = ROUTE_PATHS[r] ?? '/';
    window.history.pushState({ route: r }, '', path);
    setTransitioning(true);
    setTimeout(() => {
      setRoute(r);
      setTransitioning(false);
    }, 200);
  }, [route]);

  const goHome = () => navigate("landing");
  const enterFromLanding = () => navigate("lobby");

  const t = (key) => RN_T(key, lang);

  // Update document lang
  useEffect(() => {
    document.documentElement.lang = lang === "ms" ? "ms-MY" : "en-MY";
  }, [lang]);

  // Seed initial history state so the first popstate has a state object
  useEffect(() => {
    window.history.replaceState({ route }, '', ROUTE_PATHS[route] ?? '/');
  }, []);

  // Browser back/forward
  useEffect(() => {
    const onPop = (e) => {
      const r = e.state?.route ?? pathToRoute(window.location.pathname);
      setRoute(r);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  let body = null;
  if (route === "landing") {
    body = <LandingPage t={t} lang={lang} doorVariant={tw.doorVariant} motion={tw.motion} onEnter={enterFromLanding} />;
  } else if (route === "lobby") {
    body = <LobbyPage t={t} lang={lang} doorVariant={tw.doorVariant} motion={tw.motion} navigate={navigate} staff={staff} onIntercom={() => setStaffOpen(true)} />;
  } else if (route === "info") {
    body = <InfoPage t={t} lang={lang} />;
  } else if (route === "facilities") {
    body = <FacilitiesPage t={t} lang={lang} />;
  } else if (route === "reviews") {
    body = <ReviewsPage t={t} lang={lang} />;
  } else if (route === "booking") {
    body = <BookingPage t={t} lang={lang} />;
  } else if (route === "faq") {
    body = <FaqPage t={t} lang={lang} />;
  } else if (route === "admin") {
    body = staff
      ? <AdminPage t={t} lang={lang} staff={staff} onSignOut={onSignOut} />
      : <LobbyPage t={t} lang={lang} doorVariant={tw.doorVariant} motion={tw.motion} navigate={navigate} staff={staff} onIntercom={() => setStaffOpen(true)} />;
  }

  // Guard: if user clicks staff door but isn't authed, redirect back to lobby + open intercom
  useEffect(() => {
    if (route === "admin" && !staff) {
      setRoute("lobby");
      setStaffOpen(true);
    }
  }, [route, staff]);

  // Sub-page back-to-lobby button
  const showBack = !["landing", "lobby"].includes(route);

  return (
    <div className={"app app--wall-" + tw.wall + " app--accent-" + tw.accent}>
      <TopNav
        lang={lang}
        setLang={setLang}
        route={route}
        goHome={goHome}
        seoOpen={seoOpen}
        setSeoOpen={setSeoOpen}
        t={t}
      />
      <SeoDrawer open={seoOpen} onClose={() => setSeoOpen(false)} t={t} />
      <StaffLoginModal open={staffOpen} onClose={() => setStaffOpen(false)} onAuth={onAuth} t={t} />

      {/* Door-transition overlay between pages */}
      <div className={"transition" + (transitioning ? " is-on" : "")}>
        <div className="transition__l" />
        <div className="transition__r" />
      </div>

      <main className={"main" + (route === "landing" ? " main--landing" : route === "lobby" ? " main--lobby" : " main--page")}>
        {body}
        {showBack && (
          <button className="back-btn" onClick={() => navigate("lobby")}>
            ← {t("back_to_lobby")}
          </button>
        )}
      </main>

      {/* Tweaks panel — dev only */}
      {TWEAKS_ENABLED && <TweaksPanel title="Tweaks">
        <TweakSection label="Door style">
          <TweakRadio
            label="Variant"
            value={tw.doorVariant}
            onChange={(v) => setTweak("doorVariant", v)}
            options={[
              { label: "Carved", value: "carved" },
              { label: "Modern", value: "modern" },
              { label: "Glass", value: "glass" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Wall treatment">
          <TweakSelect
            label="Wall"
            value={tw.wall}
            onChange={(v) => setTweak("wall", v)}
            options={[
              { label: "Cream", value: "cream" },
              { label: "Mint", value: "mint" },
              { label: "Slate", value: "slate" },
              { label: "Dark", value: "dark" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Accent">
          <TweakRadio
            label="Color"
            value={tw.accent}
            onChange={(v) => setTweak("accent", v)}
            options={[
              { label: "Blue", value: "blue" },
              { label: "Navy", value: "navy" },
              { label: "Teal", value: "teal" },
            ]}
          />
        </TweakSection>
        <TweakSection label="Motion">
          <TweakSlider
            label="Intensity"
            value={tw.motion}
            min={0.5}
            max={2}
            step={0.1}
            onChange={(v) => setTweak("motion", v)}
          />
        </TweakSection>
      </TweaksPanel>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
