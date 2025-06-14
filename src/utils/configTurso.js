import { createClient } from "@libsql/client";

export const turso = createClient({
    url: import.meta.env.SECRET_ASTRO_DB_REMOTE_URL || "https://turso.example.com",
    authToken: import.meta.env.SECRET_ASTRO_DB_APP_TOKEN || "your-default-token",
}); 