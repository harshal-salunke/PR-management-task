/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#effcf9",
          100: "#d7f5ed",
          500: "#0d9488",
          600: "#0f766e",
          700: "#115e59",
        },
      },
      boxShadow: { soft: "0 10px 35px rgba(15, 23, 42, 0.06)" },
    },
  },
  plugins: [],
};
