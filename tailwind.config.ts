import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f2',
          100: '#fde5e6',
          200: '#f9cfd2',
          300: '#f3a4a9',
          400: '#e56168',
          500: '#cc2932',
          600: '#B30D12', // Primary requested by user: #B30D12
          700: '#940b0f',
          800: '#7a0e12',
          900: '#671114',
          950: '#380406',
          DEFAULT: '#B30D12',
        },
        secondary: {
          50: '#f0f4f9',
          100: '#dee7f2',
          200: '#c3d5e9',
          300: '#99bbdc',
          400: '#689ac9',
          500: '#467eb4',
          600: '#34659b',
          700: '#2b517e',
          800: '#264569',
          900: '#1B2A4A', // Secondary Navy blue
          950: '#0F1A2E', // Deep luxury navy
          DEFAULT: '#1B2A4A',
        },
        navy: {
          50: '#f0f4f9',
          100: '#dee7f2',
          200: '#c3d5e9',
          300: '#99bbdc',
          400: '#689ac9',
          500: '#467eb4',
          600: '#34659b',
          700: '#2b517e',
          800: '#264569',
          900: '#1B2A4A',
          950: '#0B1322', // Ultra-deep navy background
          DEFAULT: '#1B2A4A',
        },
      },
      fontFamily: {
        sans: ['var(--font-roboto)', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'premium': '0 4px 20px -2px rgba(15, 26, 46, 0.06), 0 2px 6px -1px rgba(15, 26, 46, 0.03)',
        'premium-lg': '0 10px 30px -4px rgba(15, 26, 46, 0.08), 0 4px 12px -2px rgba(15, 26, 46, 0.04)',
        'glow-primary': '0 0 25px -5px rgba(179, 13, 18, 0.35)',
        'glow-navy': '0 0 25px -5px rgba(27, 42, 74, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
