// uno.config.ts
import { defineConfig } from 'unocss';
import transformerDirectives from '@unocss/transformer-directives';
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx';
import transformerVariantGroup from '@unocss/transformer-variant-group';

export default defineConfig({
  transformers: [transformerDirectives(), transformerAttributifyJsx(), transformerVariantGroup()],

  theme: {
    breakpoints: {
      sm: '375px',
      md: '750px',
      lg: '1024px',
      xl: '1280px',
      pc: '1920px',
    },

    colors: {
      green: '#008c8c',
      red: '#f40',
    },
  },

  // 常用css简化rem单位: w-30 即：width: 30rem
  rules: [
    [/^w-([\.\d]+)$/, ([_, num]) => ({ width: `${num}rem` })],
    [/^min-w-([\.\d]+)$/, ([_, num]) => ({ 'min-width': `${num}rem` })],
    [/^max-w-([\.\d]+)$/, ([_, num]) => ({ 'max-width': `${num}rem` })],
    [/^h-([\.\d]+)$/, ([_, num]) => ({ height: `${num}rem` })],
    [/^min-h-([\.\d]+)$/, ([_, num]) => ({ 'min-height': `${num}rem` })],
    [/^max-h-([\.\d]+)$/, ([_, num]) => ({ 'max-height': `${num}rem` })],
    [/^text-([\.\d]+)$/, ([_, num]) => ({ 'font-size': `${num}rem` })],

    [/^p-([\.\d]+)$/, ([_, num]) => ({ padding: `${num}rem` })],
    [/^pt-([\.\d]+)$/, ([_, num]) => ({ 'padding-top': `${num}rem` })],
    [/^pl-([\.\d]+)$/, ([_, num]) => ({ 'padding-left': `${num}rem` })],
    [/^pr-([\.\d]+)$/, ([_, num]) => ({ 'padding-right': `${num}rem` })],
    [/^pb-([\.\d]+)$/, ([_, num]) => ({ 'padding-bottom': `${num}rem` })],
    [
      /^px-([\.\d]+)$/,
      ([_, num]) => ({ 'padding-left': `${num}rem`, 'padding-right': `${num}rem` }),
    ],
    [
      /^py-([\.\d]+)$/,
      ([_, num]) => ({ 'padding-top': `${num}rem`, 'padding-bottom': `${num}rem` }),
    ],

    [/^m-([\.\d]+)$/, ([_, num]) => ({ margin: `${num}rem` })],
    [/^mt-([\.\d]+)$/, ([_, num]) => ({ 'margin-top': `${num}rem` })],
    [/^ml-([\.\d]+)$/, ([_, num]) => ({ 'margin-left': `${num}rem` })],
    [/^mr-([\.\d]+)$/, ([_, num]) => ({ 'margin-right': `${num}rem` })],
    [/^mb-([\.\d]+)$/, ([_, num]) => ({ 'margin-bottom': `${num}rem` })],

    [/^top-([\.\d]+)$/, ([_, num]) => ({ top: `${num}rem` })],
    [/^left-([\.\d]+)$/, ([_, num]) => ({ left: `${num}rem` })],
    [/^right-([\.\d]+)$/, ([_, num]) => ({ right: `${num}rem` })],
    [/^bottom-([\.\d]+)$/, ([_, num]) => ({ bottom: `${num}rem` })],

    ['border', { 'border-style': 'solid' }],
    ['border-t', { 'border-top-style': 'solid' }],
    ['border-l', { 'border-left-style': 'solid' }],
    ['border-r', { 'border-right-style': 'solid' }],
    ['border-b', { 'border-bottom-style': 'solid' }],
    [/^border-([\.\d]+)$/, ([_, num]) => ({ 'border-width': `${num}rem` })],
    [/^rounded-([\.\d]+)$/, ([_, num]) => ({ 'border-radius': `${num}rem` })],

    ['flex-center', { display: 'flex', 'justify-content': 'center', 'align-items': 'center' }],
    ['disable', { filter: 'grayscale(98%)' }],
  ],
});
