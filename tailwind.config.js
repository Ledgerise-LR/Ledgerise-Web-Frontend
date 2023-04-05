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
          '0%, 20%, 80%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      },
      animation: {
        fade: 'fade 3s ease-in 10000',
      }
    },
  },
  plugins: [],
}