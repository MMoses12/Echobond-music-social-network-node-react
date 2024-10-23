/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",
            "./public/index.html"],
  theme: {
    extend: {
        fontFamily: {
            exo: ["'Exo 2'", 'sans-serif'],
            nunito: ['Nunito', 'sans-serif'],
        },
        colors: {
            gray: {
                200: "#9ba6a5",
                500: "#393e46",
            },
            pink: "#ff007b",
            black: {
                200: "#222831",
                300: "#0f1021",
                400: "#060608",
                500: "#000",
            },
            purple: {
                100: "#6d28d9",
                200: "#9818d6",
                300: "#ad56cd",
                400: "#9F7AEA",
                transparent :"rgba(152, 24, 214, 0.1)",
                transparent1 :"rgba(152, 24, 214, 0.3)"
            },
            blue: {
                200: "#00bbf0",
                300: "#008080",
            },
            red: { 
                200: "#dc2f2f",
                300: "#ff0000"
            },
            orange: "#f96d00"
        },
        gradientColorStops: theme => ({
            ...theme('colors'),
            'start': '#000', // start color
            'middle': '#000',
            'end': '#3b0944', // end color
        }),
    },
  },
  plugins: [],
}

