/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "secondary-container": "#00d9ff",
        "background": "#0d112a",
        "tertiary-container": "#ffc9d6",
        "surface-tint": "#00e293",
        "on-primary": "#003921",
        "surface-variant": "#2f334e",
        "outline-variant": "#3b4a40",
        "on-secondary-container": "#005b6c",
        "primary-fixed": "#50ffaf",
        "primary-fixed-dim": "#00e293",
        "tertiary": "#fff0f2",
        "on-background": "#dee0ff",
        "secondary": "#aeecff",
        "on-tertiary-fixed-variant": "#8c0a46",
        "on-secondary-fixed": "#001f26",
        "tertiary-fixed-dim": "#ffb1c5",
        "on-error": "#690005",
        "primary": "#cdffde",
        "inverse-surface": "#dee0ff",
        "surface-container-lowest": "#080c25",
        "on-surface-variant": "#b9cbbd",
        "error": "#ffb4ab",
        "on-primary-fixed": "#002111",
        "surface-container-low": "#161a33",
        "surface-container-highest": "#2f334e",
        "surface": "#0d112a",
        "inverse-primary": "#006c44",
        "surface-container-high": "#242842",
        "on-tertiary-fixed": "#3f001b",
        "error-container": "#93000a",
        "tertiary-fixed": "#ffd9e1",
        "on-secondary": "#003641",
        "primary-container": "#00f5a0",
        "on-primary-container": "#006b43",
        "surface-container": "#1a1e37",
        "on-error-container": "#ffdad6",
        "outline": "#849588",
        "inverse-on-surface": "#2b2f49",
        "secondary-fixed": "#aeecff",
        "on-surface": "#dee0ff",
        "on-tertiary": "#650030",
        "surface-dim": "#0d112a",
        "surface-bright": "#343752",
        "on-secondary-fixed-variant": "#004e5d",
        "on-tertiary-container": "#ab295c",
        "on-primary-fixed-variant": "#005232",
        "secondary-fixed-dim": "#00d9ff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        "headline": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Inter", "sans-serif"]
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'text-gradient': 'text-gradient 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'text-gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
