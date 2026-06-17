// Door component + key tag + opening animation primitives.
// All doors share the same primitive geometry; `variant` swaps panel detail.

import React, { useState, useEffect } from 'react';

// --- Brass key tag (used as breadcrumb chip + on doors) -----------------
function KeyTag({ number, label, size = 1, swinging = false }) {
  const w = 180 * size;
  const h = 96 * size;
  return (
    <div
      className={"keytag" + (swinging ? " keytag--swinging" : "")}
      style={{ width: w, height: h }}
    >
      <div className="keytag__ring" />
      <div className="keytag__plate">
        <div className="keytag__num">{number}</div>
        <div className="keytag__lbl">{label}</div>
      </div>
    </div>
  );
}

// --- Door panel (decorative). Carved / modern / glass variants ---------
function DoorPanel({ variant = "carved", number = "01" }) {
  if (variant === "modern") {
    return (
      <div className="doorpanel doorpanel--modern">
        <div className="doorpanel__num">{number}</div>
        <div className="doorpanel__line" />
        <div className="doorpanel__line" />
      </div>
    );
  }
  if (variant === "glass") {
    return (
      <div className="doorpanel doorpanel--glass">
        <div className="doorpanel__glass" />
        <div className="doorpanel__num doorpanel__num--glass">{number}</div>
      </div>
    );
  }
  // carved (Melayu motif – just framed rectangles, no fancy SVG)
  return (
    <div className="doorpanel doorpanel--carved">
      <div className="doorpanel__num">{number}</div>
      <div className="doorpanel__frame">
        <div className="doorpanel__inner" />
        <div className="doorpanel__diamond" />
      </div>
      <div className="doorpanel__frame">
        <div className="doorpanel__inner" />
        <div className="doorpanel__diamond" />
      </div>
    </div>
  );
}

// --- A single openable door --------------------------------------------
// Props: number, label, variant, size ('hero'|'lobby'|'inline'),
//        open (bool), onClick, peek (image url shown through doorway when open)
function Door({
  number,
  label,
  sublabel,
  variant = "carved",
  size = "lobby",
  open = false,
  onClick,
  peekColor = "var(--rn-peek)",
  motion = 1,
  disabled = false,
}) {
  const dims =
    size === "hero" ? { w: 280, h: 480 } :
    size === "inline" ? { w: 120, h: 200 } :
    { w: 200, h: 340 };

  const swing = open ? -78 * motion : 0;
  return (
    <div
      className={"door door--" + size + (open ? " door--open" : "") + (disabled ? " door--disabled" : "")}
      style={{ width: dims.w, height: dims.h }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Doorway / cavity revealed when open */}
      <div className="door__cavity" style={{ background: peekColor }}>
        <div className="door__cavity-light" />
      </div>

      {/* Frame trim around opening */}
      <div className="door__frame" />

      {/* The actual swinging panel */}
      <div
        className="door__panel"
        style={{
          transform: `rotateY(${swing}deg)`,
          transition: `transform ${1.1 / motion}s cubic-bezier(.6,.05,.2,1)`,
        }}
      >
        <DoorPanel variant={variant} number={number} />
        <div className="door__handle" />
        <div className="door__handle-shadow" />
      </div>

      {/* Floor mat / label below */}
      {(label || sublabel) && (
        <div className="door__mat">
          {sublabel && <div className="door__sublabel">{sublabel}</div>}
          {label && <div className="door__label">{label}</div>}
        </div>
      )}
    </div>
  );
}

// --- Page transition shell ---------------------------------------------
// Wraps page content, plays a "stepping through doorway" intro
function PageEnter({ children, keyId }) {
  const [stage, setStage] = useState(0); // 0 doorway tight, 1 wide, 2 normal
  useEffect(() => {
    setStage(0);
    const t1 = setTimeout(() => setStage(1), 50);
    const t2 = setTimeout(() => setStage(2), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [keyId]);
  return (
    <div className={"pageenter pageenter--s" + stage}>
      <div className="pageenter__vignette" />
      {children}
    </div>
  );
}

export { KeyTag, DoorPanel, Door, PageEnter };
