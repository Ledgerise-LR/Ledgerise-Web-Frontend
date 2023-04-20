/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fade: {
          '0%, 50%, 100%': { opacity: '0' },
          '20%, 30%, 70%, 80%': { opacity: '1' },
        }
      },
      animation: {
        fade: 'fade 8s ease-in infinite',
      }
    },
  },
  plugins: [],
}