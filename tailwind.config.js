/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#06B6D4",
        secondary: "#6366F1",
        surface: "#F8FAFC",
        danger: "#EF4444",
        warning: "#F59E0B",
        success: "#22C55E"
      },
      boxShadow: {
        'soft': '0 8px 24px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}
