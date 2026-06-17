// FAQ page + AI Concierge — AEO-ready
import React from 'react';
import { PageEnter } from './door';

const FAQS = [
  {
    q_ms: "Berapa orang boleh menginap di Ruma Nekma?",
    q_en: "How many guests can stay at Ruma Nekma?",
    a_ms: "Ruma Nekma boleh memuatkan 8 tetamu di 3 bilik tidur dengan 2 bilik air. Master bedroom dengan katil king, bilik kedua dengan queen + ensuite, dan bilik ketiga dengan 2 katil single.",
    a_en: "Ruma Nekma sleeps 8 guests across 3 bedrooms and 2 bathrooms. The master has a king bed, the second has a queen + ensuite, and the third has two single beds.",
  },
  {
    q_ms: "Berapa jauh dari Jonker Walk?",
    q_en: "How far is Jonker Walk?",
    a_ms: "Masa perjalanan bergantung pada trafik. Sila semak peta sebelum bergerak untuk anggaran terkini.",
    a_en: "Travel time depends on traffic. Please check maps before travelling for the latest estimate.",
  },
  {
    q_ms: "Adakah tempat letak kereta disediakan?",
    q_en: "Is parking available?",
    a_ms: "Ya, satu petak parking percuma di bawah bumbung disediakan untuk setiap tempahan.",
    a_en: "Yes, one covered parking bay is included free with every booking.",
  },
  {
    q_ms: "Bolehkah saya bawa haiwan peliharaan?",
    q_en: "Can I bring pets?",
    a_ms: "Maaf, Ruma Nekma adalah unit bebas haiwan untuk menghormati tetamu yang alergi.",
    a_en: "We're sorry — Ruma Nekma is a pet-free unit out of respect for guests with allergies.",
  },
  {
    q_ms: "Apakah polisi pembatalan?",
    q_en: "What's the cancellation policy?",
    a_ms: "Pembatalan percuma sehingga 7 hari sebelum daftar masuk. Selepas itu, 50% dikembalikan sehingga 48 jam sebelum daftar masuk.",
    a_en: "Free cancellation up to 7 days before check-in. After that, 50% refundable up to 48 hours before check-in.",
  },
  {
    q_ms: "Adakah Wi-Fi disediakan?",
    q_en: "Is Wi-Fi included?",
    a_ms: "Ya, Wi-Fi 100Mbps disediakan tanpa had. Sesuai untuk bekerja jarak jauh.",
    a_en: "Yes, unlimited 100Mbps Wi-Fi is included — fast enough for remote work.",
  },
];

const SUGGESTIONS_MS = [
  "Boleh check-in awal?",
  "Ada kolam renang?",
  "Berapa harga semalam?",
  "Berdekatan apa?",
];
const SUGGESTIONS_EN = [
  "Can I check in early?",
  "Is there a pool?",
  "What's the nightly rate?",
  "What's nearby?",
];

function FaqPage({ t, lang }) {
  const [open, setOpen] = React.useState(0);
  const [chat, setChat] = React.useState([
    {
      role: "ai",
      ms: "Hai! Saya AI Concierge Ruma Nekma. Apa yang anda nak tahu?",
      en: "Hi! I'm Ruma Nekma's AI concierge. What would you like to know?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const ask = async (q) => {
    if (!q.trim() || busy) return;
    setChat([...chat, { role: "user", ms: q, en: q }]);
    setInput("");
    setBusy(true);

    // Match against FAQs heuristically; fall back to generic
    const lower = q.toLowerCase();
    let answer_ms = null, answer_en = null;
    for (const f of FAQS) {
      const haystack = (f.q_ms + " " + f.q_en + " " + f.a_ms + " " + f.a_en).toLowerCase();
      const tokens = lower.split(/\s+/).filter((w) => w.length > 3);
      if (tokens.some((w) => haystack.includes(w))) {
        answer_ms = f.a_ms;
        answer_en = f.a_en;
        break;
      }
    }
    if (!answer_ms) {
      answer_ms = "Saya tidak pasti. Sila hantar pertanyaan melalui borang tempahan atau emel booking@rumanekma.com.";
      answer_en = "I'm not sure. Please send the question through the booking form or email booking@rumanekma.com.";
    }
    setTimeout(() => {
      setChat((c) => [...c, { role: "ai", ms: answer_ms, en: answer_en }]);
      setBusy(false);
    }, 900);
  };

  return (
    <PageEnter keyId="faq">
      <div className="page page--faq">
        <header className="page__head">
          <div className="kicker">105 · {t("door_faq")}</div>
          <h2 className="display display--md">{t("faq_h")}</h2>
          <p className="lede">{t("faq_sub")}</p>
        </header>

        <div className="faq__grid">
          {/* AI Concierge */}
          <div className="ai card">
            <div className="ai__head">
              <span className="ai__dot" />
              <div>
                <div className="ai__kicker">{t("ai_kicker")}</div>
                <div className="ai__sub">{lang === "ms" ? "Jawapan segera dari FAQ" : "Instant answers from the FAQ"}</div>
              </div>
              <span className="ai__aeo">AEO</span>
            </div>
            <div className="ai__chat">
              {chat.map((m, i) => (
                <div key={i} className={"ai__msg ai__msg--" + m.role}>
                  {lang === "ms" ? m.ms : m.en}
                </div>
              ))}
              {busy && <div className="ai__msg ai__msg--ai ai__msg--typing">{t("ai_thinking")}<span>.</span><span>.</span><span>.</span></div>}
            </div>
            <div className="ai__sugs">
              {(lang === "ms" ? SUGGESTIONS_MS : SUGGESTIONS_EN).map((s) => (
                <button key={s} onClick={() => ask(s)}>{s}</button>
              ))}
            </div>
            <form
              className="ai__input"
              onSubmit={(e) => { e.preventDefault(); ask(input); }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("ai_placeholder")}
              />
              <button type="submit" disabled={busy}>{t("ai_send")} →</button>
            </form>
          </div>

          {/* FAQ accordion (with FAQPage schema rendered visually) */}
          <div className="faq__list">
            <div className="faq__schemabadge">
              <code>schema.org/FAQPage</code>
              <span>· indexed for AEO</span>
            </div>
            {FAQS.map((f, i) => (
              <details
                key={i}
                open={open === i}
                onClick={(e) => { e.preventDefault(); setOpen(open === i ? -1 : i); }}
                itemScope
                itemType="https://schema.org/Question"
              >
                <summary itemProp="name">
                  <span>{lang === "ms" ? f.q_ms : f.q_en}</span>
                  <span className="faq__chev">{open === i ? "−" : "+"}</span>
                </summary>
                <div className="faq__a" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p itemProp="text">{lang === "ms" ? f.a_ms : f.a_en}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </PageEnter>
  );
}

export { FaqPage };
