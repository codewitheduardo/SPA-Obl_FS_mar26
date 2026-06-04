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
        suave: "0 18px 45px rgba(120, 53, 15, 0.08)",
        card: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "card-md": "0 1px 4px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.08)",
        "card-lg": "0 8px 24px 0 rgb(0 0 0 / 0.08)",
        modal: "0 20px 60px -8px rgb(0 0 0 / 0.22), 0 6px 20px -4px rgb(0 0 0 / 0.08)",
        btn: "0 1px 2px 0 rgb(0 0 0 / 0.08)",
        sidebar: "1px 0 0 0 rgb(0 0 0 / 0.05)",
      },
    },
  },
  plugins: [],
};
