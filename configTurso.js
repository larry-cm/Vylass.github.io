import { createClient } from "@libsql/client";

export const turso = createClient({
    url: import.meta.env.SECRET_ASTRO_DB_REMOTE_URL,
    authToken: import.meta.env.SECRET_ASTRO_DB_APP_TOKEN,
});