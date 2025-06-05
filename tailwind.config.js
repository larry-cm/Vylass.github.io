import { mtConfig } from '@material-tailwind/react'
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}",
        "./node_modules/@material-tailwind/react/**/*.{js,ts,jsx,tsx}"
    ],
    plugins: [mtConfig]
}