const sidebar = document.querySelector(".sidebar");
const sidebarToggleBtn = document.querySelectorAll(".sidebar-toggle");
const themeToggleBtn = document.querySelector(".theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const searchForm = document.querySelector(".search-form");

const updateThemeIcon = () => {
  const isDark = document.body.classList.contains("dark-theme");
  themeIcon.textContent = sidebar.classList.contains("collapsed")
    ? (isDark ? "light_mode" : "dark_mode")
    : "dark_mode";
};

const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const shouldUseDark = savedTheme === "dark" || (!savedTheme && systemPrefersDark);

document.body.classList.toggle("dark-theme", shouldUseDark);
updateThemeIcon();

sidebarToggleBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    updateThemeIcon();
  });
});

searchForm.addEventListener("click", () => {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    searchForm.querySelector("input").focus();
  }
});

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();
});

if (window.innerWidth > 768) {
  sidebar.classList.add("collapsed");
}

// === Fonction utilitaire ===
function setActiveMenu(link) {
  document.querySelectorAll(".menu-link").forEach((l) => l.classList.remove("active"));
  link.classList.add("active");
}

// === Fonction pour charger HTML, CSS, JS dynamiquement ===
async function loadPage(page) {
  try {
    // Ici, on considère que "page" contient la valeur "SAV" par exemple
    // Et que le dossier PROJET KPI est la racine du projet (là où se trouve index.html)

    const folder = page; // Exemple: "SAV"
    const htmlResponse = await fetch(`${folder}/${folder}.html`);
    if (!htmlResponse.ok) throw new Error(`Erreur lors du chargement de ${folder}/${folder}.html`);
    const htmlContent = await htmlResponse.text();
    document.getElementById("contenu").innerHTML = htmlContent;

    const cssHref = `${folder}/${folder}.css`;
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = cssHref;
      document.head.appendChild(style);
    }

    const scriptId = `script-${folder}`;
    const oldScript = document.getElementById(scriptId);
    if (oldScript) oldScript.remove();

    // Charge le script JS uniquement s'il existe
    // Tu peux ajouter un try-catch si tu veux être sûr qu'il n'y ait pas d'erreur
    try {
      const script = document.createElement("script");
      script.src = `${folder}/${folder}.js`;
      script.id = scriptId;
      document.body.appendChild(script);
    } catch (e) {
      console.warn(`Pas de fichier JS pour ${folder}`);
    }

  } catch (error) {
    console.error(error);
    document.getElementById("contenu").innerHTML = `<p style="color:red;">Erreur lors du chargement de la page ${page}.</p>`;
  }
}


// === Gestion des clics menu ===
document.addEventListener("DOMContentLoaded", () => {
  // Sous-menus
  const submenuLinks = document.querySelectorAll(".submenu-link");
  submenuLinks.forEach((link) => {
    link.addEventListener("click", async function (e) {
      e.preventDefault();

      const parentMenu = this.closest(".menu-item")?.querySelector(".menu-link");
      if (parentMenu) setActiveMenu(parentMenu);

      const page = this.dataset.page;
      await loadPage(page);
    });
  });

  // Liens principaux avec data-page (ex: Dashboard)
  const mainLinks = document.querySelectorAll(".menu-link[data-page]");
  mainLinks.forEach((link) => {
    link.addEventListener("click", async function (e) {
      e.preventDefault();

      setActiveMenu(this);
      const page = this.dataset.page;
      await loadPage(page);
    });
  });
});

// charger analytics.html 
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".menu-link[data-page]");
  const contenu = document.getElementById("contenu");

  links.forEach(link => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      let page = link.dataset.page; // par exemple "Analytics"

      // Construire le chemin complet
      const path = `${page}/${page}.html`; // "Analytics/Analytics.html"

      try {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const html = await response.text();
        contenu.innerHTML = html;
      } catch (err) {
        contenu.innerHTML = `<p style="color:red;">Erreur lors du chargement de la page: ${err.message}</p>`;
        console.error(err);
      }
    });
  });
});
