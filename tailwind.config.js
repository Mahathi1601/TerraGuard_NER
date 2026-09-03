/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F5F8',
          100: '#E1EDF2',
          200: '#C7DDE6',
          300: '#A4C6D4',
          400: '#7C9BA6',
          500: '#5A7F8E',
          600: '#466674',
          700: '#37505C',
          800: '#2A3C45',
          900: '#1C2930',
        },
        surface: {
          base: '#FAFAF9',
          card: '#FFFFFF',
          sidebar: '#F2F6F8',
          subtle: '#F6F6F5',
        },
        risk: {
          critical: '#B5544B',
          'critical-bg': '#FDF6F5',
          'critical-border': '#F4D8D5',
          high: '#C97D5B',
          'high-bg': '#FDF8F5',
          'high-border': '#F7DFD4',
          moderate: '#D8B863',
          'moderate-bg': '#FDFBF4',
          'moderate-border': '#F6EDD0',
          low: '#84A98C',
          'low-bg': '#F6FAF7',
          'low-border': '#DBEADB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'panel': '0 4px 12px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
