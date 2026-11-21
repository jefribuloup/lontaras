// Navigasi antar halaman tanpa reload penuh.
// Hanya isi <main>, judul, dan meta description yang diganti; header & footer tetap.
// Kalau ada yang gagal, otomatis kembali ke navigasi biasa.
(function () {
  if (!window.fetch || !window.history || !history.pushState || !window.DOMParser) return;

  const reduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const cache = new Map();      // path+query -> Promise<Document>
  const positions = new Map();  // path+query -> posisi scroll terakhir
  const keyOf = (u) => u.pathname + u.search;
  let current = keyOf(location);
  let token = 0;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const getMain = () => document.querySelector("main");

  function load(u) {
    const k = keyOf(u);
    if (!cache.has(k)) {
      const p = fetch(k, { credentials: "same-origin" })
        .then((r) => {
          const type = r.headers.get("content-type") || "";
          if (!r.ok || !type.includes("text/html")) throw new Error("bukan halaman");
          return r.text();
        })
        .then((html) => new DOMParser().parseFromString(html, "text/html"))
        .then((doc) => {
          if (!doc.querySelector("main")) throw new Error("tanpa <main>");
          return doc;
        });
      p.catch(() => cache.delete(k));
      cache.set(k, p);
    }
    return cache.get(k);
  }

  // Kembalikan URL jika link ini boleh ditangani router, selain itu null.
  function internalUrl(a, e) {
    if (e && (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)) return null;
    if (a.target && a.target !== "_self") return null;
    if (a.hasAttribute("download") || a.hasAttribute("data-no-spa")) return null;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin) return null;
    if (/\.[a-z0-9]+$/i.test(u.pathname) && !/\.html?$/i.test(u.pathname)) return null; // file/aset
    return u;
  }

  function copyI18n(from, to, attr) {
    if (from.hasAttribute(attr)) to.setAttribute(attr, from.getAttribute(attr));
    else to.removeAttribute(attr);
  }

  function swap(doc) {
    const m = getMain();
    m.innerHTML = doc.querySelector("main").innerHTML;
    m.classList.remove("page-out", "page-in");
    void m.offsetWidth; // restart animasi
    m.classList.add("page-in");

    const t = document.querySelector("title");
    const nt = doc.querySelector("title");
    if (t && nt) {
      copyI18n(nt, t, "data-i18n");
      t.textContent = nt.textContent;
    }
    const d = document.querySelector('meta[name="description"]');
    const nd = doc.querySelector('meta[name="description"]');
    if (d && nd) {
      copyI18n(nd, d, "data-i18n-attr");
      d.setAttribute("content", nd.getAttribute("content") || "");
    }

    if (window.i18n) {
      window.i18n.register(t);
      window.i18n.register(d);
      window.i18n.refresh(m);
    }
  }

  // Scroll instan (tanpa smooth) setelah ganti halaman.
  function jump(target) {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    if (typeof target === "number") window.scrollTo(0, target);
    else if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    html.style.scrollBehavior = prev;
  }

  function hashTarget(hash) {
    if (!hash || hash.length < 2) return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); } catch (_) { return null; }
  }

  async function go(u, push) {
    const t = ++token;
    positions.set(current, window.scrollY);
    if (window.preloader) window.preloader.start();

    const m = getMain();
    const leave = reduced.matches
      ? Promise.resolve()
      : new Promise((resolve) => { m.classList.add("page-out"); setTimeout(resolve, 140); });

    let doc;
    try {
      [doc] = await Promise.all([load(u), leave]);
    } catch (_) {
      location.href = u.href; // fallback: navigasi biasa
      return;
    }
    if (t !== token) return; // sudah ada navigasi yang lebih baru

    swap(doc);
    current = keyOf(u);
    if (push) history.pushState(null, "", u.pathname + u.search + u.hash);

    const restore = push ? undefined : positions.get(current);
    if (restore !== undefined) jump(restore);
    else jump(hashTarget(u.hash));

    if (window.preloader) window.preloader.done();

    const nm = getMain();
    if (nm) nm.focus({ preventScroll: true });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const u = internalUrl(a, e);
    if (!u) return;

    if (keyOf(u) === current) {
      if (u.hash) return; // anchor di halaman yang sama: biarkan browser
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    e.preventDefault();
    go(u, true);
  });

  window.addEventListener("popstate", () => {
    const u = new URL(location.href);
    if (keyOf(u) === current) return; // hanya hash yang berubah
    go(u, false);
  });

  // Muat halaman lebih awal saat link disorot/disentuh supaya terasa instan.
  const warm = (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    const u = internalUrl(a, null);
    if (u && keyOf(u) !== current) load(u).catch(() => {});
  };
  document.addEventListener("mouseover", warm, { passive: true });
  document.addEventListener("touchstart", warm, { passive: true });
  document.addEventListener("focusin", warm);
})();
