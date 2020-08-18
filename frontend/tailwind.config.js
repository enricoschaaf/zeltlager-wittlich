// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  future: "all",
  experimental: "all",
  purge: [
    "./pages/**/*.tsx",
    "./components/**/*.tsx",
    "./tailwindcss/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/ui")],
}
