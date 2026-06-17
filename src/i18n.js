// Bilingual content for Ruma Nekma
// Keys are language-agnostic; values are { ms, en }
const RN_I18N = {
  brand: { ms: "Ruma Nekma", en: "Ruma Nekma" },
  tagline: {
    ms: "Homestay 3 bilik di tengah kota Melaka",
    en: "A 3-bedroom homestay in the heart of Melaka",
  },

  // Landing
  landing_kicker: { ms: "Selamat datang", en: "Welcome home" },
  landing_title: {
    ms: "Tekan loceng. Pintu akan terbuka.",
    en: "Ring the bell. The door will open.",
  },
  landing_sub: {
    ms: "Apartment 3 bilik, 2 bilik air di Melaka. Sesuai untuk keluarga atau rakan-rakan, dengan tempahan terus melalui laman rasmi Ruma Nekma.",
    en: "A 3-bedroom, 2-bathroom apartment in Melaka. Built for families and friends, with direct booking through the official Ruma Nekma website.",
  },
  ring_bell: { ms: "Tekan loceng", en: "Ring the bell" },
  unlocking: { ms: "Membuka kunci…", en: "Unlocking…" },
  unit_no: { ms: "Unit", en: "Unit" },
  block: { ms: "Blok", en: "Block" },
  floor: { ms: "Tingkat", en: "Floor" },

  // Lobby / pages
  lobby_title: { ms: "Sila pilih bilik", en: "Choose a room" },
  lobby_sub: {
    ms: "Setiap pintu membawa anda ke tempat yang berbeza.",
    en: "Each door leads somewhere different.",
  },
  back_to_lobby: { ms: "Kembali ke lobi", en: "Back to lobby" },
  back: { ms: "Kembali", en: "Back" },
  open_door: { ms: "Buka pintu", en: "Open door" },

  // Door labels (room numbering)
  door_info: { ms: "Tentang rumah", en: "About the home" },
  door_facilities: { ms: "Kemudahan", en: "Facilities" },
  door_reviews: { ms: "Ulasan tetamu", en: "Guest reviews" },
  door_booking: { ms: "Tempah & bayar", en: "Book your stay" },
  door_faq: { ms: "Soalan & sembang AI", en: "Questions & AI chat" },
  door_admin: { ms: "Pintu staf", en: "Staff entrance" },

  // Info page
  info_h: { ms: "Rumah kami, dengan setulusnya.", en: "Our home, plainly stated." },
  info_p1: {
    ms: "Ruma Nekma ialah apartment homestay milik keluarga di Melaka. Tiga bilik tidur muat 8 orang dengan selesa, dua bilik air dan ruang tamu yang cukup luas untuk berkumpul.",
    en: "Ruma Nekma is a family-owned apartment homestay in Melaka. Three bedrooms sleep eight comfortably, two bathrooms, and a living room generous enough to gather in.",
  },
  info_specs: { ms: "Spesifikasi", en: "At a glance" },
  info_specs_list_ms: ["3 bilik tidur (1 master)", "2 bilik air dengan air panas", "Ruang tamu + dapur lengkap", "Maksimum 8 tetamu", "Tempat letak kereta percuma", "Wi-Fi 100Mbps tanpa had"],
  info_specs_list_en: ["3 bedrooms (1 master)", "2 bathrooms with hot showers", "Living + fully-equipped kitchen", "Up to 8 guests", "Free covered parking", "Unlimited 100Mbps Wi-Fi"],
  info_address_label: { ms: "Alamat", en: "Address" },
  info_address: {
    ms: "Melaka, Malaysia. Alamat penuh dikongsi selepas tempahan disahkan.",
    en: "Melaka, Malaysia. Full address is shared after booking confirmation.",
  },
  info_nearby: { ms: "Berdekatan", en: "Nearby" },

  // Facilities
  fac_h: { ms: "Apa yang kami sediakan", en: "What's inside" },
  fac_sub: {
    ms: "Semua yang anda perlukan untuk percutian yang selesa, tanpa perlu keluar mencari.",
    en: "Everything you need for a comfortable stay, without leaving the unit.",
  },

  // Reviews
  rev_h: { ms: "Suara tetamu kami", en: "What guests say" },
  rev_sub: {
    ms: "Ulasan sebenar daripada tetamu yang pernah menginap.",
    en: "Real reviews from past guests.",
  },
  rev_avg: { ms: "Purata", en: "Average" },
  rev_count_ms: (n) => `${n} ulasan`,
  rev_count_en: (n) => `${n} reviews`,
  rev_write: { ms: "Tulis ulasan anda", en: "Write a review" },
  rev_name: { ms: "Nama", en: "Your name" },
  rev_stars: { ms: "Bintang", en: "Stars" },
  rev_text: { ms: "Komen", en: "Comment" },
  rev_submit: { ms: "Hantar ulasan", en: "Submit review" },
  rev_thanks: {
    ms: "Terima kasih! Ulasan akan dipaparkan setelah disahkan oleh tuan rumah.",
    en: "Thank you! Your review will appear after the host approves it.",
  },
  rev_owner_replied: { ms: "Balasan tuan rumah", en: "Host's reply" },

  // Booking
  book_h: { ms: "Tempah penginapan", en: "Book your stay" },
  book_sub: {
    ms: "Calendar disegerakkan setiap jam dengan Booking.com & Airbnb.",
    en: "The calendar syncs hourly with Booking.com & Airbnb.",
  },
  book_checkin: { ms: "Daftar masuk", en: "Check in" },
  book_checkout: { ms: "Daftar keluar", en: "Check out" },
  book_guests: { ms: "Bilangan tetamu", en: "Guests" },
  book_summary: { ms: "Ringkasan tempahan", en: "Booking summary" },
  book_nights_ms: (n) => `${n} malam`,
  book_nights_en: (n) => `${n} night${n === 1 ? "" : "s"}`,
  book_per_night: { ms: "/malam", en: "/night" },
  book_subtotal: { ms: "Subjumlah", en: "Subtotal" },
  book_cleaning: { ms: "Bayaran pembersihan", en: "Cleaning fee" },
  book_total: { ms: "Jumlah keseluruhan", en: "Total" },
  book_pay: { ms: "Bayar dengan ToyyibPay", en: "Pay with ToyyibPay" },
  book_legend_avail: { ms: "Tersedia", en: "Available" },
  book_legend_booked: { ms: "Tempahan langsung", en: "Direct booking" },
  book_legend_external: { ms: "Booking.com / Airbnb", en: "Booking.com / Airbnb" },
  book_legend_blocked: { ms: "Disekat oleh tuan rumah", en: "Blocked by host" },

  // FAQ / AI
  faq_h: { ms: "Soalan lazim", en: "Frequently asked" },
  faq_sub: {
    ms: "Tanya AI Concierge kami, atau lihat soalan biasa di bawah.",
    en: "Ask our AI concierge, or browse common questions below.",
  },
  ai_placeholder: {
    ms: "cth: Berapa minit ke Jonker Walk?",
    en: "e.g. How far is Jonker Walk?",
  },
  ai_send: { ms: "Hantar", en: "Send" },
  ai_thinking: { ms: "Sedang berfikir…", en: "Thinking…" },
  ai_kicker: { ms: "AI Concierge", en: "AI Concierge" },

  // Staff login
  staff_intercom: { ms: "Intercom staf", en: "Staff intercom" },
  staff_login_title: { ms: "Log masuk staf", en: "Staff sign-in" },
  staff_login_sub: {
    ms: "Pintu staf hanya muncul selepas pengesahan. Hanya tuan rumah & pembersih dibenarkan masuk.",
    en: "The staff door only appears after authentication. Hosts & cleaners only.",
  },
  staff_email: { ms: "E-mel", en: "Email" },
  staff_password: { ms: "Kata laluan", en: "Password" },
  staff_signin: { ms: "Buka pintu staf", en: "Unlock staff door" },
  staff_signing_in: { ms: "Mengesahkan...", en: "Signing in..." },
  staff_signout: { ms: "Log keluar", en: "Sign out" },
  staff_access_hint: {
    ms: "Gunakan akaun owner atau admin yang telah disahkan.",
    en: "Use a verified owner or admin account.",
  },
  staff_wrong: {
    ms: "E-mel atau kata laluan salah.",
    en: "Wrong email or password.",
  },
  staff_denied: {
    ms: "Akaun ini tiada akses staf.",
    en: "This account does not have staff access.",
  },
  staff_welcome: { ms: "Selamat kembali", en: "Welcome back" },

  // Admin
  adm_h: { ms: "Dashboard tuan rumah", en: "Host dashboard" },
  adm_tab_overview: { ms: "Ringkasan", en: "Overview" },
  adm_tab_bookings: { ms: "Tempahan", en: "Bookings" },
  adm_tab_calendar: { ms: "Kalendar", en: "Calendar" },
  adm_tab_reviews: { ms: "Ulasan", en: "Reviews" },
  adm_tab_ops: { ms: "Operasi", en: "Operations" },

  // SEO chrome
  seo_score: { ms: "Skor SEO", en: "SEO score" },
  seo_geo: { ms: "Geo-tagged Melaka, MY", en: "Geo-tagged Melaka, MY" },
  seo_schema: { ms: "Skema LodgingBusiness aktif", en: "LodgingBusiness schema active" },
  seo_aeo: { ms: "FAQ siap untuk AEO", en: "FAQ ready for AEO" },
  seo_speed: { ms: "Lighthouse 98", en: "Lighthouse 98" },
};

// Resolve a string by current language. Supports plain strings,
// {ms,en} dicts, or arrays via `_list_ms` / `_list_en` convention.
function RN_T(key, lang) {
  const dict = RN_I18N;
  if (key in dict) {
    const v = dict[key];
    if (typeof v === "object" && (v.ms || v.en)) return v[lang] || v.en || v.ms;
    return v;
  }
  // list convention
  const listKey = key + (lang === "ms" ? "_list_ms" : "_list_en");
  if (listKey in dict) return dict[listKey];
  return key;
}

export { RN_I18N, RN_T };
