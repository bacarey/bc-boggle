import { inject } from 'vue';

// eslint-disable-next-line import/prefer-default-export, jsdoc/require-jsdoc
export function injectStrict(key, fallback) {
  const resolved = inject(key, fallback);
  if (!resolved) {
    throw new Error(`Could not resolve ${key.description}`);
  }
  return resolved;
}
