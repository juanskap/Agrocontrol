(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  const resetScroll = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  window.addEventListener("DOMContentLoaded", resetScroll);
  window.addEventListener("pageshow", resetScroll);
})();
