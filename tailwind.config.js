/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // darkMode: ['selector', 'class'],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        olivine: {
          50: '#f3f7f2',
          100: '#e3ecdf',
          200: '#c7d9c1',
          300: '#8eb486',
          400: '#709e69',
          500: '#4f8049',
          600: '#3a6536',
          700: '#2e512b',
          800: '#264124',
          900: '#1f361e',
          950: '#101e10',
        },
      },
    },
    fontFamily: {
      sans: [
        'Poppins',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
      ],
    },
  },
};
