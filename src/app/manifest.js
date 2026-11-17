
export default function manifest() {
  return {
    id: "/",
    name: "WEBLIVO - AI Website Builder",
    short_name: "WEBLIVO",
    description:
      "Create, customize and publish beautiful websites with AI using WEBLIVO.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
