/*
  main.js
  Carica data/content.json e riempie le sezioni dinamiche del sito.
  Per aggiornare i testi NON si modifica questo file: si modifica
  data/content.json (a mano, oppure tramite il pannello Decap CMS
  su /admin).

  NOTA: perché il fetch() funzioni, il sito deve essere servito da
  un server (Netlify, o un server locale) — aprendo index.html con
  doppio click da file:// il browser blocca il caricamento di
  content.json per motivi di sicurezza. Per una prova locale rapida,
  vedi il README ("Anteprima locale").
*/
(async function () {
  let C;
  try {
    const res = await fetch("data/content.json");
    C = await res.json();
  } catch (err) {
    console.error("Impossibile caricare data/content.json:", err);
    return;
  }
  if (!C) return;

  // ---------- helper ----------
  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function waLink(numero, testo) {
    const encoded = encodeURIComponent(testo || "");
    return `https://wa.me/${numero}?text=${encoded}`;
  }

  // ---------- CTA links (whatsapp / form / email) ----------
  const waHref = waLink(C.contatti.whatsappNumero, C.contatti.whatsappTesto);
  ["ctaWhatsapp", "ctaWhatsapp2"].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.href = waHref;
  });
  ["ctaPrenota", "ctaPrenota2"].forEach((id) => {
    const node = document.getElementById(id);
    if (node) node.href = C.contatti.formPrenotazione;
  });
  const emailNode = document.getElementById("ctaEmail");
  if (emailNode) {
    emailNode.href = `mailto:${C.contatti.email}`;
    emailNode.textContent = C.contatti.email;
  }

  // ---------- ORDINE E VISIBILITÀ DEI MODULI ----------
  // Legge C.sezioni e riordina/mostra-nasconde i blocchi .module
  // dentro <main>, in base all'ordine dato in content.js.
  const mainEl = document.getElementById("main");
  if (mainEl && Array.isArray(C.sezioni)) {
    C.sezioni.forEach((s) => {
      const mod = mainEl.querySelector(`.module[data-section="${s.id}"]`);
      if (!mod) return; // sezione non trovata nell'HTML, si ignora
      mod.style.display = s.visibile ? "" : "none";
      mainEl.appendChild(mod); // sposta in fondo, nell'ordine dell'elenco
    });

    // Nasconde il "puntino separatore" del primo modulo visibile,
    // per non avere un divider che pende dal nulla sotto l'header.
    const visibleModules = Array.from(mainEl.querySelectorAll(".module"))
      .filter((m) => m.style.display !== "none");
    visibleModules.forEach((m, i) => {
      const divider = m.querySelector(".module-divider");
      if (divider) divider.style.display = i === 0 ? "none" : "";
    });
  }

  // ---------- CORSI ----------
  const corsiGrid = document.getElementById("corsiGrid");
  if (corsiGrid && Array.isArray(C.corsi)) {
    C.corsi.forEach((corso) => {
      const card = el("div", "corso-card");
      card.innerHTML = `
        <span class="livello">${corso.livello}</span>
        <h3>${corso.nome}</h3>
        <p>${corso.descrizione}</p>
      `;
      corsiGrid.appendChild(card);
    });
  }

  // ---------- CALENDARIO ----------
  const calContent = document.getElementById("calendarioContent");
  if (calContent) {
    if (!C.calendarioAttivo) {
      calContent.innerHTML = `
        <p class="tbd-note">Il calendario definitivo è in arrivo. Scrivici per conoscere i primi orari disponibili.</p>
      `;
    } else if (Array.isArray(C.calendario)) {
      const rows = C.calendario
        .map(
          (r) => `
        <tr>
          <td>${r.giorno}</td>
          <td>${r.orario}</td>
          <td>${r.corso}</td>
          <td>${r.luogo}</td>
        </tr>`
        )
        .join("");
      calContent.innerHTML = `
        <table class="calendario-table">
          <thead>
            <tr><th>Giorno</th><th>Orario</th><th>Corso</th><th>Luogo</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
  }

  // ---------- NEWS ----------
  const newsList = document.getElementById("newsList");
  if (newsList && Array.isArray(C.news) && C.news.length) {
    C.news.forEach((n) => {
      const item = el("div", "news-item");
      const body = n.link
        ? `<h3><a href="${n.link}" target="_blank" rel="noopener">${n.titolo}</a></h3>`
        : `<h3>${n.titolo}</h3>`;
      item.innerHTML = `
        <span class="news-date">${n.data}</span>
        <div>${body}<p>${n.testo}</p></div>
      `;
      newsList.appendChild(item);
    });
  } else if (newsList) {
    newsList.innerHTML = `<p>Nessuna novità al momento — torna a trovarci presto.</p>`;
  }

  // ---------- TEAM ----------
  const teamGrid = document.getElementById("teamGrid");
  if (teamGrid && Array.isArray(C.team)) {
    C.team.forEach((persona) => {
      const card = el("div", "team-card");
      const avatar = persona.foto
        ? `<img class="team-avatar" src="${persona.foto}" alt="${persona.nome}">`
        : `<div class="team-avatar"></div>`;
      card.innerHTML = `
        ${avatar}
        <p class="ruolo">${persona.ruolo}</p>
        <h3>${persona.nome}</h3>
        <p>${persona.bio}</p>
      `;
      teamGrid.appendChild(card);
    });
  }

  // ---------- DOVE ----------
  const doveBox = document.getElementById("doveBox");
  if (doveBox && C.luogo) {
    doveBox.innerHTML = `
      <div>
        <h3>${C.luogo.nome}</h3>
        <p>${C.luogo.indirizzo}</p>
        <p>${C.luogo.note}</p>
      </div>
      <div class="map-placeholder">Mappa in arrivo<br>(si aggiunge con l'indirizzo definitivo)</div>
    `;
  }

  // ---------- FOOTER YEAR ----------
  const yearNode = document.getElementById("footerYear");
  if (yearNode) yearNode.textContent = new Date().getFullYear();

  // ---------- MOBILE NAV ----------
  const toggle = document.getElementById("navToggle");
  const header = document.querySelector(".site-header");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    header.querySelectorAll(".main-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
