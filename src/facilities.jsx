// Facilities page - grid of amenities + photo slots
import React, { useEffect, useState } from 'react';
import { PageEnter } from './door';

function normalizeGallery(data) {
  const facilities = Array.isArray(data?.data) ? data.data : [];

  return facilities.flatMap((facility) => {
    const images = Array.isArray(facility.images) ? facility.images : [];

    return images
      .filter((image) => image.image_url)
      .map((image) => ({
        id: image.id,
        src: image.image_url,
        title: image.title || facility.name,
        facility: facility.name,
      }));
  });
}

const defaultFacilitySections = [
  { id: "bedroom", title_ms: "Bilik tidur", title_en: "Bedrooms",
    items_ms: ["1 Master dengan katil king", "1 bilik dengan queen + ensuite", "1 bilik dengan 2 single bed"],
    items_en: ["1 master suite with king bed", "1 bedroom with queen + ensuite", "1 bedroom with 2 singles"] },
  { id: "kitchen", title_ms: "Dapur", title_en: "Kitchen",
    items_ms: ["Peti sejuk besar", "Periuk nasi & dapur induksi", "Microwave + ketuhar", "Mesin kopi + cerek elektrik"],
    items_en: ["Full-size refrigerator", "Rice cooker & induction hob", "Microwave + oven", "Coffee machine + kettle"] },
  { id: "living", title_ms: "Ruang tamu", title_en: "Living",
    items_ms: ["Smart TV 55-inch (Netflix)", "Sofa muat 5 orang", "Air-cond inverter", "Meja makan untuk 8"],
    items_en: ["55-inch Smart TV (Netflix)", "Sofa seats 5", "Inverter air-con", "Dining for 8"] },
  { id: "bath", title_ms: "Bilik air", title_en: "Bathrooms",
    items_ms: ["2 bilik air dengan air panas", "Hair dryer", "Tuala disediakan", "Shampoo & sabun mandi"],
    items_en: ["2 bathrooms with hot showers", "Hair dryer", "Towels provided", "Shampoo & body wash"] },
  { id: "outside", title_ms: "Luar unit", title_en: "Building",
    items_ms: ["Tempat letak kereta percuma", "Kolam renang kondominium", "Gym 24 jam", "Pengawal keselamatan 24/7"],
    items_en: ["Free covered parking", "Condo swimming pool", "24-hour gym", "24/7 security"] },
  { id: "extras", title_ms: "Tambahan", title_en: "Extras",
    items_ms: ["Wi-Fi 100Mbps", "Mesin basuh + dryer", "Iron + papan seterika", "Playpen bayi (atas permintaan)"],
    items_en: ["100Mbps Wi-Fi", "Washer + dryer", "Iron + board", "Baby playpen (on request)"] },
];

function normalizeDetailSections(data) {
  const sections = Array.isArray(data?.data) ? data.data : [];

  return sections.map((section) => ({
    id: section.id || `${section.title_ms}-${section.display_order}`,
    title_ms: section.title_ms || section.title_en || "",
    title_en: section.title_en || section.title_ms || "",
    items_ms: Array.isArray(section.items_ms) ? section.items_ms : [],
    items_en: Array.isArray(section.items_en) ? section.items_en : (Array.isArray(section.items_ms) ? section.items_ms : []),
  }));
}

function FacilitiesPage({ t, lang }) {
  const [galleryImages, setGalleryImages] = useState([]);
  const [facilitySections, setFacilitySections] = useState(defaultFacilitySections);

  useEffect(() => {
    const galleryController = new AbortController();
    const detailsController = new AbortController();

    fetch("/api/facilities/gallery", {
      headers: { Accept: "application/json" },
      signal: galleryController.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setGalleryImages(normalizeGallery(data));
      })
      .catch((error) => {
        if (error.name !== "AbortError") setGalleryImages([]);
      });

    fetch("/api/facilities/details", {
      headers: { Accept: "application/json" },
      signal: detailsController.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setFacilitySections(normalizeDetailSections(data));
      })
      .catch((error) => {
        if (error.name !== "AbortError") setFacilitySections(defaultFacilitySections);
      });

    return () => {
      galleryController.abort();
      detailsController.abort();
    };
  }, []);

  return (
    <PageEnter keyId="facilities">
      <div className="page page--facilities">
        <header className="page__head">
          <div className="kicker">102 &middot; {t("door_facilities")}</div>
          <h2 className="display display--md">{t("fac_h")}</h2>
          <p className="lede">{t("fac_sub")}</p>
        </header>

        {galleryImages.length > 0 ? (
          <div className="gallery gallery--uploaded">
            {galleryImages.map((image, index) => (
              <figure
                key={image.id || `${image.src}-${index}`}
                className={"gallery__item" + (index === 0 ? " gallery__item--feature" : "")}
              >
                <img src={image.src} alt={image.title || image.facility || t("door_facilities")} loading="lazy" />
                {(image.title || image.facility) && (
                  <figcaption className="gallery__caption">
                    {image.title || image.facility}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <div className="gallery">
            {[1, 2, 3, 4].map((i) => (
              <image-slot
                key={i}
                id={`fac-gal-${i}`}
                placeholder={lang === "ms" ? `Gambar ${i}` : `Photo ${i}`}
                shape="rounded"
                radius="14"
                class={"gallery__slot gallery__slot--" + i}
              ></image-slot>
            ))}
          </div>
        )}

        <div className="fac__grid">
          {facilitySections.map((section) => (
            <div key={section.id} className="fac__card card">
              <div className="card__kicker">{lang === "ms" ? section.title_ms : section.title_en}</div>
              <ul className="speclist">
                {(lang === "ms" ? section.items_ms : section.items_en).map((it, i) => (
                  <li key={i}>
                    <span className="speclist__dot" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </PageEnter>
  );
}

export { FacilitiesPage };
