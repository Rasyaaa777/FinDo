/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F4EE',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#EAE6DC',
          dark: '#121212',
        },
        ink: {
          primary: '#000000',
          secondary: '#4B4B4B',
          inverse: '#FFFFFF',
        },
        primary: {
          DEFAULT: '#FFE600',
          hover: '#FFD000',
        },
        accent: {
          teal: '#00E5CC',
          magenta: '#FF2A85',
        },
        semantic: {
          success: '#00D26A',
          'success-bg': '#D4F8E8',
          danger: '#FF4B4B',
          'danger-bg': '#FFE4E4',
          warning: '#FFAA00',
          'warning-bg': '#FFF3D6',
          info: '#00B4D8',
        }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #000000',
        'neo': '4px 4px 0px #000000',
        'neo-md': '4px 4px 0px #000000',
        'neo-lg': '6px 6px 0px #000000',
        'neo-xl': '8px 8px 0px #000000',
        'neo-hover': '5px 5px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
