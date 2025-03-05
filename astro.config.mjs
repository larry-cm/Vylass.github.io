// @ts-check
import { defineConfig } from 'astro/config';


import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  adapter: netlify({ edgeMiddleware: true, imageCDN: true, cacheOnDemandPages: true }),
  vite: {
    plugins: [tailwindcss()],
  },

});