/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Vertex Brand Palette
        navy: {
          DEFAULT: '#08294A',
          deep: '#08294A',
          900: '#061e38',
          800: '#08294A',
          700: '#0c3560',
        },
        blue: {
          DEFAULT: '#0D4775',
          dark: '#0D4775',
          accent: '#1493B8',
          soft: '#B8E9F2',
        },
        teal: {
          DEFAULT: '#00B5A4',
          primary: '#00B5A4',
          dark: '#008F87',
          bright: '#27C6B8',
          light: '#68E0D6',
          pale: '#DDF5F4',
        },
        // Semantic Status Colors from Brand Guide
        success: {
          DEFAULT: '#00A878',
          light: '#e6f7f2',
          border: '#a3e8d2',
        },
        warning: {
          DEFAULT: '#E59A28',
          light: '#fdf4e7',
          border: '#f8d8a7',
        },
        error: {
          DEFAULT: '#E65B51',
          light: '#fdeff0',
          border: '#f8a29d',
        },
        info: {
          DEFAULT: '#1493B8',
          light: '#eaf6f9',
          border: '#b8e3ed',
        },
        // Surfaces & Backgrounds
        surface: {
          DEFAULT: '#EAF3F8',
          bg: '#F4F8FC',
          card: '#FFFFFF',
        },
        // Typography Colors
        heading: '#102747',
        bodyText: '#334B68',
        mutedText: '#71849A',

        // Brand Aliases for backwards compatibility with UI components
        brand: {
          DEFAULT: 'var(--color-primary-teal, #00B5A4)',
          50: '#DDF5F4',
          100: '#B8E9F2',
          500: '#00B5A4',
          600: '#008F87',
          700: '#0D4775',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(8, 41, 74, 0.04)',
        'soft': '0 1px 3px 0 rgba(8, 41, 74, 0.05), 0 1px 2px -1px rgba(8, 41, 74, 0.03)',
        'soft-md': '0 4px 6px -1px rgba(8, 41, 74, 0.06), 0 2px 4px -2px rgba(8, 41, 74, 0.04)',
        'soft-lg': '0 10px 15px -3px rgba(8, 41, 74, 0.07), 0 4px 6px -4px rgba(8, 41, 74, 0.04)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
