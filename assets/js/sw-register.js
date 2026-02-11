(() => {
  "use strict";

  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .catch(() => {
        // Silent failure keeps legacy behavior unchanged.
      });
  });
})();
