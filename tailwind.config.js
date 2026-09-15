/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#151515",
        "surface-light": "#1F1F1F",

        primary: "#FFFFFF",
        secondary: "#A1A1AA",

        accent: "#84CC16",
        "accent-dark": "#65A30D",

        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",

        border: "#27272A",
      },
    },
  },

  plugins: [],
};