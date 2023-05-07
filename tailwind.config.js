/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        dance: {
        '0%,100%': {
          transform: 'rotate(0)'
        },
        '25% ':{
          transform: 'rotate(-10deg)'
        },
        '75%': {
          transform: 'rotate(10deg)'
        }
      },
      bounce: {
        '0%, 100%':{
          transform: 'translateY(-25%)',
          animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
        },
        '50%':{
          transform: 'translateY(0)',
          animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
        }
      },
      blinking: {
        'from':{
          opacity: '1',
        },
        'to':{
          opacity: '0',
        }
      },
    },
    animation:{
      dance:'dance 1s linear infinite 500ms',
      bounce: 'bounce 1s infinite',
      blinking: 'infinite blinking 1s',
    }
    },
  },
  plugins: [],
}
