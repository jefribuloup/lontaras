// Skrip utama situs. Tambahkan interaksi di sini bila diperlukan.
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".top");
  if (!header) return;

  // Beri bayangan tipis pada header saat halaman di-scroll.
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 8
      ? "0 2px 12px rgba(43, 33, 27, 0.08)"
      : "none";
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
