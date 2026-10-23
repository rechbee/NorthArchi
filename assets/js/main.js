/* NORTH — interações da página inicial */
(() => {
  const cfg = window.NORTH_CONFIG || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Croquis: prepara traços para a animação de desenho ---------- */
  document.querySelectorAll(".sketch").forEach((svg) => {
    svg.querySelectorAll(".draw").forEach((el, i) => {
      el.setAttribute("pathLength", "1");
      el.style.setProperty("--d", `${Math.min(i * 0.07, 1.4)}s`);
    });
  });

  /* ---------- Entradas discretas ao rolar ---------- */
  const revealables = document.querySelectorAll("[data-reveal], .sketch");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    // pequeno escalonamento entre irmãos que entram juntos
    revealables.forEach((el) => {
      const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.hasAttribute("data-reveal")) : [];
      const idx = siblings.indexOf(el);
      if (idx > 0) el.style.setProperty("--rd", `${Math.min(idx * 0.08, 0.4)}s`);
      io.observe(el);
    });
  }

  // abertura: a fotografia surge depois do croqui
  const hero = document.querySelector(".hero");
  requestAnimationFrame(() => hero && hero.classList.add("is-ready"));

  /* ---------- Cabeçalho ---------- */
  const header = document.querySelector("[data-header]");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu móvel ---------- */
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".nav-toggle__label").textContent = open ? "Fechar" : "Menu";
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia("(min-width: 921px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Página atual na navegação ---------- */
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav ul a, .site-footer__nav a").forEach((a) => {
    if (a.getAttribute("href") === page) a.setAttribute("aria-current", "page");
  });

  /* ---------- Dados de contato (config.js) ---------- */
  const fill = (key, html) => {
    if (!html) return;
    document.querySelectorAll(`[data-config="${key}"]`).forEach((el) => { el.innerHTML = html; });
  };
  if (cfg.email) fill("email", `<a href="mailto:${cfg.email}">${cfg.email}</a>`);
  if (cfg.phoneLabel) fill("phoneLabel", cfg.whatsapp ? `<a href="tel:+${cfg.whatsapp}">${cfg.phoneLabel}</a>` : cfg.phoneLabel);
  if (cfg.instagram) fill("instagram", `<a href="https://instagram.com/${cfg.instagram}" rel="noopener" target="_blank">@${cfg.instagram}</a>`);
  if (cfg.city) fill("city", cfg.city);

  const waUrl = (text) => `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(text)}`;
  document.querySelectorAll("[data-whatsapp]").forEach((a) => {
    if (cfg.whatsapp) {
      a.href = waUrl("Olá, North! Gostaria de conversar sobre um projeto.");
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      // sem número configurado: leva ao formulário
      const field = document.querySelector("#f-nome");
      if (!field) { a.href = "contato.html"; return; }
      a.addEventListener("click", (e) => { e.preventDefault(); field.focus(); });
    }
  });

  /* ---------- Filtro de projetos ---------- */
  const filters = document.querySelector("[data-filters]");
  const grid = document.querySelector("[data-project-grid]");
  if (filters && grid) {
    const items = [...grid.querySelectorAll(".project")];
    const count = document.querySelector("[data-filter-count]");
    const apply = (cat) => {
      let shown = 0;
      items.forEach((p) => {
        const match = cat === "todos" || p.dataset.cat.split(" ").includes(cat);
        p.hidden = !match;
        if (match) { shown++; p.classList.add("is-in"); }
      });
      grid.classList.toggle("is-filtered", cat !== "todos");
      filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === cat)));
      if (count) count.textContent = `${shown} ${shown === 1 ? "projeto" : "projetos"}`;
    };
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (btn) apply(btn.dataset.filter);
    });
    apply("todos");
  }

  /* ---------- Formulário ---------- */
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");

  // pré-seleciona o tipo vindo dos CTAs de serviço (contato.html?tipo=...)
  const tipo = new URLSearchParams(location.search).get("tipo");
  if (form && tipo) {
    const radio = [...form.querySelectorAll('input[name="tipo"]')].find((r) => r.value === tipo);
    if (radio) radio.checked = true;
  }

  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.classList.remove("is-error");

    const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    if (invalid.length) {
      invalid.forEach((el) => el.setAttribute("aria-invalid", "true"));
      status.classList.add("is-error");
      status.textContent = "Preencha nome, WhatsApp e tipo de projeto para continuarmos.";
      invalid[0].focus();
      return;
    }

    const d = Object.fromEntries(new FormData(form));
    const text = [
      `Olá, North! Meu nome é ${d.nome}.`,
      `Tipo de projeto: ${d.tipo}.`,
      d.mensagem && `Sobre o espaço: ${d.mensagem}`,
      `Contato: ${d.telefone}${d.email ? ` · ${d.email}` : ""}`
    ].filter(Boolean).join("\n");

    // TODO: integrar a um serviço de envio (ex.: Formspree, RD Station, e-mail transacional).
    if (cfg.whatsapp) {
      window.open(waUrl(text), "_blank", "noopener");
      status.textContent = "Abrimos o WhatsApp com sua mensagem. É só enviar.";
    } else {
      status.textContent = "Obrigada! Mensagem pronta — o envio será ativado quando os contatos da North forem configurados.";
    }
  });

  /* ---------- Ano no rodapé ---------- */
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
