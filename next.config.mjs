/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // Garante que os PDFs lidos em runtime entrem no bundle da função serverless
  outputFileTracingIncludes: {
    "/api/webhook/kiwify": ["./private/pdfs/**"],
  },
};

export default nextConfig;
