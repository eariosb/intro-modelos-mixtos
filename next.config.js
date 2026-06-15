/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTA: 'output: standalone' se removio porque en Vercel provoca que el
  // tracing empaquete node_modules completo (incluyendo webr, ~59MB) dentro
  // de cada funcion serverless, lo que suele causar fallos de deploy tras
  // un build exitoso (limite de tamano de funcion). Vercel ya usa su propio
  // empaquetado optimizado sin necesidad de 'standalone'.
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/webr/**/*',
      ],
    },
  },
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
    // El build de webr (webr.cjs) usa require() con una ruta dinamica
    // para localizar sus workers/WASM en tiempo de ejecucion. Webpack no
    // puede resolver esa expresion estaticamente y la marca como
    // "Critical dependency". Es inofensivo siempre que WebR cargue sus
    // assets desde un baseUrl remoto (ver lib/webr.ts), asi que
    // silenciamos la advertencia para no romper el bundle del cliente.
    config.module.exprContextCritical = false;
    return config;
  },
};

module.exports = nextConfig;
