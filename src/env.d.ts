declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ARTWORKS?: R2Bucket;
    SESSION?: KVNamespace;
    AI_GENERATION_MODE?: 'mock' | 'http';
    AI_PROVIDER_ENDPOINT?: string;
    AI_PROVIDER_API_KEY?: string;
    ADMIN_TOKEN?: string;
    RESEND_API_KEY?: string;
    MAIL_FROM_EMAIL?: string;
    MAIL_FROM_NAME?: string;
    PUBLIC_BASE_URL?: string;
    AUTH_DEV_FALLBACK?: string;
  }
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
