import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#faf8ff",
        accent: "#6d28d9",
        accentSoft: "#f3ebff",
        borderSoft: "#e7def8",
      },
      boxShadow: {
        card: "0 10px 30px rgba(15, 23, 42, 0.05)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;

