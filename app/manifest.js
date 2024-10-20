export default function manifest() {
  return {
    name: "Verifit",
    short_name: "Verifit",
    description: "Verifit",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
      icons: [
        {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        },
      ],
    }
  }