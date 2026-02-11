(() => {
  "use strict";

  const ACCENT_STORAGE_KEY = "animefreak-accent";
  const FAVORITES_STORAGE_KEY = "animefreak-favorites";
  const RECENT_TRAILERS_STORAGE_KEY = "animefreak-recent-trailers";
  const MAX_RECENT_TRAILERS = 5;

  const body = document.body;
  if (!body) {
    return;
  }

  const storage = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value;
      } catch (error) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        // Ignore storage write failures (private mode, quota).
      }
    },
  };

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untitled";

  let currentCategoryFilter = "*";
  const activeCategory = document.querySelector(".portfolio-menu li.active");
  if (activeCategory) {
    currentCategoryFilter = activeCategory.dataset.filter || "*";
  }

  const readFavorites = () => {
    const raw = storage.get(FAVORITES_STORAGE_KEY, "[]");
    try {
      const parsed = JSON.parse(raw);
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      return new Set();
    }
  };

  const persistFavorites = (favorites) => {
    storage.set(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  };

  const readRecentTrailers = () => {
    const raw = storage.get(RECENT_TRAILERS_STORAGE_KEY, "[]");
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .filter((entry) => entry && typeof entry.url === "string")
        .map((entry) => ({
          title: typeof entry.title === "string" ? entry.title : "Trailer",
          url: entry.url,
          ts: typeof entry.ts === "number" ? entry.ts : 0,
        }))
        .slice(0, MAX_RECENT_TRAILERS);
    } catch (error) {
      return [];
    }
  };

  const persistRecentTrailers = (items) => {
    storage.set(RECENT_TRAILERS_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_RECENT_TRAILERS)));
  };

  const movieCards = Array.from(document.querySelectorAll(".single-portfolio"));
  const newsCards = Array.from(document.querySelectorAll(".single-news"));

  const movieEntries = movieCards
    .map((card) => {
      const titleNode = card.querySelector(".portfolio-content h2");
      const title = (titleNode ? titleNode.textContent : "").trim();
      const id = slugify(title);
      card.dataset.afId = id;
      return {
        type: "movie",
        id,
        title: title.toLowerCase(),
        card,
        container: card.closest('[class*="col-"]') || card,
      };
    })
    .filter((entry) => entry.title.length > 0);

  const newsEntries = newsCards
    .map((card) => {
      const titleNode = card.querySelector("h2");
      const bodyNode = card.querySelector("p");
      const title = (titleNode ? titleNode.textContent : "").trim();
      const bodyText = (bodyNode ? bodyNode.textContent : "").trim();
      return {
        type: "news",
        id: slugify(title),
        title: `${title} ${bodyText}`.toLowerCase(),
        card,
        container: card,
      };
    })
    .filter((entry) => entry.title.length > 0);

  const searchableEntries = [...movieEntries, ...newsEntries];
  const favorites = readFavorites();
  let recentTrailers = readRecentTrailers();
  let favoritesOnly = false;

  movieEntries.forEach((entry) => {
    entry.card.classList.toggle("is-favorite", favorites.has(entry.id));
  });

  const searchInput = document.querySelector(".header-right form input[type='text']");
  const headerForm = document.querySelector(".header-right form");

  let searchStatus = null;
  if (headerForm) {
    searchStatus = document.createElement("p");
    searchStatus.className = "search-status";
    searchStatus.setAttribute("aria-live", "polite");
    headerForm.appendChild(searchStatus);
  }

  let favoritesToggleButton = null;
  if (movieEntries.length > 0) {
    const portfolioBlock =
      document.querySelector(".portfolio-item") ||
      document.querySelector(".portfolio-area .row");

    if (portfolioBlock && portfolioBlock.parentElement) {
      const controls = document.createElement("div");
      controls.className = "portfolio-controls";

      favoritesToggleButton = document.createElement("button");
      favoritesToggleButton.type = "button";
      favoritesToggleButton.className = "favorites-filter";
      favoritesToggleButton.textContent = "Show Favorites";
      favoritesToggleButton.setAttribute("aria-pressed", "false");

      controls.appendChild(favoritesToggleButton);
      portfolioBlock.parentElement.insertBefore(controls, portfolioBlock);
    }

    movieEntries.forEach((entry) => {
      const content = entry.card.querySelector(".portfolio-content");
      if (!content || content.querySelector(".favorite-btn")) {
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "favorite-btn";
      button.dataset.favoriteId = entry.id;
      content.appendChild(button);
    });
  }

  const updateFavoriteButtons = () => {
    document.querySelectorAll(".favorite-btn").forEach((button) => {
      const id = button.dataset.favoriteId || "";
      const isFavorite = favorites.has(id);
      button.classList.toggle("active", isFavorite);
      button.setAttribute("aria-pressed", isFavorite ? "true" : "false");
      button.textContent = isFavorite ? "Saved" : "Save";
    });

    movieEntries.forEach((entry) => {
      entry.card.classList.toggle("is-favorite", favorites.has(entry.id));
    });
  };

  const applyPortfolioFiltering = (query) => {
    if (!movieEntries.length) {
      return;
    }

    const matchesCategory = (container) => {
      if (currentCategoryFilter === "*") {
        return true;
      }
      return container.matches(currentCategoryFilter);
    };

    movieEntries.forEach((entry) => {
      const queryMatch = !query || entry.title.includes(query);
      const categoryMatch = matchesCategory(entry.container);
      const favoriteMatch = !favoritesOnly || favorites.has(entry.id);
      entry.container.style.display = queryMatch && categoryMatch && favoriteMatch ? "" : "none";
    });
  };

  const applyNewsFiltering = (query) => {
    newsEntries.forEach((entry) => {
      const queryMatch = !query || entry.title.includes(query);
      entry.container.style.display = queryMatch ? "" : "none";
    });
  };

  const updateStatus = (query) => {
    if (!searchStatus) {
      return;
    }

    if (!query && !favoritesOnly) {
      searchStatus.textContent = "";
      return;
    }

    const visibleCount = searchableEntries.reduce((count, entry) => {
      const isVisible = entry.container.style.display !== "none";
      return count + (isVisible ? 1 : 0);
    }, 0);

    const parts = [];
    if (query) {
      parts.push(`Search: "${query}"`);
    }
    if (favoritesOnly) {
      parts.push("Favorites only");
    }
    parts.push(`${visibleCount} result${visibleCount === 1 ? "" : "s"}`);

    searchStatus.textContent = parts.join(" | ");
  };

  const runFilters = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    applyPortfolioFiltering(query);
    applyNewsFiltering(query);
    updateStatus(query);
  };

  if (searchInput) {
    searchInput.placeholder = "Search movies or news";
    searchInput.setAttribute("aria-label", "Search movies or news");
    searchInput.addEventListener("input", runFilters);
  }

  if (favoritesToggleButton) {
    favoritesToggleButton.addEventListener("click", () => {
      favoritesOnly = !favoritesOnly;
      favoritesToggleButton.classList.toggle("active", favoritesOnly);
      favoritesToggleButton.setAttribute("aria-pressed", favoritesOnly ? "true" : "false");
      favoritesToggleButton.textContent = favoritesOnly ? "Show All" : "Show Favorites";
      runFilters();
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".favorite-btn");
    if (!button) {
      return;
    }

    const id = button.dataset.favoriteId || "";
    if (!id) {
      return;
    }

    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }

    persistFavorites(favorites);
    updateFavoriteButtons();
    runFilters();
  });

  const categoryItems = Array.from(document.querySelectorAll(".portfolio-menu li"));
  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      categoryItems.forEach((navItem) => navItem.classList.remove("active"));
      item.classList.add("active");
      currentCategoryFilter = item.dataset.filter || "*";
      runFilters();
    });
  });

  const isYouTubeLink = (link) => {
    try {
      const url = new URL(link.href, window.location.href);
      return /(^|\.)youtube\.com$|(^|\.)youtu\.be$/i.test(url.hostname);
    } catch (error) {
      return false;
    }
  };

  const findTrailerTitle = (link) => {
    const context = link.closest(".single-portfolio, .hero-area-content, .video-area, .single-news");
    const contextHeading = context ? context.querySelector("h2") : null;
    if (contextHeading) {
      return contextHeading.textContent.trim();
    }

    const siblingHeading =
      link.parentElement && link.parentElement.querySelector("h2")
        ? link.parentElement.querySelector("h2")
        : null;
    if (siblingHeading) {
      return siblingHeading.textContent.trim();
    }

    const pageTitleHeading = document.querySelector(".breadcrumb-area-content h1");
    if (pageTitleHeading) {
      return pageTitleHeading.textContent.trim();
    }

    return "Trailer";
  };

  const renderRecentTrailers = () => {
    const footerContainer = document.querySelector(".footer .container");
    if (!footerContainer) {
      return;
    }

    const existingRow = footerContainer.querySelector(".recent-trailers-row");
    if (existingRow) {
      existingRow.remove();
    }

    if (!recentTrailers.length) {
      return;
    }

    const row = document.createElement("div");
    row.className = "row recent-trailers-row";

    const col = document.createElement("div");
    col.className = "col-lg-12";

    const widget = document.createElement("div");
    widget.className = "widget recent-trailers-widget";

    const heading = document.createElement("h4");
    heading.textContent = "Recently Opened Trailers";
    widget.appendChild(heading);

    const list = document.createElement("ul");
    recentTrailers.forEach((item) => {
      const li = document.createElement("li");
      const anchor = document.createElement("a");
      anchor.href = item.url;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = item.title;
      li.appendChild(anchor);
      list.appendChild(li);
    });

    widget.appendChild(list);
    col.appendChild(widget);
    row.appendChild(col);

    const hr = footerContainer.querySelector("hr");
    footerContainer.insertBefore(row, hr || null);
  };

  document.querySelectorAll("a[target='_blank']").forEach((link) => {
    const rel = link.getAttribute("rel") || "";
    if (!/noopener/i.test(rel) || !/noreferrer/i.test(rel)) {
      link.setAttribute("rel", "noopener noreferrer");
    }

    if (!isYouTubeLink(link)) {
      return;
    }

    link.addEventListener("click", () => {
      const url = link.href;
      const title = findTrailerTitle(link);
      recentTrailers = [{ title, url, ts: Date.now() }, ...recentTrailers.filter((item) => item.url !== url)].slice(
        0,
        MAX_RECENT_TRAILERS
      );
      persistRecentTrailers(recentTrailers);
      renderRecentTrailers();
    });
  });

  const accentButtonHost = document.querySelector(".header-right ul");
  if (accentButtonHost) {
    const accentItem = document.createElement("li");
    const accentButton = document.createElement("button");
    accentButton.type = "button";
    accentButton.className = "accent-toggle";

    const applyAccent = (accent) => {
      const value = accent === "teal" ? "teal" : "rose";
      body.dataset.accent = value;
      accentButton.textContent = value === "rose" ? "Accent: Rose" : "Accent: Teal";
      storage.set(ACCENT_STORAGE_KEY, value);
    };

    applyAccent(storage.get(ACCENT_STORAGE_KEY, "rose"));

    accentButton.addEventListener("click", () => {
      const next = body.dataset.accent === "rose" ? "teal" : "rose";
      applyAccent(next);
    });

    accentItem.appendChild(accentButton);
    accentButtonHost.appendChild(accentItem);
  }

  const eagerImages = new Set([
    document.querySelector(".logo img"),
    document.querySelector(".hero-area .hero-area-slide img"),
  ]);

  document.querySelectorAll("img").forEach((image) => {
    if (!image.getAttribute("loading") && !eagerImages.has(image)) {
      image.setAttribute("loading", "lazy");
    }
  });

  renderRecentTrailers();
  updateFavoriteButtons();
  runFilters();
})();
