/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "workspace-xl": "0 24px 80px rgba(0, 0, 0, 0.38)",
      },
    },
  },
  plugins: [],
};
