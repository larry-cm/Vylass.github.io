// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  image: {
    remotePatterns: [{ protocol: "https" }],
    domains: ['https://res.cloudinary.com/']
  },
  integrations: [react()],
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel({  imageService: true }),
});