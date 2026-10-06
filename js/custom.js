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

  const puzzle = document.querySelector("#home-puzzle");
  if (puzzle) initPuzzle(puzzle);

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
          done("Скопировано");
        }).catch(function () {
          if (input) {
            input.focus();
            input.select();
          }
          done("Выделите ссылку");
        });
        return;
      }

      if (input) {
        input.focus();
        input.select();
      }
      done("Выделите ссылку");
    });
  }
})();

function initPuzzle(root) {
  const status = root.querySelector("#puzzle-status");
  const reset = root.querySelector("#puzzle-reset");
  const homesWrap = root.querySelector("[data-homes]");
  const animals = Array.prototype.slice.call(root.querySelectorAll("[data-role='animal']"));
  let selected = null;

  function setStatus(text) {
    status.textContent = text;
  }

  function remaining() {
    return animals.filter(function (el) {
      return !el.classList.contains("is-matched");
    }).length;
  }

  function clearSelection() {
    selected = null;
    animals.forEach(function (el) {
      el.classList.remove("is-selected");
      if (!el.classList.contains("is-matched")) {
        el.setAttribute("aria-pressed", "false");
      }
    });
  }

  function shuffleHomes() {
    const homes = Array.prototype.slice.call(homesWrap.querySelectorAll("[data-role='home']"));
    for (let i = homes.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = homes[i];
      homes[i] = homes[j];
      homes[j] = swap;
    }
    homes.forEach(function (el) {
      homesWrap.appendChild(el);
    });
  }

  animals.forEach(function (animal) {
    animal.addEventListener("click", function () {
      if (animal.classList.contains("is-matched")) return;
      if (animal.classList.contains("is-selected")) {
        clearSelection();
        setStatus("Выберите животное, затем его дом.");
        return;
      }
      clearSelection();
      animal.classList.add("is-selected");
      animal.setAttribute("aria-pressed", "true");
      selected = animal.getAttribute("data-pair");
      setStatus("Теперь нажмите на дом.");
    });
  });

  homesWrap.addEventListener("click", function (event) {
    const home = event.target.closest("[data-role='home']");
    if (!home || home.classList.contains("is-matched")) return;

    if (!selected) {
      setStatus("Сначала выберите животное.");
      return;
    }

    const animal = animals.find(function (el) {
      return el.classList.contains("is-selected");
    });

    if (home.getAttribute("data-pair") === selected) {
      home.classList.add("is-matched");
      home.disabled = true;
      const state = home.querySelector(".token-state");
      if (state) state.textContent = "Занято";
      if (animal) {
        animal.classList.remove("is-selected");
        animal.classList.add("is-matched");
        animal.disabled = true;
        animal.setAttribute("aria-pressed", "false");
        const animalState = animal.querySelector(".token-state");
        if (animalState) animalState.textContent = "Дом найден";
      }
      selected = null;
      if (remaining() === 0) {
        setStatus("Все животные дома.");
        reset.hidden = false;
      } else {
        setStatus("Верно. Найдите дом для остальных.");
      }
      return;
    }

    home.classList.remove("is-wrong");
    void home.offsetWidth;
    home.classList.add("is-wrong");
    window.setTimeout(function () {
      home.classList.remove("is-wrong");
    }, 450);
    setStatus("Этот дом принадлежит другому. Попробуйте снова.");
  });

  reset.addEventListener("click", function () {
    animals.forEach(function (el) {
      el.classList.remove("is-selected", "is-matched");
      el.disabled = false;
      el.setAttribute("aria-pressed", "false");
      const state = el.querySelector(".token-state");
      if (state) state.textContent = "";
    });
    homesWrap.querySelectorAll("[data-role='home']").forEach(function (el) {
      el.classList.remove("is-matched", "is-wrong");
      el.disabled = false;
      const state = el.querySelector(".token-state");
      if (state) state.textContent = "";
    });
    clearSelection();
    shuffleHomes();
    reset.hidden = true;
    setStatus("Выберите животное, затем его дом.");
  });

  shuffleHomes();
}
