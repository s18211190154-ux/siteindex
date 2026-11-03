const UI = {
  en: {
    tagline: "Bangladesh banks & jobs",
    navBanks: "Banks",
    navJobs: "Job Links",
    banksTitle: "Bangladesh Banks",
    banksSubtitle: "Official websites and career pages, grouped by category.",
    searchPlaceholder: "Search banks...",
    allCategories: "All Categories",
    bankCount: (n) => `${n} banks`,
    jobsTitle: "Job Links",
    jobsSubtitle: "Job portals and bdjobs categories.",
    bdjobsCategories: "bdjobs Categories",
    website: "Website",
    careers: "Careers",
    notes: "Notes",
    alljobsTitle: "Alljobs by Teletalk",
    alljobsDesc: "Government and private jobs in Bangladesh.",
    bdjobsTitle: "bdjobs.com",
    bdjobsDesc: "Bangladesh's largest job portal — browse all jobs.",
    jobPortal: "Job portal",
    visitSite: "Visit site",
    footer: "Generated from the Bangladesh Bank Careers Directory 2026 and bdjobs links.",
    langButton: "বাংলা",
    open: "Open"
  },
  bn: {
    tagline: "বাংলাদেশের ব্যাংক ও চাকরি",
    navBanks: "ব্যাংক",
    navJobs: "চাকরির লিংক",
    banksTitle: "বাংলাদেশের ব্যাংক",
    banksSubtitle: "ক্যাটাগরি অনুযায়ী অফিসিয়াল ওয়েবসাইট ও ক্যারিয়ার পেজ।",
    searchPlaceholder: "ব্যাংক খুঁজুন...",
    allCategories: "সব ক্যাটাগরি",
    bankCount: (n) => `${n}টি ব্যাংক`,
    jobsTitle: "চাকরির লিংক",
    jobsSubtitle: "চাকরির পোর্টাল ও বিডিজবস ক্যাটাগরি।",
    bdjobsCategories: "বিডিজবস ক্যাটাগরি",
    website: "ওয়েবসাইট",
    careers: "ক্যারিয়ার",
    notes: "নোট",
    alljobsTitle: "অলজবস বাই টেলিটক",
    alljobsDesc: "বাংলাদেশের সরকারি ও বেসরকারি চাকরি।",
    bdjobsTitle: "বিডিজবস.কম",
    bdjobsDesc: "বাংলাদেশের সবচেয়ে বড় চাকরির পোর্টাল — সব চাকরি দেখুন।",
    jobPortal: "চাকরির পোর্টাল",
    visitSite: "সাইটে যান",
    footer: "বাংলাদেশ ব্যাংক ক্যারিয়ার ডিরেক্টরি ২০২৬ ও বিডিজবস লিংক থেকে তৈরি।",
    langButton: "English",
    open: "খুলুন"
  }
};

function getSavedLang() {
  try {
    return localStorage.getItem("siteindex-lang") === "bn" ? "bn" : "en";
  } catch {
    return "en";
  }
}

const state = {
  lang: getSavedLang(),
  banks: [],
  jobs: [],
  i18n: { categories: {}, statuses: {}, descriptions: {}, notes: {} },
  category: ""
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function t(key) {
  return UI[state.lang][key];
}

function tr(map, value) {
  if (!value) return "";
  return state.lang === "bn" ? (map[value] || value) : value;
}

function localizeNumber(n) {
  if (state.lang !== "bn") return String(n);
  const bn = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return String(n).replace(/\d/g, (d) => bn[+d]);
}

function applyStaticLanguage() {
  document.documentElement.lang = state.lang === "bn" ? "bn" : "en";
  document.title = state.lang === "bn" ? "সাইটইনডেক্স - বাংলাদেশের ব্যাংক ও চাকরি" : "SiteIndex - Bangladesh Banks & Jobs";
  $$("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $$("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  $("#langToggle").textContent = t("langButton");
  $("#langToggle").setAttribute("aria-label", state.lang === "en" ? "বাংলায় দেখুন" : "View in English");
}

function setupTabs() {
  $$("nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$("nav button").forEach((b) => b.classList.remove("active"));
      $$(".tab").forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

function renderBanks() {
  const grid = $("#banksGrid");
  const q = $("#search").value.toLowerCase();
  const cat = state.category;

  const filtered = state.banks.filter((b) => {
    const categoryBn = state.i18n.categories[b.category] || "";
    const haystack = [
      b.bank,
      b.category,
      categoryBn,
      b.description,
      state.i18n.descriptions[b.description] || ""
    ].join(" ").toLowerCase();
    return (!q || haystack.includes(q)) && (!cat || b.category === cat);
  });

  $("#bankCount").textContent = t("bankCount")(localizeNumber(filtered.length));

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty">${state.lang === "bn" ? "কোনো ব্যাংক পাওয়া যায়নি।" : "No banks found."}</div>`;
    return;
  }

  grid.innerHTML = filtered.map((b) => {
    const category = tr(state.i18n.categories, b.category);
    const status = tr(state.i18n.statuses, b.status);
    const description = tr(state.i18n.descriptions, b.description);
    const notes = tr(state.i18n.notes, b.notes);
    const confirmedClass = (b.status || "").toLowerCase().includes("confirmed") ? "confirmed" : "check";
    return `
      <article class="card">
        <div class="card-top">
          <h3>${b.bank}</h3>
          <span class="badge ${confirmedClass}">${status}</span>
        </div>
        <div class="meta">${category}</div>
        <p class="desc">${description}</p>
        ${notes ? `<p class="notes"><strong>${t("notes")}:</strong> ${notes}</p>` : ""}
        <div class="links">
          ${b.website ? `<a href="${b.website}" target="_blank" rel="noopener">${t("website")} ↗</a>` : ""}
          ${b.careers ? `<a href="${b.careers}" target="_blank" rel="noopener">${t("careers")} ↗</a>` : ""}
        </div>
      </article>
    `;
  }).join("");
}

function populateCategories() {
  const select = $("#categoryFilter");
  const current = state.category;
  const categories = [...new Set(state.banks.map((b) => b.category).filter(Boolean))]
    .sort((a, b) => tr(state.i18n.categories, a).localeCompare(tr(state.i18n.categories, b), state.lang));

  select.innerHTML = `<option value="">${t("allCategories")}</option>` +
    categories.map((c) => `<option value="${c}">${tr(state.i18n.categories, c)}</option>`).join("");

  if (categories.includes(current)) {
    select.value = current;
  } else {
    state.category = "";
    select.value = "";
  }
}

function initBanks() {
  populateCategories();
  $("#search").addEventListener("input", renderBanks);
  $("#categoryFilter").addEventListener("change", (e) => {
    state.category = e.target.value;
    renderBanks();
  });
  renderBanks();
}

function renderFeaturedPortal() {
  const el = $("#featuredPortal");
  const portals = [
    {
      title: t("alljobsTitle"),
      desc: t("alljobsDesc"),
      url: "https://alljobs.teletalk.com.bd/"
    },
    {
      title: t("bdjobsTitle"),
      desc: t("bdjobsDesc"),
      url: "https://bdjobs.com/h/jobs"
    }
  ];
  el.innerHTML = portals.map((portal, index) => `
    <article class="featured-card ${index === 1 ? "secondary" : ""}">
      <div>
        <span class="eyebrow">${t("jobPortal")}</span>
        <h3>${portal.title}</h3>
        <p>${portal.desc}</p>
      </div>
      <a class="primary-btn" href="${portal.url}" target="_blank" rel="noopener">${t("visitSite")} ↗</a>
    </article>
  `).join("");
}

function renderJobs() {
  const list = $("#jobsList");
  list.innerHTML = state.jobs.map((job) => {
    const title = state.lang === "bn" ? (job.titleBn || job.title) : job.title;
    return `
      <article class="job-card">
        <div>
          <h4>${title}</h4>
          <span class="job-url">${job.url.replace(/^https?:\/\//, "").split("?")[0]}</span>
        </div>
        <a class="job-link" href="${job.url}" target="_blank" rel="noopener">${t("open")} ↗</a>
      </article>
    `;
  }).join("");
}

function applyLanguage() {
  applyStaticLanguage();
  populateCategories();
  renderBanks();
  renderFeaturedPortal();
  renderJobs();
}

async function init() {
  setupTabs();
  applyStaticLanguage();

  try {
    const [banks, jobs, i18n] = await Promise.all([
      fetch("banks.json").then((r) => r.json()),
      fetch("jobs.json").then((r) => r.json()),
      fetch("bank-i18n.json").then((r) => r.json())
    ]);
    state.banks = banks;
    state.jobs = jobs;
    state.i18n = i18n;
    initBanks();
    renderFeaturedPortal();
    renderJobs();
  } catch (err) {
    console.error(err);
    $("#banksGrid").innerHTML = `<div class="empty">Could not load site data.</div>`;
  }

  $("#langToggle").addEventListener("click", () => {
    state.lang = state.lang === "en" ? "bn" : "en";
    try {
      localStorage.setItem("siteindex-lang", state.lang);
    } catch {}
    applyLanguage();
  });
}

init();
