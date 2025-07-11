import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#14A800",
        primaryTransparent: "rgba(20, 168, 0, 0.5)",
        "custom-gray": "#D9D9D9",
        "tamber-gray": "#ADADAD",
      },
    },
  },
  plugins: [require("daisyui")],
} satisfies Config;
