/** @type {import('tailwindcss').Config} */
export default {
    corePlugins: {
        preflight: false
    },
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                geist: ["Geist", "sans-serif"]
            }
        }
    },
    plugins: []
};
