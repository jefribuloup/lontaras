// Toggle bahasa ID/EN tanpa reload.
// Teks Indonesia = isi HTML asli (baik untuk SEO & tanpa JS). Terjemahan English ada di kamus EN.
(function () {
  const STORAGE_KEY = "lontaras-lang";

  const EN = {
    "meta.title": "Lontaras | Software and AI made in Makassar",
    "meta.desc": "Web apps, desktop software, and AI systems made in Makassar.",
    "nav.label": "Main navigation",
    "nav.services": "Services",
    "nav.products": "Products",
    "nav.how": "How it works",
    "nav.contact": "Contact me",
    "theme.toggle": "Toggle dark/light theme",
    "hero.eyebrow": "Makassar · Since 2026",
    "hero.title": "Repetitive office work, <em>we help streamline it</em> with software.",
    "hero.lead": "[Nama PT] builds web apps, desktop software, and AI systems for universities, certification bodies, and businesses in Indonesia. Everything starts with the problems you face every day.",
    "hero.cta1": "Tell me what you need",
    "hero.cta2": "See what I'm working on",
    "svc.label": "Services",
    "svc.title": "What I can build",
    "svc1.t": "Web and desktop apps",
    "svc1.d": "Websites, information systems, and desktop apps designed to grow alongside your needs.",
    "svc2.t": "AI agents",
    "svc2.d": "AI-based assistants that answer questions and handle repetitive tasks automatically.",
    "svc3.t": "Enterprise applications",
    "svc3.d": "Systems for company and institutional operations, such as record-keeping, approvals, and reporting that are still done manually.",
    "svc4.t": "Academic applications",
    "svc4.d": "Apps that support education, such as student data management, learning, and administration.",
    "prod.label": "Products",
    "prod.title": "What I'm working on",
    "tag.ai": "AI platform",
    "tag.desktop": "Desktop app",
    "p1.t": "AI assistant for institutions",
    "p1.d": "Daily services and operations assisted by AI that can use several models at once.",
    "p2.t": "Document finder",
    "p2.d": "Search document contents with AI help, all running on your own computer.",
    "p3.t": "Browser profile locker",
    "p3.d": "Chrome profiles protected by a password, ideal for shared computers.",
    "status.wip": "In progress",
    "how.label": "How it works",
    "how.title": "A simple process",
    "how.s1": "<b>Talk first.</b> You tell me what's getting in your way. I ask questions until I understand, before writing any code.",
    "how.s2": "<b>Build small first.</b> An early version is made quickly so you can try it, then improved from real use.",
    "how.s3": "<b>Hand over and stay with you.</b> The system runs, there are usage notes, and you know who to contact if something goes wrong.",
    "contact.label": "Contact",
    "contact.title": "Want to make your work easier?",
    "contact.lead": "Just write what you'd like to ask, consult about, or anything about your company.",
    "foot.place": "Makassar, South Sulawesi"
  };

  // Kumpulkan elemen + simpan teks asli (Indonesia).
  const items = [];
  document.querySelectorAll("[data-i18n], [data-i18n-html], [data-i18n-attr]").forEach((el) => {
    const item = { el, id: {} };
    if (el.hasAttribute("data-i18n")) {
      item.text = el.getAttribute("data-i18n");
      item.id.text = el.textContent;
    }
    if (el.hasAttribute("data-i18n-html")) {
      item.html = el.getAttribute("data-i18n-html");
      item.id.html = el.innerHTML;
    }
    if (el.hasAttribute("data-i18n-attr")) {
      item.attrs = el.getAttribute("data-i18n-attr").split(";").map((pair) => {
        const [attr, key] = pair.split(":").map((v) => v.trim());
        item.id["attr:" + attr] = el.getAttribute(attr);
        return { attr, key };
      });
    }
    items.push(item);
  });

  const pick = (lang, key, fallback) => (lang === "en" && EN[key] !== undefined ? EN[key] : fallback);

  function apply(lang) {
    items.forEach((it) => {
      if (it.text) it.el.textContent = pick(lang, it.text, it.id.text);
      if (it.html) it.el.innerHTML = pick(lang, it.html, it.id.html);
      if (it.attrs) {
        it.attrs.forEach(({ attr, key }) => {
          it.el.setAttribute(attr, pick(lang, key, it.id["attr:" + attr]));
        });
      }
    });
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.setLang === lang));
    });
  }

  function setLang(lang) {
    if (lang !== "id" && lang !== "en") return;
    apply(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* abaikan */ }
  }

  document.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.setLang));
  });

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) { /* abaikan */ }
  if (saved === "en") apply("en");

  window.setLang = setLang;
})();
