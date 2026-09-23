import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        blood: "#ff1a1a",
        crimson: "#8b0000",
        void: "#050000",
      },
      fontFamily: {
        display: ["var(--font-display)"],
      },
      keyframes: {
        flicker: {
          "0%,100%": { opacity: "1" },
          "45%": { opacity: "0.85" },
          "50%": { opacity: "0.4" },
          "55%": { opacity: "0.9" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(255,26,26,0.35), 0 0 60px rgba(255,26,26,0.15)" },
          "50%": { boxShadow: "0 0 35px rgba(255,26,26,0.6), 0 0 90px rgba(255,26,26,0.25)" },
        },
        lightning: {
          "0%,92%,100%": { opacity: "0" },
          "93%": { opacity: "0.8" },
          "94%": { opacity: "0" },
          "96%": { opacity: "0.5" },
          "97%": { opacity: "0" },
        },
      },
      animation: {
        flicker: "flicker 4s infinite",
        glowPulse: "glowPulse 3s ease-in-out infinite",
        lightning: "lightning 7s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
