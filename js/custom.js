(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    const label = toggle.getAttribute(open ? "data-label-open" : "data-label-closed");
    if (label) toggle.setAttribute("aria-label", label);
  }

  function closeNav() {
    setNavOpen(false);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const studio = document.querySelector("#studio");
  if (studio) initStudio(studio);

  const copyBtn = document.querySelector("[data-copy]");
  if (copyBtn) {
    const original = copyBtn.textContent;
    copyBtn.addEventListener("click", function () {
      const value = copyBtn.getAttribute("data-copy") || "";
      const input = document.querySelector("#policy-url");

      function done(message) {
        copyBtn.textContent = message;
        window.setTimeout(function () {
          copyBtn.textContent = original;
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () {
          done("Copied");
        }).catch(function () {
          if (input) {
            input.focus();
            input.select();
          }
          done("Select the link");
        });
        return;
      }

      if (input) {
        input.focus();
        input.select();
      }
      done("Select the link");
    });
  }
})();

function initStudio(root) {
  const tabs = Array.prototype.slice.call(root.querySelectorAll("[data-panel]"));
  const panels = Array.prototype.slice.call(root.querySelectorAll("[data-panel-body]"));

  function show(id) {
    tabs.forEach(function (tab) {
      const on = tab.getAttribute("data-panel") === id;
      tab.classList.toggle("is-selected", on);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel-body") !== id;
    });
  }

  tabs.forEach(function (tab, index) {
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.addEventListener("click", function () {
      show(tab.getAttribute("data-panel"));
    });
    tab.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      next.focus();
      show(next.getAttribute("data-panel"));
    });
  });
}
