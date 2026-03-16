# Motel Coach — Website Design Standardization Prompt

Use this prompt to standardize the entire Motel Coach site to a **modern, fresh SaaS/docs aesthetic** inspired by [Mintlify](https://www.mintlify.com) and the [Oatmeal SaaS kit (olive_instrument theme)](https://tailwindcss.com/plus/kits/oatmeal/preview?theme=olive_instrument): clean, professional, generous whitespace, subtle depth, and a restrained olive/stone palette—no blue or generic gray accents.

---

## Design direction (reference)

- **Mintlify**: Clean hero sections, clear hierarchy, soft backgrounds, crisp CTAs, trust logos, card-based sections, intelligent use of white space, professional without being cold.
- **Oatmeal (olive_instrument)**: Warm off-whites, olive green as the single accent (buttons, links, highlights), Instrument Sans (or similar) typography, rounded corners, soft shadows, editorial feel.

**Avoid**: Blue primary accents, harsh grays, busy backgrounds, or anything that feels “template generic.” The site should feel like a premium, focused product brand (SaaS/docs), not a generic business site.

---

## Design system to apply everywhere

### Colors (use these consistently; already in `tailwind.config.mjs`)

- **Backgrounds**
  - Primary: `bg-white`
  - Secondary / sections: `bg-brand-50` or `#F9F9F8` (warm off-white)
- **Text**
  - Primary: `text-stone-900` or `text-brand-900`
  - Secondary: `text-stone-500`
  - Muted / labels: `text-stone-400`
- **Accent (single brand color)**
  - Primary: `#4A554E` → use `brand-500` or `text-[#4A554E]` / `bg-[#4A554E]`
  - Hover: `#3d4640` → `brand-600` or equivalent
- **Borders**: `border-stone-200` or `border-stone-100` for subtle dividers.
- **Do not use**: `blue-*`, `gray-*` (except where explicitly noted), or other accent colors. Replace any existing blue/gray accents with the olive/stone palette above.

### Typography

- **Font**: Instrument Sans (already in `BaseLayout.astro`). Keep it as the only sans font.
- **Headings**: `font-semibold` or `font-bold`, `tracking-tight`, `text-stone-900` (or `text-brand-900`).
- **Body**: `text-stone-500` or `text-stone-600`, `leading-relaxed`.
- **Labels / overlines**: `text-xs font-semibold uppercase tracking-widest text-stone-400` or `text-[#4A554E]` for accent labels.

### Components

- **Buttons**
  - Primary: `bg-[#4A554E]` (or `bg-brand-500`) `text-white` `rounded-lg` `px-6 py-3` `font-medium` `hover:bg-[#3d4640]` `transition-colors` `shadow-sm`.
  - Secondary: `bg-white border border-stone-200 text-stone-900` `rounded-lg` `hover:bg-stone-50` `transition-colors`.
- **Cards**: `bg-white border border-stone-200 rounded-xl shadow-sm` (optionally `hover:shadow-md`). Use `p-6` or `p-8`. No blue borders or blue hover states.
- **Links**: Default `text-stone-500` or `text-stone-600`, hover `text-stone-900`. Accent links: `text-[#4A554E]` or `text-brand-500` with `hover:underline` or `hover:text-stone-900`.
- **Prose (blog/content)**: Use `prose-stone`, `prose-headings:text-stone-900`, `prose-a:text-[#4A554E]`, `prose-p:text-stone-500`. No `prose-blue` or blue link colors.

### Layout & spacing

- **Container**: `max-w-6xl` or `max-w-7xl` `mx-auto` `px-6`.
- **Sections**: Generous vertical padding, e.g. `py-20 md:py-28` or `py-24 md:py-32`.
- **Header/nav**: Keep existing sticky header in `BaseLayout.astro` (white/backdrop blur, stone border). Footer: warm off-white `#F9F9F8`, stone borders.

---

## Files to standardize

1. **`tailwind.config.mjs`**  
   Ensure `brand` colors and `fontFamily.sans` (Instrument Sans) are the only design tokens used for this look. No blue in theme.

2. **`src/layouts/BaseLayout.astro`**  
   Already aligned (olive CTA, stone text, warm footer). Only tweak if anything still uses blue/gray.

3. **`src/pages/index.astro`**  
   Already aligned. Keep as reference for hero, marquee, and card styling.

4. **`src/pages/blog/index.astro`**  
   **Replace all blue** (`blue-600`, `blue-50`, `blue-200`, etc.) with the design system:
   - Hero: use `bg-brand-50` or warm off-white + `border-stone-200`, `text-stone-900` / `text-stone-500`; accent for labels/buttons: `#4A554E`.
   - Filter buttons: primary state `bg-[#4A554E] text-white`; default state `bg-white border-stone-200 text-stone-900` with hover to olive.
   - Cards: white bg, stone border, olive for category/link accents; remove blue hover and blue badges.

5. **`src/pages/motel-marketing.astro`** (and any similar service/campaign pages)  
   Replace `blue-600`, `gray-*` with stone/olive: overline/labels `text-[#4A554E]` or `text-stone-400`, headings `text-stone-900`, body `text-stone-500`/`text-stone-600`, backgrounds `bg-white` / `bg-brand-50`, borders `border-stone-200`. Prose: `prose-stone` and olive links only.

6. **`src/layouts/BlogPostLayout.astro`**  
   Already aligned (olive category, stone prose). Use this as the prose reference for other content pages.

7. **Any other pages** under `src/pages/` (e.g. `motel-management`, `motel-consultancy`, `courses`, `contact`, `audit`, `playbook`)  
   Apply the same rules: no blue, no generic gray accents; use only white, warm off-white (`#F9F9F8` / `brand-50`), stone text, and olive (`#4A554E`) for CTAs and link accents.

---

## Copy-paste instruction for an AI

You can hand this to an AI (or yourself) as a single instruction:

**“Standardize the entire Motel Coach website to the design system described in `STYLE-GUIDE-PROMPT.md`. Reference Mintlify and the Oatmeal olive_instrument theme: modern, clean SaaS/docs look with a single olive accent (#4A554E), warm off-whites, stone text, and Instrument Sans. Replace every use of blue or generic gray accents with the olive/stone palette. Update `src/pages/blog/index.astro`, `src/pages/motel-marketing.astro`, and any other pages that don’t yet follow the layout and components defined in the style guide. Keep `BaseLayout.astro`, `BlogPostLayout.astro`, and the homepage as the visual reference; make all other pages consistent with them.”**

---

*Last updated for Motel Coach Astro site. Adjust `site` in `astro.config.mjs` and any brand hex codes if the brand evolves.*
