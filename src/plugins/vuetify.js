/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css';
// eslint-disable-next-line import/no-unresolved
import 'vuetify/styles';

// Composables
import { createVuetify } from 'vuetify';
// eslint-disable-next-line import/no-unresolved
import { md3 } from 'vuetify/blueprints';

const lightTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#dbf1ff',
    primary: '#6200EE',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
};

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  theme: {
    themes: {
      lightTheme,
    },
  },
});
