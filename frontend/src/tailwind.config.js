// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          upwork: {
            500: "#1DBF73",
            600: "#1D9147",
          },
        },
        keyframes: {
          gradient: {
            "0%, 100%": { "background-position": "0% 50%" },
            "50%":      { "background-position": "100% 50%" },
          },
        },
        animation: {
          "gradient-xy": "gradient 8s ease infinite",
        },
        backgroundSize: {
          '200%': '200% 200%',
        },
      },
    },
    plugins: [],
  }
  