/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        mut: "var(--mut)",
        acc: "var(--acc)",
        line: "var(--line)",
      },
      fontFamily: {
        display: ['"Archivo"', "system-ui", "sans-serif"],
        mono: ['"Spline Sans Mono"', "ui-monospace", "monospace"],
        sans: ['"Schibsted Grotesk"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
