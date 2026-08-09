/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { primary: "#6366f1" },
      fontFamily: { sans: ["IBM Plex Sans Arabic, Noto Sans Arabic, system-ui, sans-serif", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
