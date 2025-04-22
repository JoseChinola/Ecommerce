/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-Green": "#1e484b",
        "primary-Blue": "#1b406c"
      }
    },
  },
  plugins: [],
}

