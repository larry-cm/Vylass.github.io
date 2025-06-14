// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

import clerk from "@clerk/astro";
import { dark } from '@clerk/themes'
import { esMX } from '@clerk/localizations'
// https://astro.build/config
export default defineConfig({
  integrations: [react(), clerk({
    appearance: {
      baseTheme: dark,
    }
    , localization: esMX
  })],
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: vercel({ imageService: true }),
  experimental: {
    responsiveImages: true
  },
  image: {
    // Ejemplo: Permite la optimización de imágenes remotas desde un solo dominio
    domains: ['astro.build'],
    remotePatterns: [{
      protocol: 'https',
      hostname: '**.public.blob.vercel-storage.com',
    }, {
      protocol: 'https', hostname: 'img.clerk.com'
    }]
  },
});