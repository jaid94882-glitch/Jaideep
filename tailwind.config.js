/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1E3A8A", // deep trust blue
          dark: "#172B63",
          light: "#EFF3FE",
        },
        success: {
          DEFAULT: "#10B981", // commission green
          light: "#ECFDF5",
          dark: "#0B8A61",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(30,58,138,0.08), 0 4px 16px rgba(30,58,138,0.06)",
      },
    },
  },
  plugins: [],
};
