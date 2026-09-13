import type { NextConfig } from "next";

// Modo demo: exportación estática para GitHub Pages (ver .github/workflows/deploy-demo.yml).
const demo = process.env.NEXT_PUBLIC_DEMO_MODE === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  basePath,
  // Los archivos *.dyn.tsx necesitan servidor (p. ej. la imagen para compartir) y quedan fuera del build estático.
  pageExtensions: demo ? ["tsx", "ts"] : ["dyn.tsx", "tsx", "ts"],
  ...(demo && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
  }),
};

export default nextConfig;
