import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF9F6",
        sidebar: "#F5F4F2",
        primary: "#1A1A1A",
        secondary: "#6B6B6B",
        accent: "#E07B54",
        border: "#E5E4E2",
        "input-bg": "#FFFFFF",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        signifier: ["var(--font-signifier)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
