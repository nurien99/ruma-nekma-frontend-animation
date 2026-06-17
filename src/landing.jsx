// Landing page – porch view, doorbell button, opening animation
import React from 'react';
import { Door } from './door';

function LandingPage({ t, lang, doorVariant, motion, onEnter }) {
  const [ringing, setRinging] = React.useState(false);
  const [opening, setOpening] = React.useState(false);

  const ring = () => {
    if (ringing || opening) return;
    setRinging(true);
    setTimeout(() => {
      setOpening(true);
      setRinging(false);
    }, 700);
    setTimeout(() => {
      onEnter();
    }, 700 + 1400 / motion);
  };

  return (
    <div className="landing">
      <div className="landing__porch">
        <div className="landing__sky" />
        <div className="landing__floor" />
        <div className="landing__ceiling" />

        <div className="landing__copy">
          <div className="kicker">{t("landing_kicker")}</div>
          <h1 className="display">{t("landing_title")}</h1>
          <p className="lede">{t("landing_sub")}</p>
          <div className="landing__meta">
            <span><b>{t("unit_no")}</b> D-07-12</span>
            <span><b>{t("block")}</b> D</span>
            <span><b>{t("floor")}</b> 7</span>
          </div>
        </div>

        <div className="landing__door-wrap">
          <Door
            number="D-07-12"
            variant={doorVariant}
            size="hero"
            open={opening}
            motion={motion}
            disabled={ringing || opening}
            onClick={ring}
            peekColor="linear-gradient(180deg,#e8d8b8 0%,#d6bf95 60%,#b89b6c 100%)"
          />
          <button
            className={"doorbell" + (ringing ? " is-ringing" : "")}
            onClick={ring}
            disabled={ringing || opening}
          >
            <span className="doorbell__ring">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </span>
            <span className="doorbell__btn">
              <span className="doorbell__inner" />
            </span>
            <span className="doorbell__lbl">
              {ringing ? t("unlocking") : t("ring_bell")}
            </span>
          </button>
        </div>

        {/* Welcome mat */}
        <div className="landing__mat">
          <div className="landing__mat-inner">WELCOME · SELAMAT DATANG</div>
        </div>

        {/* Apartment number plate */}
        <div className="landing__plate">
          <div className="landing__plate-num">D-07-12</div>
          <div className="landing__plate-lbl">RUMA NEKMA</div>
        </div>
      </div>
    </div>
  );
}

export { LandingPage };
