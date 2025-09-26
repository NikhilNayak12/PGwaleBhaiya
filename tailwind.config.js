/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef8ff",
          100: "#d9f0ff",
          300: "#7dd3fc",
          500: "#0ea5e9",   // main blue
          600: "#0b86cc",
          700: "#0769a6",
        },
        accent: "#ffd93d",   // brighter yellow
        card: "#ffffff",
        muted: "#64748b"
      },
      boxShadow: {
        'soft-lg': '0 12px 30px rgba(14,30,37,0.08)',
        'inner-3': 'inset 0 6px 12px rgba(0,0,0,0.12)'
      },
      borderRadius: {
        'xl': '1rem'
      }
    },
  },
  plugins: [],
}
