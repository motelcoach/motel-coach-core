# Global Download Form — How To Use

A single JS listener in `BaseLayout.astro` handles all lead-capture forms across the site.
You never write JavaScript. You paste one HTML block into any `.md` file and change two values.

---

## Step 1 — Copy the snippet

```html
<div class="border-2 border-dashed border-[#4A554E] rounded-2xl p-8 my-10">
  <h2 class="text-xl font-semibold text-stone-900 mb-2 !mt-0">Download: YOUR TITLE HERE</h2>
  <p class="text-stone-600 text-sm mb-6">Enter your email to get instant access. We'll also send you practical motel management and marketing resources.</p>
  <form
    class="global-download-form flex flex-col sm:flex-row gap-3"
    data-download="/downloads/YOUR-FILE.pdf"
  >
    <label for="dl-email-YOUR-SLUG" class="sr-only">Email address</label>
    <input
      id="dl-email-YOUR-SLUG"
      type="email"
      name="email"
      required
      placeholder="you@example.com"
      class="flex-1 px-4 py-3 rounded-lg border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#4A554E] focus:border-transparent"
    />
    <button
      type="submit"
      class="px-6 py-3 bg-[#4A554E] text-white text-sm font-medium rounded-lg hover:bg-[#3d4640] transition-colors whitespace-nowrap"
    >
      Download
    </button>
  </form>
  <p class="text-xs text-stone-400 mt-3">No spam. Unsubscribe any time.</p>
</div>
```

---

## Step 2 — Change these two values only

| Attribute / value | What to put | Example |
|---|---|---|
| `data-download="..."` | Path to the file the user receives after submitting | `/downloads/booking-checklist.pdf` |
| `id="dl-email-..."` and `for="dl-email-..."` | A unique slug for this form (prevents duplicate `id` if two forms appear on one page) | `dl-email-booking-checklist` |

Update the `<h2>` title and `<p>` description text to match the resource.

---

## Step 3 — Add the file to the project

Place the downloadable asset in `public/downloads/`.

```
public/
  downloads/
    booking-checklist.pdf
    maintenance-schedule.pdf
    front-desk-sop.pdf
```

Astro serves everything in `public/` as static files at the root of the site.
A file at `public/downloads/booking-checklist.pdf` is accessible at
`https://motelcoach.com.au/downloads/booking-checklist.pdf`.

---

## Real examples already in the codebase

### Booking.com Checklist (`booking-review-rank.md`)

```html
<form
  class="global-download-form flex flex-col sm:flex-row gap-3"
  data-download="https://docs.google.com/document/d/1uwIOWmWAAA7xoFYorg0vD4HcG2DEgYneAK7RimFBPYs/edit?usp=sharing"
>
```

> `data-download` can also be a full external URL (Google Doc, Dropbox, etc.).

---

## How it works (no action needed)

1. User fills in their email and clicks **Download**.
2. The global script in `BaseLayout.astro` intercepts the submit event.
3. It POSTs `{ email, download }` to `/api/subscribe` (your capture endpoint).
4. On success **or** failure, the user is immediately redirected to the `data-download` URL — the asset is never blocked by an API error.

### To connect a real email provider

Open `src/layouts/BaseLayout.astro` and find this line in the global download script:

```js
fetch('/api/subscribe', {
```

Replace `/api/subscribe` with your endpoint:

| Provider | Endpoint or approach |
|---|---|
| Mailchimp | Create an Astro API route at `src/pages/api/subscribe.ts` that proxies to the Mailchimp API |
| ConvertKit | Same — proxy to `https://api.convertkit.com/v3/forms/{id}/subscribe` |
| Formspree | Replace with `https://formspree.io/f/YOUR_ID` and change `Content-Type` to `application/x-www-form-urlencoded` |
| None (deliver only) | Remove the `fetch` call entirely and keep only `window.location.href = downloadUrl` |

---

## Quick checklist for a new download form

- [ ] Paste the snippet into the `.md` file
- [ ] Set `data-download` to the asset path or external URL
- [ ] Give `id` / `for` a unique slug
- [ ] Update the heading and description text
- [ ] Drop the asset file into `public/downloads/` (if self-hosted)
