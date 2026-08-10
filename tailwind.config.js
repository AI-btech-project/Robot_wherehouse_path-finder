/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#0B0B0B',
        sidebarDark: '#111111',
        cardDark: '#151515',
        cardBorder: 'rgba(255, 255, 255, 0.05)',
        primaryCyan: '#FFD84D',      // Primary Accent
        secondaryAccent: '#FFC300',  // Secondary Accent
        secondaryGreen: '#22C55E',   // Success
        warningAmber: '#F59E0B',     // Warning
        dangerRed: '#EF4444',        // Danger
        textLight: '#FFFFFF',        // Text
        textMuted: '#8B8B8B',        // Secondary Text
        textDark: '#8B8B8B',         // Secondary Text
        // Warehouse Grid zone colors
        shelfBg: '#1C1C1C',
        shelfBorder: 'rgba(255, 255, 255, 0.08)',
        chargingBg: '#0A2919',
        chargingBorder: '#15803D',
        packingBg: '#3B2405',
        packingBorder: '#B45309',
        deliveryBg: '#2E1045',
        deliveryBorder: '#7E22CE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'card': '0 4px 12px 0 rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}


