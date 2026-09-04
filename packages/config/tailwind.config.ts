import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    '../../apps/web/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../apps/admin/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Theme Base
        bg: {
          primary: '#0D0D0D',
          secondary: '#1A1A1A',
          tertiary: '#252525',
          elevated: '#2D2D2D',
          overlay: 'rgba(0, 0, 0, 0.7)',
          'overlay-light': 'rgba(0, 0, 0, 0.4)',
        },
        // Gold / Altın
        gold: {
          primary: '#D4A843',
          light: '#E8C56D',
          dark: '#B89038',
          subtle: 'rgba(212, 168, 67, 0.15)',
          glow: 'rgba(212, 168, 67, 0.3)',
        },
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          muted: '#808080',
          'on-gold': '#0D0D0D',
          inverse: '#0D0D0D',
        },
        // Semantic
        success: {
          DEFAULT: '#10B981',
          bg: 'rgba(16, 185, 129, 0.15)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: 'rgba(245, 158, 11, 0.15)',
        },
        error: {
          DEFAULT: '#EF4444',
          bg: 'rgba(239, 68, 68, 0.15)',
        },
        info: {
          DEFAULT: '#3B82F6',
          bg: 'rgba(59, 130, 246, 0.15)',
        },
        // Border
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          DEFAULT: 'rgba(255, 255, 255, 0.15)',
          focus: '#D4A843',
          error: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
      },
      borderRadius: {
        none: '0',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
        md: '0 4px 12px rgba(0, 0, 0, 0.4)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
        xl: '0 16px 48px rgba(0, 0, 0, 0.6)',
        gold: '0 0 20px rgba(212, 168, 67, 0.3)',
        'gold-lg': '0 0 40px rgba(212, 168, 67, 0.3)',
        inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      spacing: {
        0: '0',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
      },
      transitionTimingFunction: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      zIndex: {
        base: '1',
        dropdown: '100',
        sticky: '200',
        fixed: '300',
        'modal-backdrop': '400',
        modal: '500',
        toast: '600',
        tooltip: '700',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      maxWidth: {
        container: '1200px',
        content: '680px',
      },
      height: {
        header: '56px',
        'bottom-nav': '72px',
        'bottom-nav-safe': 'calc(72px + env(safe-area-inset-bottom))',
      },
      minHeight: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [],
  safelist: [
    // Dynamic classes that might not be detected
    { pattern: /bg-(bg|gold|text|success|warning|error|info)-./ },
    { pattern: /text-(bg|gold|text|success|warning|error|info)-./ },
    { pattern: /border-(bg|gold|text|success|warning|error|info|border)-./ },
    { pattern: /shadow-(sm|md|lg|xl|gold|gold-lg|inner)/ },
    { pattern: /animate-(fade|slide|scale|bounce)-./ },
  ],
};

export default config;