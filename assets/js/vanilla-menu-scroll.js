(() => {
  "use strict";

  const MOBILE_BREAKPOINT = 991;

  document.documentElement.classList.add("js");

  const setupResponsiveMenu = () => {
    const mount = document.querySelector(".responsive-menu");
    const sourceMenu = document.querySelector(".mainmenu ul#primary-menu");

    if (!mount || !sourceMenu || mount.querySelector(".af-mobile-menu")) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "af-mobile-menu";

    const menuId = "af-mobile-nav";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "af-menu-toggle";
    toggle.setAttribute("aria-controls", menuId);
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML =
      '<span class="af-menu-toggle-label">Menu</span><span class="af-menu-toggle-bars" aria-hidden="true"></span>';

    const nav = document.createElement("nav");
    nav.className = "af-mobile-nav";
    nav.id = menuId;
    nav.hidden = true;

    const clonedList = sourceMenu.cloneNode(true);
    clonedList.id = "";
    clonedList.classList.add("af-mobile-nav-list");

    clonedList.querySelectorAll("li").forEach((item) => {
      const submenu = item.querySelector("ul");
      const link = item.querySelector("a");

      if (!submenu || !link) {
        return;
      }

      item.classList.add("af-has-submenu");
      submenu.hidden = true;

      const submenuToggle = document.createElement("button");
      submenuToggle.type = "button";
      submenuToggle.className = "af-submenu-toggle";
      submenuToggle.setAttribute("aria-expanded", "false");
      submenuToggle.setAttribute("aria-label", `Toggle ${link.textContent.trim()} submenu`);
      submenuToggle.textContent = "+";
      link.insertAdjacentElement("afterend", submenuToggle);

      const toggleSubmenu = (event) => {
        if (event) {
          event.preventDefault();
        }

        const isOpen = item.classList.toggle("is-open");
        submenu.hidden = !isOpen;
        submenuToggle.textContent = isOpen ? "-" : "+";
        submenuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      };

      submenuToggle.addEventListener("click", toggleSubmenu);

      if ((link.getAttribute("href") || "").trim() === "#") {
        link.addEventListener("click", toggleSubmenu);
      }
    });

    nav.appendChild(clonedList);
    wrapper.append(toggle, nav);
    mount.appendChild(wrapper);

    const setOpen = (isOpen) => {
      nav.hidden = !isOpen;
      wrapper.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    const closeMenu = () => setOpen(false);

    toggle.addEventListener("click", () => {
      setOpen(nav.hidden);
    });

    nav.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) {
        return;
      }

      const href = (link.getAttribute("href") || "").trim();
      if (href && href !== "#") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (nav.hidden) {
        return;
      }

      if (!wrapper.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        closeMenu();
      }
    });
  };

  const setupScrollToTop = () => {
    const links = Array.from(document.querySelectorAll(".scrollToTop"));
    if (!links.length) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;

    const updateVisibility = () => {
      const isVisible = window.scrollY > 600;
      links.forEach((link) => {
        link.classList.toggle("is-visible", isVisible);
        link.setAttribute("aria-hidden", isVisible ? "false" : "true");
      });
      rafId = 0;
    };

    updateVisibility();

    window.addEventListener(
      "scroll",
      () => {
        if (!rafId) {
          rafId = window.requestAnimationFrame(updateVisibility);
        }
      },
      { passive: true }
    );

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });
  };

  setupResponsiveMenu();
  setupScrollToTop();
})();
