/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0A2342",
        secondary: "#FFD700",
        background: "#F9FAFB",
      },
    },
  },
  plugins: [
    // --- NOVO PLUGIN PARA OCULTAR SCROLLBAR ---
    function ({ addUtilities }) {
      const newUtilities = {
        '.no-scrollbar': {
          /* Para Chrome, Safari e Opera */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          /* Para IE e Edge */
          '-ms-overflow-style': 'none',
          /* Para Firefox */
          'scrollbar-width': 'none',
        },
      }
      addUtilities(newUtilities)
    },
    // ------------------------------------------
  ],
};