/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Underwater Theme Color Palette
        ocean: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff', // Primary blue
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
          950: '#001329'
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee', // Neon cyan
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63'
        },
        navy: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e', // Deep navy
          950: '#082f49'
        },
        deepSea: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Dark blue-gray
          900: '#0f172a', // Almost black
          950: '#020617'
        }
      },
      backgroundImage: {
        'underwater-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0c4a6e  50%, #164e63 75%, #0f172a 100%)',
        'ocean-depth': 'linear-gradient(180deg, #164e63 0%, #0c4a6e 50%, #0f172a 100%)',
        'cyber-glow': 'linear-gradient(45deg, #06b6d4, #22d3ee, #67e8f9)',
        'submarine-path': 'linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.3) 50%, transparent 100%)'
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'title': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subtitle': ['1.5rem', { lineHeight: '1.4' }]
      },
      boxShadow: {
        'glow': '0 0 20px rgba(34, 211, 238, 0.3)',
        'glow-lg': '0 0 40px rgba(34, 211, 238, 0.4)',
        'underwater': '0 8px 32px rgba(15, 23, 42, 0.4)',
        'depth': '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 4s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'submarine': 'submarine 2s ease-in-out',
        'drift': 'drift 8s ease-in-out infinite',
        'wave': 'wave 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        ripple: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' }
        },
        'glow-pulse': {
          '0%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.6)' }
        },
        submarine: {
          '0%': { transform: 'translateX(-100vw) translateY(20px)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100vw) translateY(-20px)', opacity: '0' }
        },
        drift: {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '33%': { transform: 'translate(30px, -30px) rotate(1deg)' },
          '66%': { transform: 'translate(-20px, 20px) rotate(-1deg)' }
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(-50px)' }
        }
      },
      backdropBlur: {
        'underwater': '12px'
      }
    },
  },
  plugins: [],
}