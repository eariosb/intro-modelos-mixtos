/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // WebR needs to load WASM/worker assets cross-origin isolated for best performance.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    // El build de @r-wasm/webr (webr.cjs) usa `require()` con una ruta
    // dinámica para localizar sus workers/WASM en tiempo de ejecución.
    // Webpack no puede resolver esa expresión estáticamente y la marca
    // como "Critical dependency". Es inofensivo siempre que WebR cargue
    // sus assets desde un `baseUrl` remoto (ver lib/webr.ts), así que
    // silenciamos la advertencia para no romper el bundle del cliente.
    config.module.exprContextCritical = false;
    return config;
  },
};

module.exports = nextConfig;
