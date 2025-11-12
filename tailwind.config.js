export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F172A",
        surface: "#1E293B",
        primary: "#06B6D4",
        secondary: "#6366F1",
        riskLow: "#22C55E",
        riskMedium: "#F59E0B",
        riskHigh: "#EF4444",
      },
    },
  },
  plugins: [],
};
