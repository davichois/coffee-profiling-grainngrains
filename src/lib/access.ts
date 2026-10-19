// ─── Access ──────────────────────────────────────────────────────────────────
// The wheel is reachable only with a traceability code. Set this to `false` to
// open the app to everyone.
//
// Note this is a soft gate: the lookup runs with the public Supabase key, so
// it guards the *content* — only published lots resolve — rather than the
// application itself. A hard gate would need real authentication.
export const REQUIRE_CODE = true;

// Where the "buy coffee" call-to-action points.
export const SHOP_URL = "https://grainngrains.org";
