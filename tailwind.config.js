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
    screens: {
      'xs': '400px',
      'sm': '576px',
      'md': '960px',
      'lg': '1440px',
    },
    extend: {
      skew: {
        '45': '45deg',
      },
      keyframes: {
        fade: {
          '0%, 50%, 100%': { opacity: '0' },
          '20%, 30%, 70%, 80%': { opacity: '1' },
        }
      },
      animation: {
        fade: 'fade 8s ease-in infinite',
      },
      fontFamily: {
        "playfair": ["Playfair Display", "serif"]
      },
      spacing: {
        '128': '42rem',
        '108': '36rem',
        '100': '32rem',
        '98': '28rem',
      },
      fontSize: {
        'xxs': '8px'
      }
    },
  },
  plugins: [],
}