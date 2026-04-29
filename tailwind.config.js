/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ['./*.{html,js,jsx,ts,tsx,mdx}', './src/**/*.{html,js,jsx,ts,tsx,mdx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
