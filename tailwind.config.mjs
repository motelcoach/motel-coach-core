/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // The new "Oatmeal & Olive" aesthetic
        brand: {
          50: '#F9F9F8',  // The warm off-white/sand background
          200: '#e7e5e4', // Warm stone border color
          500: '#4A554E', // The primary Olive accent (Buttons, Links)
          600: '#3d4640', // Darker Olive for hover states
          900: '#1c1917', // Deep stone for primary text (softer than pure black)
        },
      },
      fontFamily: {
        // Overriding the default sans with our new sophisticated editorial font
        sans: ['Instrument Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), 
  ],
};