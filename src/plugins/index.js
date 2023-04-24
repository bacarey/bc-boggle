/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import axios from './axios';

import { AxiosKey } from './symbols';

// eslint-disable-next-line import/prefer-default-export, jsdoc/require-jsdoc
export function registerPlugins(app) {
  loadFonts();
  app.use(vuetify);
  app.provide(AxiosKey, axios);
}
