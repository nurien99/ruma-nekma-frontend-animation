// Reviews page — list, ratings, owner reply, submit form
import React from 'react';
import { PageEnter } from './door';
import { RN_I18N } from './i18n';
import { API_BASE } from './config';

const styles = `
.rev__media {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
.rev__media img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.rev__media img:hover {
  opacity: 0.85;
}
.rev__media video {
  width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 8px;
}
.rev__google-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #4285F4;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 50%;
  margin-left: 6px;
  vertical-align: middle;
  line-height: 1;
}
.rev__media-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
.rev__media-preview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}
.rev__media-preview video {
  width: 100%;
  max-height: 160px;
  border-radius: 8px;
  margin-top: 4px;
}
.rev__preview-item {
  position: relative;
  display: inline-block;
}
.rev__preview-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rev__file-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
}
.rev__file-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rev__file-input label {
  font-size: 13px;
  color: #666;
}
.rev__file-input input[type="file"] {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  background: #fafafa;
  font-size: 13px;
  width: 100%;
  box-sizing: border-box;
}
.rev__file-input input[type="file"]:hover {
  border-color: #999;
  background: #f5f5f5;
}
.rev__file-hint {
  font-size: 11px;
  color: #999;
}
.rev__lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}
.rev__lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 8px;
  object-fit: contain;
}
.rev__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
.rev__page-info {
  font-size: 14px;
  color: #666;
  min-width: 50px;
  text-align: center;
}
.btn--outline {
  padding: 8px 20px;
  border: 1.5px solid currentColor;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}
.btn--outline:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.btn--outline:not(:disabled):hover {
  background: rgba(0,0,0,0.06);
}
`;

function Stars({ n, size = 14 }) {
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= n ? "stars__on" : "stars__off"}>★</span>
      ))}
    </span>
  );
}

function Lightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div className="rev__lightbox" onClick={onClose}>
      <img src={src} alt="Review image full size" onClick={(e) => e.stopPropagation()} />
    </div>
  );
}

function ReviewMedia({ images, videoUrl }) {
  const [lightboxSrc, setLightboxSrc] = React.useState(null);

  const hasImages = Array.isArray(images) && images.length > 0;
  const hasVideo = !!videoUrl;

  if (!hasImages && !hasVideo) return null;

  return (
    <>
      <div className="rev__media">
        {hasImages && images.slice(0, 3).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Review photo ${i + 1}`}
            onClick={() => setLightboxSrc(src)}
          />
        ))}
        {hasImages && images.length > 3 && (
          <div style={{
            width: 80, height: 80, borderRadius: 8,
            background: '#eee', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 14, color: '#555', cursor: 'pointer'
          }} onClick={() => setLightboxSrc(images[3])}>
            +{images.length - 3}
          </div>
        )}
        {hasVideo && (
          <video controls style={{ width: '100%', maxHeight: 200, borderRadius: 8, marginTop: 8 }}>
            <source src={videoUrl} />
            Your browser does not support video playback.
          </video>
        )}
      </div>
      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}

const PER_PAGE = 5;

function ReviewsPage({ t, lang }) {
  const [reviews, setReviews] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [form, setForm] = React.useState({ ref: "", email: "", stars: 5, text: "" });
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");

  // Media upload state
  const [imageFiles, setImageFiles] = React.useState([]);
  const [imagePreviews, setImagePreviews] = React.useState([]);
  const [videoFile, setVideoFile] = React.useState(null);
  const [videoPreview, setVideoPreview] = React.useState(null);
  const [fileError, setFileError] = React.useState("");

  React.useEffect(() => {
    // Inject styles once
    if (!document.getElementById('rev-media-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'rev-media-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }

    // Fetch own reviews and Google reviews in parallel
    Promise.all([
      fetch(`${API_BASE}/api/reviews`).then((res) => res.ok ? res.json() : null),
      fetch(`${API_BASE}/api/reviews/google`).then((res) => res.ok ? res.json() : null),
    ]).then(([ownJson, googleJson]) => {
      const ownReviews = [];
      const googleReviews = [];

      if (ownJson && ownJson.success && Array.isArray(ownJson.data)) {
        ownJson.data.forEach((r) => {
          ownReviews.push({
            id: 'own_' + (r.id || Math.random()),
            name: r.display_name || r.guest_name,
            stars: Math.round(Number(r.overall_rating)),
            date: r.reviewed_at || (r.created_at || "").slice(0, 10),
            ms: r.comment,
            en: r.comment,
            reply: r.host_response ? { ms: r.host_response, en: r.host_response } : null,
            images: r.review_images || [],
            video: r.review_video_url || null,
            source: 'own',
          });
        });
      }

      if (googleJson && googleJson.success && Array.isArray(googleJson.data)) {
        googleJson.data.forEach((r, i) => {
          googleReviews.push({
            id: 'google_' + i,
            name: r.display_name,
            stars: Math.round(Number(r.overall_rating)),
            date: r.reviewed_at || "",
            ms: r.comment,
            en: r.comment,
            reply: null,
            images: [],
            video: null,
            source: 'google',
            profilePhoto: r.profile_photo_url || null,
            authorUrl: r.author_url || null,
          });
        });
      }

      // Merge and sort by date descending
      const merged = [...ownReviews, ...googleReviews].sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });

      setReviews(merged);
    }).catch(() => {});
  }, []);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
    : "0.0";
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    pct: reviews.length ? (reviews.filter((r) => r.stars === n).length / reviews.length) * 100 : 0,
  }));

  const handleImagesChange = (e) => {
    setFileError("");
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      setFileError(lang === "ms" ? "Maksimum 5 gambar dibenarkan." : "Maximum 5 images allowed.");
      e.target.value = "";
      return;
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError(lang === "ms"
          ? `"${file.name}" melebihi saiz maksimum 5MB.`
          : `"${file.name}" exceeds the 5MB size limit.`);
        e.target.value = "";
        return;
      }
    }

    // Revoke old object URLs
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleVideoChange = (e) => {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setFileError(lang === "ms"
        ? "Video melebihi saiz maksimum 50MB."
        : "Video exceeds the 50MB size limit.");
      e.target.value = "";
      return;
    }

    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearImages = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.ref.trim() || !form.email.trim() || !form.text.trim()) return;
    setError("");
    setFileError("");

    try {
      const formData = new FormData();
      formData.append('booking_reference', form.ref);
      formData.append('guest_email', form.email);
      formData.append('overall_rating', form.stars);
      formData.append('comment', form.text);

      imageFiles.forEach((file) => {
        formData.append('review_images[]', file);
      });

      if (videoFile) {
        formData.append('review_video', videoFile);
      }

      const res = await fetch(`${API_BASE}/api/reviews/guest`, {
        method: "POST",
        headers: { "Accept": "application/json" },
        // Do NOT set Content-Type — browser sets multipart boundary automatically
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Review could not be submitted");
      }

      setForm({ ref: "", email: "", stars: 5, text: "" });
      clearImages();
      clearVideo();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err.message || (lang === "ms" ? "Ulasan gagal dihantar." : "Review could not be submitted."));
    }
  };

  return (
    <PageEnter keyId="reviews">
      <div className="page page--reviews">
        <header className="page__head">
          <div className="kicker">103 · {t("door_reviews")}</div>
          <h2 className="display display--md">{t("rev_h")}</h2>
          <p className="lede">{t("rev_sub")}</p>
        </header>

        <div className="rev__top">
          <div className="rev__avg card">
            <div className="rev__bignum">{avg}</div>
            <Stars n={Math.round(avg)} size={20} />
            <div className="rev__count">
              {lang === "ms" ? RN_I18N.rev_count_ms(reviews.length) : RN_I18N.rev_count_en(reviews.length)}
            </div>
          </div>
          <div className="rev__dist card">
            {dist.map((d) => (
              <div key={d.n} className="rev__row">
                <span className="rev__rownum">{d.n}★</span>
                <div className="rev__bar"><div style={{ width: d.pct + "%" }} /></div>
                <span className="rev__pct">{Math.round(d.pct)}%</span>
              </div>
            ))}
          </div>
        </div>

        <form className="rev__form card" onSubmit={submit}>
            <div className="card__kicker">{t("rev_write")}</div>
            <label>
              <span>{lang === "ms" ? "Rujukan tempahan" : "Booking reference"}</span>
              <input
                type="text"
                value={form.ref}
                onChange={(e) => setForm({ ...form, ref: e.target.value.toUpperCase() })}
              />
            </label>
            <label>
              <span>{lang === "ms" ? "Emel tempahan" : "Booking email"}</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              <span>{t("rev_stars")}</span>
              <div className="rev__starpick">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    className={n <= form.stars ? "is-on" : ""}
                    onClick={() => setForm({ ...form, stars: n })}
                  >
                    ★
                  </button>
                ))}
              </div>
            </label>
            <label>
              <span>{t("rev_text")}</span>
              <textarea
                rows={4}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              ></textarea>
            </label>

            {/* Media upload section */}
            <div className="rev__file-section">
              {/* Image upload */}
              <div className="rev__file-input">
                <label htmlFor="rev-images-input">
                  {lang === "ms" ? "Tambah gambar (maks 5)" : "Add photos (max 5)"}
                </label>
                <input
                  id="rev-images-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                />
                <span className="rev__file-hint">
                  {lang === "ms" ? "JPEG, PNG, WebP · Maks 5MB setiap satu" : "JPEG, PNG, WebP · Max 5MB each"}
                </span>
              </div>

              {/* Image previews */}
              {imagePreviews.length > 0 && (
                <div>
                  <div className="rev__media-preview">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="rev__preview-item">
                        <img src={src} alt={`Preview ${i + 1}`} />
                        <button
                          type="button"
                          className="rev__preview-remove"
                          onClick={() => removeImage(i)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={clearImages}
                    style={{ marginTop: 6, fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {lang === "ms" ? "Padam semua gambar" : "Clear all photos"}
                  </button>
                </div>
              )}

              {/* Video upload */}
              <div className="rev__file-input">
                <label htmlFor="rev-video-input">
                  {lang === "ms" ? "Tambah video (pilihan)" : "Add video (optional)"}
                </label>
                <input
                  id="rev-video-input"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoChange}
                />
                <span className="rev__file-hint">
                  {lang === "ms" ? "MP4, WebM, MOV · Maks 50MB" : "MP4, WebM, MOV · Max 50MB"}
                </span>
              </div>

              {/* Video preview */}
              {videoPreview && (
                <div style={{ position: 'relative' }}>
                  <video controls style={{ width: '100%', maxHeight: 160, borderRadius: 8 }}>
                    <source src={videoPreview} />
                  </video>
                  <button
                    type="button"
                    onClick={clearVideo}
                    style={{ marginTop: 4, fontSize: 12, color: '#888', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    {lang === "ms" ? "Padam video" : "Remove video"}
                  </button>
                </div>
              )}
            </div>

            {fileError && <div className="staff-err">{fileError}</div>}

            <button type="submit" className="btn btn--primary">{t("rev_submit")}</button>
            {error && <div className="staff-err">{error}</div>}
            {submitted && <div className="rev__thanks">{t("rev_thanks")}</div>}
          </form>

          {/* Reviews list with pagination */}
          <div className="rev__list">
            {reviews.length === 0 && (
              <article className="rev">
                <p className="rev__text">
                  {lang === "ms"
                    ? "Belum ada ulasan yang diluluskan. Ulasan tetamu akan dipaparkan selepas disemak oleh tuan rumah."
                    : "No approved reviews yet. Guest reviews will appear after host approval."}
                </p>
              </article>
            )}
            {reviews.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((r) => (
              <article key={r.id} className={"rev " + (r.pending ? "rev--pending" : "") + (r.source === 'google' ? " rev--google" : "")}>
                <div className="rev__head">
                  {r.profilePhoto ? (
                    <img
                      src={r.profilePhoto}
                      alt={r.name}
                      className="rev__avatar"
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="rev__avatar">{(r.name || "?").split(" ").map((p) => p[0]).join("").slice(0, 2)}</div>
                  )}
                  <div>
                    <div className="rev__name">
                      {r.authorUrl ? (
                        <a href={r.authorUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                          {r.name || "Tetamu"}
                        </a>
                      ) : (
                        r.name || "Tetamu"
                      )}
                      {r.source === 'google' && (
                        <span className="rev__google-badge" title="Google Review">G</span>
                      )}
                      {r.pending && (
                        <span className="rev__pendingtag">{lang === "ms" ? "menunggu pengesahan" : "pending"}</span>
                      )}
                    </div>
                    <div className="rev__date">{r.date}</div>
                  </div>
                  <Stars n={r.stars} size={14} />
                </div>
                <p className="rev__text">{lang === "ms" ? r.ms : r.en}</p>
                <ReviewMedia images={r.images} videoUrl={r.video} />
                {r.reply && (
                  <div className="rev__reply">
                    <div className="rev__replyhead">↳ {t("rev_owner_replied")}</div>
                    <p>{lang === "ms" ? r.reply.ms : r.reply.en}</p>
                  </div>
                )}
              </article>
            ))}

            {/* Pagination */}
            {reviews.length > PER_PAGE && (
              <div className="rev__pagination">
                <button
                  type="button"
                  className="btn btn--outline"
                  disabled={page === 1}
                  onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  ← {lang === "ms" ? "Sebelum" : "Prev"}
                </button>
                <span className="rev__page-info">
                  {page} / {Math.ceil(reviews.length / PER_PAGE)}
                </span>
                <button
                  type="button"
                  className="btn btn--outline"
                  disabled={page >= Math.ceil(reviews.length / PER_PAGE)}
                  onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >
                  {lang === "ms" ? "Seterus" : "Next"} →
                </button>
              </div>
            )}
          </div>
      </div>
    </PageEnter>
  );
}

export { ReviewsPage };
