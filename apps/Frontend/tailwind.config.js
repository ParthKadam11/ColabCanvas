/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "top-[-10%]", "left-[-10%]", "bottom-[-12%]", "right-[-8%]", "top-[30%]", "left-[60%]",
    "w-[40vw]", "h-[40vw]", "w-[36vw]", "h-[36vw]", "w-[28vw]", "h-[28vw]",
    "blur-3xl", "opacity-40", "opacity-30", "opacity-10",
    "bg-zinc-200", "bg-zinc-300", "bg-zinc-800", "bg-zinc-700", "bg-blue-600",
    "-z-10"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
