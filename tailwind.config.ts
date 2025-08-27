import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Light Mode Colors (Default)
        background: "#FFFFFF",
        foreground: "#111111",
        primary: "#111111",
        secondary: "#EAEAEA",
        subtle: "#888888",
        hover: "#F9F9F9",
        // Dark Mode Colors (for future use)
        "dark-background": "#000000",
        "dark-foreground": "#EAEAEA",
        "dark-primary": "#EAEAEA",
        "dark-secondary": "#333333",
        "dark-subtle": "#888888",
        "dark-hover": "#1A1A1A",
      },
      spacing: {
        // 8px grid system
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
      },
      fontSize: {
        'title': ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        'lg': '8px',
      },
      transitionDuration: {
        '200': '200ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config; 