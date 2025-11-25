/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#33ffff",
                secondary: "#00cccc",
                last : "#e6ffff",
                success: "#00FF00",
                info: "#00FF00",
                warning: "#00FF00",
                danger: "#00FF00",
            }
        },
    },
    plugins: [],
}