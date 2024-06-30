module.exports = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "https://596ogq4jvl.execute-api.eu-central-1.amazonaws.com/:path*",
      },
      {
        source: "/api/photos",
        destination:
          "https://lgvpsw6k5b.execute-api.eu-central-1.amazonaws.com/api/photos",
      },
      {
        source: "/fotos/:path*",
        destination:
          "https://lgvpsw6k5b.execute-api.eu-central-1.amazonaws.com/photos/:path*",
      },
    ]
  },
}
