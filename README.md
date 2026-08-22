# Safari Meats — MVP

Structure-and-logic-only scaffold. No CSS, no header/footer components —
just the Astro pages, content collection (custom CMS), and cart logic.

## Run it

```
npm install
npm run dev
```

## Structure

- `src/content/config.ts` — schema for the "products" content collection.
  This is the custom CMS contract: each product is a Markdown file with
  frontmatter (name, price, category, stock, etc). Swap this for a real
  headless CMS or database later without changing the page logic much.
  `stockQty` is the real cap on how much can be ordered; `inStock` is a
  separate manual override an admin can flip off instantly regardless of
  count.
- `src/content/products/*.md` — sample product entries (3 included).
- `src/pages/index.astro` — home page, lists featured + all products.
- `src/pages/products/[slug].astro` — product detail page, generated per
  product via `getStaticPaths`. Has an "add to order" form capped to
  remaining stock (accounting for what's already in the cart).
- `src/pages/order.astro` — reads the cart from `localStorage`, re-checks
  every line against a build-time stock snapshot (clamping or dropping
  anything that's changed since it was added), renders line items, computes
  the total, and has a checkout form (logs the payload — swap in a real API
  call when the backend exists).
- `src/pages/contact.astro` — simple contact form (client-side stub).
- `src/pages/about.astro` — placeholder.
- `src/lib/cart.ts` — shared cart logic (get/add/remove/total), backed by
  `localStorage` for this MVP. Every mutation dispatches a
  `safari-meats:cart-changed` event on `window` so other UI (the nav badge)
  can react instantly, in the same tab, without a page reload.
- `src/components/Layout.astro` — site-wide header/footer nav, now
  including a "Your Order (N)" link with a live cart-count badge kept in
  sync via the event above (same tab) and the browser's `storage` event
  (other tabs).

## Stock quantity cap

Products now carry a `stockQty` (kg/units on hand) alongside the existing
`inStock` toggle — a product is only orderable when both are true. This is
enforced at three points, not just as a UI hint:

- **Product page**: the quantity input's `max` is the remaining stock
  (stock minus whatever's already in the customer's cart), and adding more
  than that silently clamps to what's left.
- **Order page load**: the whole cart is re-checked against a build-time
  stock snapshot — anything that's since gone out of stock is dropped,
  anything over the current count is reduced, and the customer is told
  what changed.
- **Order submit**: the same check runs again right before checkout, in
  case stock changed (or the customer edited the qty field directly) while
  they were sitting on the page.

Because this is a static site, "current" stock means "as of the last
deploy" — editing `stockQty` in `/admin/` needs a rebuild (automatic on
Netlify) before the new cap takes effect on the live site.

## Not included (by request)

- No CSS/styling
- No header or footer components
- No real backend/API routes yet (all four forms hand off to WhatsApp — see
  "Order/lead history" below for what *is* persisted)

## Order/lead history

Every submission (checkout, contact, quote, wholesale) still opens WhatsApp
as the fast path — but each also logs to **Netlify Forms** in the background
(`src/lib/leads.ts`), so there's a real record even if the customer never
sends the WhatsApp message. No backend or database needed for this:

- Each form (`order`, `contact`, `quote`, `wholesale`) has
  `data-netlify="true"` and a matching hidden `form-name` field, so Netlify
  detects them in the static build and logs every submission automatically.
- View submissions in the Netlify dashboard under **Forms** once deployed —
  filter by form name to see orders vs. quotes vs. enquiries separately.
- Turn on **Site settings → Forms → Notifications** to get an email (or
  Slack) the moment a new order/enquiry comes in.
- The Netlify Forms free tier caps at 100 submissions/month — worth
  flagging to the client; a real DB is a clean drop-in replacement for
  `submitLead()` later without touching the page logic.
- This is best-effort by design: a failed log (offline, not deployed on
  Netlify, etc.) never blocks the WhatsApp handoff itself.

## Next steps

- Wire `src/pages/order.astro` and `contact.astro` up to real API routes
  (e.g. `src/pages/api/orders.ts`) once a backend/DB is chosen, replacing
  `submitLead()`'s Netlify Forms call.
- Add remaining pages to reach the agreed 10 (e.g. menu/categories page,
  delivery info, FAQ) — same content-collection pattern extends cleanly.
- Layer in design once content/logic is signed off.

## Admin product management

An admin CMS is available at `/admin/` after deployment with Decap CMS. The product editor makes it easy to:

- add new products to the product list
- edit product name, category, price, unit, image and description
- toggle **Featured product** on/off
- toggle **Availability** between in stock and out of stock

### Deployment setup

The CMS configuration uses the `git-gateway` backend. For Netlify, enable **Identity**, enable **Git Gateway**, and invite the admin user. Then the admin can sign in at `/admin/` and manage products without editing Markdown files manually.
