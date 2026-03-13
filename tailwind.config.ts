import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f0fcff",
          100: "#d0f6fd",
          200: "#a1edfb",
          300: "#67ddfa",
          400: "#38cff5",
          500: "#0fbde8",
          600: "#0a9bc0",
          700: "#0a7a99",
          800: "#0c5f77",
          900: "#0d4d62",
        },
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        bounceIn: {
          "0%":   { opacity: "0", transform: "scale(0.85) translateY(8px)" },
          "60%":  { opacity: "1", transform: "scale(1.04) translateY(-2px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        "fade-in-up":    "fadeInUp 0.35s ease-out both",
        "fade-in":       "fadeIn 0.25s ease-out both",
        "slide-in-left": "slideInLeft 0.3s ease-out both",
        "scale-in":      "scaleIn 0.2s ease-out both",
        "bounce-in":     "bounceIn 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
export default config;
