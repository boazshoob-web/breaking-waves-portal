import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ocean-blue': '#2E75B6',
        'success-green': '#27AE60',
        'warning-orange': '#E67E22',
        'error-red': '#E74C3C',
        'gray-bg': '#F2F2F2',
      },
      fontFamily: {
        rubik: ['Rubik', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
