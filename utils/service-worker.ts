export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator && window.workbox !== undefined) {
    // Register the service worker
    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope)
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err)
        })
    }
  }
}
