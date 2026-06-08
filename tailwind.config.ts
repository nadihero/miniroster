import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shift: {
          D: "#3b82f6",
          N: "#6366f1",
          OFF: "#10b981",
          C: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
