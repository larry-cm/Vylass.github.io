/// <reference path="../.astro/types.d.ts" />

// typos para las variables de entorno
interface ImportMetaEnv {
  readonly SECRET_ASTRO_DB_REMOTE_URL: string;
  readonly SECRET_ASTRO_DB_APP_TOKEN: string;
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    lang: string;
  }
}