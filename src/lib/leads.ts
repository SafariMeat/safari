// Netlify Forms integration — gives the business a real order/lead history
// with zero backend code or database.
//
// How it works: Netlify scans the *static* built HTML for any <form
// data-netlify="true" name="..."> and a matching hidden `form-name` input.
// Once detected at deploy time, every POST to "/" with that form-name shows
// up in the Netlify dashboard's Forms tab (with optional email/Slack
// notifications). See the matching <form> in order.astro, contact.astro,
// quote.astro, and wholesale.astro for the static markup Netlify indexes.
//
// This is a *record*, not the primary notification channel — WhatsApp stays
// the fast path for both customer and business. If this submission fails
// (offline, not deployed on Netlify, ad blocker, etc.) the calling page
// still proceeds with the WhatsApp flow; a missed history entry should
// never block someone's order or enquiry from going through.

function encodeForm(fields: Record<string, string>): string {
  return Object.entries(fields)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

/**
 * Submit a lead/order to Netlify Forms so it's recorded for the business.
 * `formName` must match the `name` attribute on the corresponding static
 * <form data-netlify="true"> in the page.
 * Best-effort: resolves to true/false, never throws.
 */
export async function submitLead(
  formName: string,
  fields: Record<string, string>
): Promise<boolean> {
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeForm({ 'form-name': formName, ...fields }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
