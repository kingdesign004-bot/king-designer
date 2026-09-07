// tailwind.config.ts - تحديث نظام الألوان الكامل
export default {
  theme: {
    extend: {
      colors: {
        // الألوان الذهبية الأساسية
        gold: {
          50: '#fef9f3',
          100: '#fef3e6',
          200: '#fce8cc',
          300: '#fad7b3',
          400: '#f7b180',
          500: '#f5a04d',
          600: '#d97a00',
          700: '#b35c00',
          800: '#8c4600',
          900: '#663300',
        },
        // الألوان الإيفوري والكريمي
        ivory: {
          50: '#fffef9',
          100: '#fffcf5',
          200: '#fef8e8',
          300: '#fef4dc',
          400: '#fdefc4',
          500: '#fceaac',
          600: '#e8d08f',
          700: '#d4b66f',
          800: '#b39550',
          900: '#8f7436',
        },
        // الألوان الفحمية
        charcoal: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d1d1d1',
          400: '#b3b3b3',
          500: '#949494',
          600: '#6f6f6f',
          700: '#4a4a4a',
          800: '#2d2d2d',
          900: '#1a1a1a',
        },
      },
      backgroundImage: {
        'vip-gradient': 'linear-gradient(135deg, #f5a04d 0%, #d97a00 100%)',
        'pro-gradient': 'linear-gradient(135deg, #8f7436 0%, #663300 100%)',
        'hand-pattern': 'url(\'data:image/svg+xml...\')',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
