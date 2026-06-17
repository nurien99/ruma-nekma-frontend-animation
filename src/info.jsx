// Info / About page
import React from 'react';
import { PageEnter } from './door';
import { RN_I18N } from './i18n';

function InfoPage({ t, lang }) {
  const specs = lang === "ms" ? RN_I18N.info_specs_list_ms : RN_I18N.info_specs_list_en;
  const mapLabel = lang === "ms" ? "Semak peta" : "Check maps";
  const nearby = [
    { label: "Jonker Walk", time: mapLabel },
    { label: "Dataran Pahlawan", time: mapLabel },
    { label: "A'Famosa", time: mapLabel },
    { label: "Mahkota Parade", time: mapLabel },
    { label: "Melaka Sentral", time: mapLabel },
    { label: lang === "ms" ? "Kemudahan sekitar" : "Nearby essentials", time: mapLabel },
  ];
  return (
    <PageEnter keyId="info">
      <div className="page page--info">
        <header className="page__head">
          <div className="kicker">101 · {t("door_info")}</div>
          <h2 className="display display--md">{t("info_h")}</h2>
          <p className="lede">{t("info_p1")}</p>
        </header>

        <div className="page__grid info__grid">
          <image-slot
            id="info-hero"
            class="info__hero"
            placeholder={lang === "ms" ? "Drop gambar hadapan rumah" : "Drop hero photo of the home"}
            shape="rounded"
            radius="20"
          ></image-slot>

          <div className="info__specs card">
            <div className="card__kicker">{t("info_specs")}</div>
            <ul className="speclist">
              {specs.map((s, i) => (
                <li key={i}>
                  <span className="speclist__bullet">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="info__addr card">
            <div className="card__kicker">{t("info_address_label")}</div>
            <p className="addr">{t("info_address")}</p>
            <div className="geocoords">
              <code>2.2769° N, 102.2755° E</code>
              <span className="geocoords__pill">Geo-tagged</span>
            </div>
            <div className="map">
              <div className="map__pin" />
              <div className="map__grid" />
              <div className="map__label">Melaka, Malaysia</div>
            </div>
          </div>

          <div className="info__nearby card">
            <div className="card__kicker">{t("info_nearby")}</div>
            <ul className="nearby">
              {nearby.map((n, i) => (
                <li key={i}>
                  <span>{n.label}</span>
                  <span className="nearby__time">{n.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageEnter>
  );
}

export { InfoPage };
