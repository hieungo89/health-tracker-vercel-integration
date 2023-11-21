/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#00171F",
        "primary-light": "#003459",
        "secondary-dark": "#007EA7",
        "secondary-light": "#00A8E8",
        "navy-blue": "#05445E",
        "blue-grotto": "#189AB4",
        "blue-green": "#75E6DA",
        "baby-blue": "#D4F1F4",
        warning: "#FFBD44",
        destructive: "#FF605C",
        success: "#00CA4E",
        dark: "#000000",
        "grey-10": "#021426",
        "grey-20": "#2a333c",
        "grey-30": "#586874",
        "grey-40": "#788591",
        "grey-50": "#a2acb3",
        "grey-60": "#b9c1c6",
        "grey-70": "#d6dde0",
        "grey-80": "#f3f4f4",
        "grey-90": "#f6f8f9",
        light: "#ffffff",
      },
      fontFamily: {
        trebuchet: "Trebuchet",
        georgia: "Georgia",
        arial: "Arial",
        times: "Times New Roman",
        helvetica: "Helvetica Neue",
        //* fonts included - font-sans / font-serif / font-mono
      },
    },
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }
      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }
      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }
      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }
      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
      xs: { max: "479px" },
      // => @media (max-width: 479px) { ... }
    },
  },
  plugins: [],
};
