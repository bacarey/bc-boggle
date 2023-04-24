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

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  blueprint: md3,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6',
        },
      },
    },
  },
});
