// Preloader: overlay "Sedang Memuat ..." saat halaman pertama dibuka,
// plus progress bar di bawah navbar (juga dipakai saat pindah halaman lewat nav.js).
(function () {
  const root = document.documentElement;
  const overlay = document.getElementById("preloader");
  const bar = document.getElementById("progress");
  if (!bar) { root.classList.remove("is-loading"); return; }
  const fill = bar.firstElementChild;

  const MIN_SHOW = 700;   // ms, supaya preloader tidak sekadar berkedip
  const MAX_WAIT = 8000;  // ms, pengaman kalau ada aset yang macet
  let value = 0;
  let timer = null;
  let hideTimer = null;

  const paint = () => { fill.style.transform = "scaleX(" + value + ")"; };

  // Mulai progress dari 0, lalu merayap pelan mendekati 90% sampai done() dipanggil.
  function start() {
    clearInterval(timer);
    clearTimeout(hideTimer);
    value = 0;
    fill.style.transition = "none";
    paint();
    void fill.offsetWidth; // terapkan reset tanpa animasi
    fill.style.transition = "";
    bar.classList.add("is-active");
    value = 0.08;
    paint();
    timer = setInterval(() => {
      value += (0.9 - value) * 0.12;
      paint();
    }, 200);
  }

  // Penuhkan bar, lalu sembunyikan.
  function done() {
    clearInterval(timer);
    value = 1;
    paint();
    hideTimer = setTimeout(() => bar.classList.remove("is-active"), 350);
  }

  function hideOverlay() {
    if (!overlay) { root.classList.remove("is-loading"); return; }
    overlay.classList.add("is-hiding");
    setTimeout(() => root.classList.remove("is-loading"), 400);
  }

  // Muat awal.
  const t0 = performance.now();
  let finished = false;

  function finishInitial() {
    if (finished) return;
    finished = true;
    const wait = Math.max(0, MIN_SHOW - (performance.now() - t0));
    setTimeout(() => { done(); hideOverlay(); }, wait);
  }

  start();

  const loaded = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });
  const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.all([loaded, fonts]).then(finishInitial, finishInitial);
  setTimeout(finishInitial, MAX_WAIT);

  window.preloader = { start, done };
})();
