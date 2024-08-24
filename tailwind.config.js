/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      
      colors: {
        'custom-blue': '#596AFF',
        'dark-blue': '#383699',
      },
      borderRadius: {
        'SmsgBorderRadius': '8px 8px 0px 8px',
        'RmsgBorderRadius': '8px 8px 8px 0px',
      },
      height: {
        'chat-height': 'calc(100% - 70px)',
      },
      fontFamily: {
        poppin: ["poppins"],
      },
    },
    
  },
  plugins: [],
}

