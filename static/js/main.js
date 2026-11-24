// Skrip utama situs.
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initHeaderShadow();
  initNavToggle();
});

// Toggle tema gelap/terang. Awalnya mengikuti sistem, lalu pilihan pengguna disimpan.
function initTheme() {
  const KEY = "lontaras-theme";
  const root = document.documentElement;
  const btn = document.getElementById("theme-toggle");
  const meta = document.querySelector('meta[name="theme-color"]');

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    if (meta) meta.setAttribute("content", theme === "dark" ? "#1A1411" : "#F6EFE4");
  };
  const stored = () => {
    try { return localStorage.getItem(KEY); } catch (_) { return null; }
  };

  if (btn) {
    btn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (_) { /* abaikan */ }
    });
  }

  // Ikuti perubahan tema sistem selama pengguna belum memilih sendiri.
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", (e) => {
    if (!stored()) apply(e.matches ? "dark" : "light");
  });
}

// Bayangan tipis pada header saat halaman di-scroll.
function initHeaderShadow() {
  const header = document.querySelector(".top");
  if (!header) return;
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 8 ? "var(--header-shadow)" : "none";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Menu navbar pada layar kecil: buka/tutup panel, tutup saat link dipilih, Esc, klik di luar, atau layar melebar.
function initNavToggle() {
  const header = document.querySelector(".top");
  const btn = document.getElementById("nav-toggle");
  if (!header || !btn) return;

  const set = (open) => {
    header.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  };

  btn.addEventListener("click", () => set(!header.classList.contains("is-open")));

  document.addEventListener("click", (e) => {
    if (!header.classList.contains("is-open")) return;
    if (e.target.closest("#site-menu a") || !e.target.closest(".top")) set(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      set(false);
      btn.focus();
    }
  });

  window.matchMedia("(min-width: 761px)").addEventListener("change", (e) => {
    if (e.matches) set(false);
  });
}
