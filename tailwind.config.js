/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      
      // that is animation class
      animation: {
        fade: 'fadeIn 300ms ease-in-out',
      },

      // that is actual animation
      keyframes: theme => ({
        fadeIn: {
          '0%': { opacity:'0' },
          '100%': { opacity:'1' },
        },
      }),
    },
  },
  plugins: [],
}

