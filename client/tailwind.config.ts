import { nextui } from "@nextui-org/react";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "biomedata-blue": "#1279F2",
        "biomedata-purple": "#A34CF5",
        "biomedata-gray": "#F4F4F4",
        "biomedata-hover": "#EBEBEB",
        "biomedata-active": "#D2E2FE",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
