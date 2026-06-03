/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Georgia", "ui-serif", "serif"],
      },
      boxShadow: {
        suave: "0 18px 45px rgba(120, 53, 15, 0.10)",
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 16px 0 rgb(0 0 0 / 0.08), 0 2px 6px -1px rgb(0 0 0 / 0.05)",
        modal: "0 20px 60px -10px rgb(0 0 0 / 0.25), 0 8px 24px -6px rgb(0 0 0 / 0.12)",
      },
    },
  },
  plugins: [],
};
