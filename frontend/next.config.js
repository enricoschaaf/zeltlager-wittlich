module.exports = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
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
        source: "/api/register",
        destination:
          "https://0a6yerljme.execute-api.eu-central-1.amazonaws.com/register",
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
