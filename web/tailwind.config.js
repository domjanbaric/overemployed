/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3B82F6', dark: '#60A5FA' },
        surface: { DEFAULT: '#ffffff', dark: '#1f2937' },
        onSurface: { DEFAULT: '#111827', dark: '#e5e7eb' },
        error: { DEFAULT: '#EF4444', dark: '#F87171' }
      }
    }
  },
  plugins: []
}
