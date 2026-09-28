declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    SESSION_SECRET?: string;
    RESEND_API_KEY?: string;
    ADMIN_EMAIL?: string;
    BUCKET?: R2Bucket;
  }
}
