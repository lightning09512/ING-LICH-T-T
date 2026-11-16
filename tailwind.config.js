/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neoYellow: '#FFE566',
        neoPink: '#FF94B9',
        neoGreen: '#6EE7B7',
        neoCyan: '#67E8F9',
        neoPurple: '#C4B5FD',
        neoOrange: '#FDBA74',
        neoBg: '#FFFDF5',
        neoDark: '#121212',
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-lg': '7px 7px 0px 0px #000000',
        'neo-sm': '2px 2px 0px 0px #000000',
      },
      fontFamily: {
        comic: ['"Nunito"', '"Baloo 2"', 'system-ui', 'sans-serif'],
        heading: ['"Baloo 2"', '"Nunito"', 'system-ui', 'sans-serif'],
        pixel: ['"VT323"', 'monospace'],
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-8px)' },
          '40%, 80%': { transform: 'translateX(8px)' },
        }
      },
      animation: {
        wiggle: 'wiggle 3s ease-in-out infinite',
        bounceSlow: 'bounceSlow 5s ease-in-out infinite',
        shake: 'shake 0.4s ease-in-out',
      }
    },
  },
  plugins: [],
}
