
"use client";

import { useEffect, useState } from "react";
import "./pwa-install.css";

export default function PWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    setInstalled(standalone);

    const ios =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
      !window.navigator.standalone;

    setIsIOS(ios);

    const handleInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      setInstalled(true);
    }

    setInstallPrompt(null);
  };

 if (!installPrompt) {
  return (
    <button
      type="button"
      className="pwa-install-button"
      onClick={() => {
        alert(
          'To install WEBLIVO, open your browser menu (⋮) and select "Install WEBLIVO" or "Add to Home screen".'
        );
      }}
    >
      Install WEBLIVO
    </button>
  );
}

  if (isIOS) {
    return (
      <div className="pwa-install-hint">
        To install WEBLIVO, tap Share in Safari, then select
        "Add to Home Screen".
      </div>
    );
  }

  if (!installPrompt) return null;

  return (
    <button
      type="button"
      className="pwa-install-button"
      onClick={handleInstall}
    >
      Install WEBLIVO
    </button>
  );
}
