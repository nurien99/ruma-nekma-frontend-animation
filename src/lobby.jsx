// Lobby — corridor of doors, each leads to an inner page
import React from 'react';
import { Door, PageEnter } from './door';
import { StaffIntercom } from './staff-login';

function LobbyPage({ t, lang, doorVariant, motion, navigate, staff, onIntercom }) {
  const [openingKey, setOpeningKey] = React.useState(null);

  const guestDoors = [
    { id: "info", num: "101", label: t("door_info"), peek: "linear-gradient(180deg,#fef6e0,#e8d3a3)" },
    { id: "facilities", num: "102", label: t("door_facilities"), peek: "linear-gradient(180deg,#dceaf6,#a5c7e6)" },
    { id: "reviews", num: "103", label: t("door_reviews"), peek: "linear-gradient(180deg,#f3e6dd,#d9b69b)" },
    { id: "booking", num: "104", label: t("door_booking"), peek: "linear-gradient(180deg,#e2ecdc,#a8c1a4)" },
    { id: "faq", num: "105", label: t("door_faq"), peek: "linear-gradient(180deg,#ede4f3,#c8b6dc)" },
  ];
  const staffDoor = { id: "admin", num: "S-01", label: t("door_admin"), peek: "linear-gradient(180deg,#1d2c46,#0a1428)" };
  const doors = staff ? [...guestDoors, staffDoor] : guestDoors;

  const open = (id) => {
    if (openingKey) return;
    setOpeningKey(id);
    setTimeout(() => navigate(id), 1100 / motion);
  };

  return (
    <PageEnter keyId="lobby">
      <div className="lobby">
        <div className="lobby__head">
          <div className="kicker">{lang === "ms" ? "Lobi" : "Lobby"}</div>
          <h2 className="display display--md">{t("lobby_title")}</h2>
          <p className="lede">{t("lobby_sub")}</p>
        </div>

        <div className="lobby__corridor">
          <div className="corridor__floor" />
          <div className="corridor__ceiling" />
          <div className="corridor__wall corridor__wall--l" />
          <div className="corridor__wall corridor__wall--r" />
          <div className="corridor__doors">
            {doors.map((d) => (
              <div key={d.id} className={"lobby__doorslot" + (d.id === "admin" ? " lobby__doorslot--staff" : "")}>
                <Door
                  number={d.num}
                  label={d.label}
                  sublabel={d.id === "admin" ? (lang === "ms" ? "Pintu staf" : "Staff door") : (lang === "ms" ? "Bilik " + d.num : "Room " + d.num)}
                  variant={d.id === "admin" ? "modern" : doorVariant}
                  size="lobby"
                  motion={motion}
                  peekColor={d.peek}
                  open={openingKey === d.id}
                  disabled={openingKey && openingKey !== d.id}
                  onClick={() => open(d.id)}
                />
              </div>
            ))}
          </div>

          {/* Discrete staff intercom on the wall */}
          <div className="lobby__intercom-mount">
            <StaffIntercom t={t} authed={!!staff} onTrigger={onIntercom} />
          </div>
        </div>
      </div>
    </PageEnter>
  );
}

export { LobbyPage };
