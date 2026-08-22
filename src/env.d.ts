declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    ARTWORKS?: R2Bucket;
    AI_GENERATION_MODE?: 'mock' | 'http';
    AI_PROVIDER_ENDPOINT?: string;
    AI_PROVIDER_API_KEY?: string;
  }
}

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
