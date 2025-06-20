/// <reference path="../.astro/types.d.ts" />

// typos para las variables de entorno
interface ImportMetaEnv {
  readonly SECRET_ASTRO_DB_REMOTE_URL: string;
  readonly SECRET_ASTRO_DB_APP_TOKEN: string;
  readonly PUBLIC_IMG_DEFAULT: string;
  readonly PUBLIC_LINKEDIN: string;
  readonly PUBLIC_DISCORD: string;
  readonly PUBLIC_GITHUB: string;
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    lang: string;
    posts?: Array<{
      username: string;
      userId: string;
      postId: string;
      title: string;
      userUrl: string;
      content: string;
      imgUrl: string;
      postDate: string;
    }>;
    urls?: {
      github: string;
      download: string;
      discord: string;
      project: string;
    };
  }
}