// Preloader: overlay "Sedang Memuat ..." + progress bar di bawah navbar.
// Tampil saat halaman pertama dibuka DAN setiap pindah halaman lewat nav.js
// (nav.js memanggil window.preloader.start() lalu window.preloader.done()).
(function () {
  const root = document.documentElement;
  const overlay = document.getElementById("preloader");
  const bar = document.getElementById("progress");

  // Pengaman di <head> tidak lagi diperlukan setelah skrip ini jalan.
  clearTimeout(window.__preSafety);
  if (!bar) { root.classList.remove("is-loading"); return; }
  const fill = bar.firstElementChild;

  const MIN_SHOW = 700;   // ms, tampil minimal saat muat awal
  const MIN_NAV = 600;    // ms, tampil minimal saat pindah halaman
  const MAX_WAIT = 8000;  // ms, pengaman kalau ada aset yang macet saat muat awal

  let value = 0;
  let trickle = null;
  let finishTimer = null;
  let removeTimer = null;
  let shownAt = performance.now();

  const paint = () => { fill.style.transform = "scaleX(" + value + ")"; };

  // Bar mulai dari 0, lalu merayap pelan mendekati 90% sampai selesai.
  function startBar() {
    clearInterval(trickle);
    value = 0;
    fill.style.transition = "none";
    paint();
    void fill.offsetWidth; // terapkan reset tanpa animasi
    fill.style.transition = "";
    bar.classList.add("is-active");
    value = 0.08;
    paint();
    trickle = setInterval(() => {
      value += (0.9 - value) * 0.12;
      paint();
    }, 200);
  }

  function doneBar() {
    clearInterval(trickle);
    value = 1;
    paint();
    setTimeout(() => { if (value === 1) bar.classList.remove("is-active"); }, 350);
  }

  // Tampilkan overlay + bar (dipakai saat pindah halaman).
  function start() {
    clearTimeout(finishTimer);
    clearTimeout(removeTimer);
    startBar();
    if (overlay) {
      overlay.classList.remove("is-hiding");
      overlay.classList.add("is-nav"); // fade-in halus
    }
    root.classList.add("is-loading");
    shownAt = performance.now();
  }

  // Sembunyikan overlay setelah waktu tampil minimal terpenuhi.
  function finish(minShow) {
    clearTimeout(finishTimer);
    const wait = Math.max(0, minShow - (performance.now() - shownAt));
    finishTimer = setTimeout(() => {
      doneBar();
      if (overlay) overlay.classList.add("is-hiding");
      removeTimer = setTimeout(() => root.classList.remove("is-loading"), 400);
    }, wait);
  }

  const done = () => finish(MIN_NAV);

  // Muat awal: overlay sudah tampil sejak <head> (class is-loading).
  let finished = false;
  function finishInitial() {
    if (finished) return;
    finished = true;
    finish(MIN_SHOW);
  }

  startBar();

  const loaded = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });
  const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.all([loaded, fonts]).then(finishInitial, finishInitial);
  setTimeout(finishInitial, MAX_WAIT);

  window.preloader = { start, done };
})();
