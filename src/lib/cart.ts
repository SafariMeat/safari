// Cart logic shared across pages via inline scripts.
// Stored in localStorage as: { [slug]: { slug, name, pricePerKg, qty } }
//
// Design notes:
// - Every read re-validates the stored shape. localStorage can be edited
//   by hand, shared across tabs/old versions, or simply empty — treat it
//   as untrusted input, not as data we already know is well-formed.
// - Quantities are always coerced to positive integers. An item can never
//   sit in the cart with qty <= 0; setting/adding down to zero removes it.
// - All money math is rounded to 2dp to avoid floating-point noise
//   (e.g. 0.1 + 0.2 style errors) leaking into the displayed total.
// - Every mutation dispatches a `CART_CHANGED_EVENT` on `window`. The
//   browser's built-in `storage` event only fires in *other* tabs, never
//   the tab that made the change — this custom event covers same-tab
//   listeners (e.g. the nav cart-count badge in Layout.astro).

export const CART_KEY = 'safari-meats-cart';
export const CART_CHANGED_EVENT = 'safari-meats:cart-changed';

export type CartItem = {
  slug: string;
  name: string;
  pricePerKg: number;
  qty: number;
  image?: string;
};

export type Cart = Record<string, CartItem>;

function hasLocalStorage(): boolean {
  return typeof localStorage !== 'undefined';
}

/** Coerce to a positive integer, defaulting to 0 (i.e. "not in cart") for anything invalid. */
function sanitizeQty(value: unknown): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function sanitizePrice(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

/** Validate one raw record from storage into a well-formed CartItem, or null if unusable. */
function sanitizeItem(slug: string, raw: unknown): CartItem | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  const qty = sanitizeQty(r.qty);
  if (qty <= 0) return null;

  const name = typeof r.name === 'string' && r.name.trim() ? r.name : null;
  if (!name) return null;

  const image = typeof r.image === 'string' && r.image.trim() ? r.image : undefined;

  return {
    slug,
    name,
    pricePerKg: sanitizePrice(r.pricePerKg),
    qty,
    image,
  };
}

export function getCart(): Cart {
  if (!hasLocalStorage()) return {};

  let raw: unknown;
  try {
    raw = JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  } catch {
    return {};
  }
  if (!raw || typeof raw !== 'object') return {};

  const clean: Cart = {};
  for (const [slug, value] of Object.entries(raw as Record<string, unknown>)) {
    const item = sanitizeItem(slug, value);
    if (item) clean[slug] = item;
  }
  return clean;
}

export function saveCart(cart: Cart) {
  if (!hasLocalStorage()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CART_CHANGED_EVENT));
  }
}

/** Add `qty` (default 1) of an item to the cart, merging with any existing quantity. */
export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1): Cart {
  const addQty = sanitizeQty(qty);
  if (addQty <= 0) return getCart(); // nothing valid to add

  const cart = getCart();
  const existingQty = cart[item.slug]?.qty ?? 0;

  cart[item.slug] = {
    slug: item.slug,
    name: item.name,
    pricePerKg: sanitizePrice(item.pricePerKg),
    qty: existingQty + addQty,
    image: item.image ?? cart[item.slug]?.image,
  };

  saveCart(cart);
  return cart;
}

/** Set an item's quantity directly. qty <= 0 removes the item entirely. */
export function setQty(slug: string, qty: number): Cart {
  const cart = getCart();
  const clean = sanitizeQty(qty);

  if (clean <= 0) {
    delete cart[slug];
  } else if (cart[slug]) {
    cart[slug] = { ...cart[slug], qty: clean };
  }
  // If the slug isn't already in the cart, setQty is a no-op — use
  // addToCart to add a brand new item instead.

  saveCart(cart);
  return cart;
}

export function removeFromCart(slug: string): Cart {
  const cart = getCart();
  delete cart[slug];
  saveCart(cart);
  return cart;
}

export function clearCart(): Cart {
  saveCart({});
  return {};
}

/** Total cost across all line items, rounded to 2dp. */
export function cartTotal(cart: Cart): number {
  const total = Object.values(cart).reduce((sum, i) => sum + i.pricePerKg * i.qty, 0);
  return Math.round(total * 100) / 100;
}

/** Total number of units across all line items (e.g. for a cart badge). */
export function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((sum, i) => sum + i.qty, 0);
}
