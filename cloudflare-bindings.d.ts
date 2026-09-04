// The brochure site has no database binding. Optional DB supports the existing
// database helper when a deployment explicitly configures that capability.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
  }
}
