/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Class-based dark mode — toggled by ThemeProvider
  theme: {
    extend: {
      colors: {
        // ── Brand Identity (from logo.png gradient) ──
        brand: {
          start: "#4361EE",  // Electric Blue (logo left)
          mid:   "#6B48F0",  // Indigo Violet (logo centre)
          end:   "#7B2FBE",  // Deep Purple (logo right)
        },
        // ── Semantic Surface Tokens (CSS-variable-backed) ──
        bg: {
          primary: "rgb(var(--bg-primary) / <alpha-value>)",
          surface: "rgb(var(--bg-surface) / <alpha-value>)",
          elevated:"rgb(var(--bg-elevated) / <alpha-value>)",
        },
        text: {
          primary:   "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
        },
        border: {
          subtle: "rgb(var(--border-subtle) / <alpha-value>)",
        },
      },
      backgroundImage: {
        // Full brand gradient (buttons, badges, active states)
        "brand-gradient":      "linear-gradient(135deg, #4361EE 0%, #7B2FBE 100%)",
        // Soft tint version (sidebar active bg, hover glows)
        "brand-gradient-soft": "linear-gradient(135deg, #4361EE18 0%, #7B2FBE18 100%)",
        // Radial glow for hero sections
        "brand-glow":          "radial-gradient(ellipse at 50% 0%, #4361EE33 0%, transparent 70%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":        "fadeIn 0.2s ease-out",
        "slide-up":       "slideUp 0.2s ease-out",
        "slide-in-right": "slideInRight 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
