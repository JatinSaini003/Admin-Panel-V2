/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: '#F3642A',
        secondary: '#FFBB38',
        accent: '#00B69B',
        base: '#FFFFFF',
        muted: '#BEBAB9',
        light: '#605E5E',
        danger: '#FF0000',

        // UI Surface
        background: {
          default: '#0B1E29',
          light: '#243139',
          active: '#2C3B44',
        },

        border: {
          default: '#605E5E',
          dark: "#EAECF0",
          muted: '#444444',
        },

        // Other
        success: "#00B69B",
        successLite: '#94E9B8',
        warning: '#FFBB38',
        error: '#FF0000',
        reject: "#FF4D4D",
        link: "#0070FF"
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },

      fontFamily: {
        berlin: ["Berlin Sans FB", 'sans-serif'],
        gilroyMedium: ["Gilroy-Medium", 'sans-serif'],
        gilroyRegular: ["Gilroy-Regular", 'sans-serif'],
        gilroySemiBold: ["Gilroy-SemiBold", 'sans-serif'],
        gilroySemiBoldItalic: ["Gilroy-SemiBold-Italic", 'sans-serif'],
        gilroyBold: ["Gilroy-Bold", 'sans-serif'],
        gilroyLight: ["Gilroy-Light", 'sans-serif'],
        gilroyItalic: ["Gilroy-RegularItalic", 'sans-serif'],
      },

    },
  },
  plugins: [],
}