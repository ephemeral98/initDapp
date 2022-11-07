import { defineConfig } from 'windicss/helpers';
import formsPlugin from 'windicss/plugin/forms';

export default defineConfig({
  darkMode: 'class',

  theme: {
    screens: {
      sm: '375px',
      md: '750px',
      lg: '1024px',
      xl: '1280px',
      pc: '1920px',
    },

    extend: {
      colors: {
        main: {
          1: 'skyblue',
          2: 'darkblue',
        },
        green: '#008c8c',
        red: '#f40',
      },

      width: {
        90: '90%',
      },
    },
  },
  plugins: [formsPlugin],
  attributify: {
    prefix: 'i:',
  },
});
