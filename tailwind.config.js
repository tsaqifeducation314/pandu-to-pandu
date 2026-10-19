/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pandu: {
          blue: '#1D7CB6',
          green: '#80A797',
          yellow: '#FDDB48',
          ink: '#18313F',
          paper: '#F6F4EB'
        }
      }
    }
  },
  plugins: []
};