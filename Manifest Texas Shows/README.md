# Manifest Texas — Website Prototype

A one-page, dependency-free static site for **Manifest Texas** — Texas live-event promotion, bass-forward sound, visuals, and artist bookings.

Built as a portable prototype: plain HTML/CSS/JS so every block can be lifted into Squarespace 7.1 (or any host) without a build step.

> **This prototype is not connected to your Squarespace account.** Nothing here publishes, syncs, or edits a live site. The Squarespace section below is a manual implementation guide.

---

## 1. Preview it

Any of these work — no install, no build:

```bash
# option A: open the file directly
open index.html          # macOS  (Windows: start index.html)

# option B: local server (recommended — matches production paths)
cd manifest-texas-site
python3 -m http.server 8000
# then visit http://localhost:8000
```

Test checklist: toggle dark/light (top right), open the mobile menu under 900px wide, click a "Tickets" button (it shows a "Link coming soon" note until a real URL is added), tab through the page with the keyboard.

---

## 2. File map

```
manifest-texas-site/
├── index.html                  ← ALL content and copy lives here (single page)
├── README.md
├── assets/
│   ├── styles.css              ← design tokens + every style, numbered sections
│   ├── main.js                 ← theme toggle, mobile menu, reveals, link guard
│   ├── favicon.svg             ← simplified geometric mark (chrome M on black)
│   ├── img/                    ← web-optimized images used by the page
│   │   ├── logo-manifest-texas.png      (hero lockup, transparent background)
│   │   ├── logo-manifest-texas-sm.png   (header + footer lockup)
│   │   ├── flyer-getter-austin.{webp,jpg}       + -thumb variants
│   │   ├── flyer-token-dallas.{webp,jpg}        + -thumb variants
│   │   ├── flyer-token-austin.{webp,jpg}        + -thumb variants
│   │   ├── og-manifest-texas.jpg        (1200×630 social card)
│   │   └── favicon-512.png              (apple-touch-icon)
│   └── originals/              ← untouched official uploads, never edited
│       ├── IMG_8322.jpeg                        (official chrome logo on black)
│       ├── GETTER-4X5-2K.jpeg                   (Getter flyer)
│       ├── BE39BCD3-…-F2B3E165DA01.jpeg         (Token · Club Dada, Dallas)
│       └── E55304EF-…-0DB4A99415AD.jpeg         (Token · Come & Take It Live)
├── tools/build-assets.py       ← regenerates assets/img from assets/originals
└── qa/                         ← QA screenshots (desktop/mobile, both themes)
```

### Official assets

- The **chrome Manifest Texas logo** is the official artwork supplied by the client. The web copies are cropped and alpha-keyed off the black field so the lockup can sit on any surface; in light mode the CSS puts it back on a black plate for contrast. Do not swap it for a redrawn wordmark.
- The **three flyers** are the official show artwork, used as-is (resized/compressed only).
- `assets/favicon.svg` is the only drawn mark — a simplified geometric "M" for 16–32px use, where the full lockup would be illegible.

To re-generate the web images after adding or replacing an original:

```bash
pip install pillow
python3 tools/build-assets.py     # writes assets/img/, never touches originals
```

Add new flyers to the `FLYERS` list at the top of `tools/build-assets.py`.

---

## 3. Page structure

| # | Section | `id` | Notes |
|---|---------|------|-------|
| 1 | Sticky header | — | Logo, 6 nav links, theme toggle, mobile menu |
| 2 | Hero | — | Single `<h1>`, logo lockup, CTA to Upcoming Shows |
| 3 | Upcoming Shows | `#upcoming` | One featured show + two supporting cards |
| 4 | Tickets | `#tickets` | One repeatable row and one ticket link per show |
| 5 | Past Shows | `#past` | Rooms + production partners archive grid |
| 6 | About | `#about` | Positioning copy + quick facts list |
| 7 | Artist Submissions | `#submissions` | Minimal introduction + mailto CTA |
| 8 | Contact | `#contact` | Booking / partnerships / venues / social |
| 9 | Footer | — | Logo, nav, auto-updating year |

---

## 4. Content update guide

All copy is in `index.html`. Every editable spot is flagged with an ALL-CAPS HTML comment.

### 4.1 Ticket and info links (the important one)

The three primary DICE ticket links are live in both **Upcoming Shows** and **Tickets**. Each show has one direct ticket action.

```html
<!-- before -->
<a class="btn btn-primary btn-sm" data-link-needed href="#tickets" data-show="Getter — tickets">Tickets</a>

<!-- after: real URL in href, data-link-needed and data-show deleted -->
<a class="btn btn-primary btn-sm" href="https://www.example-ticketing.com/getter-austin">Tickets</a>
```

Instagram is the only social link shown and is live.

### 4.2 Add a new show

1. **Flyer** — drop the file in `assets/originals/`, add it to `FLYERS` in `tools/build-assets.py`, run the script.
2. **Upcoming Shows** — copy an existing `<article class="show-card">` block, or promote the show to `<article class="show-featured">` and demote the previous headliner to a card.
3. **Tickets** — copy the commented `<!-- COPY THIS BLOCK FOR A NEW SHOW -->` template inside `.link-rows`.
4. **JSON-LD** — add a `MusicEvent` object to the second `<script type="application/ld+json">` block in `<head>`.
5. **Past Shows** — after the show, move it into the archive grid using the `<!-- PAST SHOW TEMPLATE -->` comment.

### 4.3 Fields checklist for every new show

Copy this list per event and fill it in before publishing:

- [ ] Artist / headliner name (exact spelling from the flyer)
- [ ] Support / special guests, in flyer order
- [ ] Tour name, if any
- [ ] Day of week + date (display format: `Sat · Sept 26, 2026`)
- [ ] ISO datetime for JSON-LD (`2026-09-26T18:00:00-05:00`)
- [ ] Venue name
- [ ] Street address, city, state, ZIP
- [ ] Doors time, and event/set time if different
- [ ] Age restriction, if the venue sets one
- [ ] Status: `Announced` / `On sale` / `Low tickets` / `Sold out` / `Postponed`
- [ ] Ticket URL (or leave `data-link-needed` in place)
- [ ] Sound/production partner credits (e.g. HSD Sound Systems, Subculture Audio, JT Creative)
- [ ] Flyer file, 4:5 or 2:3, ≥1100px wide
- [ ] Alt text for the flyer (artist, date, venue, city)

### 4.4 Other quick edits

| What | Where |
|------|-------|
| Email addresses | `#contact` cards + the business email link under Tickets |
| Submission destination | `#submissions` — the `<a>` marked `SUBMISSION LINK`. Replace the whole `mailto:` with a form URL (Google Form, Typeform, or a Squarespace form page) and the button keeps working. |
| Social handles | `#contact` "Social" card |
| SEO title/description/OG | top of `<head>`; swap `og:url` and `og:image` to absolute live URLs after launch |
| Accent color | `--accent` in `assets/styles.css` (dark and light blocks) |
| Fonts | Fontshare `<link>` in `<head>` + `--font-display` / `--font-body` |

---

## 5. Squarespace 7.1 implementation guide

The prototype is the design source of truth. Recreate it in Squarespace like this.

### 5.1 Recommended structure

- **One page, "Home"**, built from stacked sections — this mirrors the prototype and keeps Instagram traffic on a single scroll.
- **Sections on Home** (one Squarespace section per prototype section): Hero → Upcoming Shows → Tickets → Past Shows → About → Artist Submissions → Contact.
- **Anchor links:** give each section an Anchor Link ID in *Edit Section → Advanced* using the same ids (`upcoming`, `tickets`, `past`, `about`, `submissions`, `contact`), then point the header nav at `/#upcoming`, `/#tickets`, and so on.
- **Optional: an Events collection.** If you want an auto-sorting calendar later, add a hidden **Events** page and surface it with a Summary Block on Home. Trade-off: Squarespace event styling is rigid, so the hand-built rows below look closer to this prototype. Start with sections; move to an Events collection only when you are running more than ~6 shows at a time.
- **Not-linked pages:** keep `Privacy`, `Terms`, and any long-form submission form in the *Not Linked* area, linked from the footer.

### 5.2 Event card workflow (Upcoming Shows)

1. Add a section → **Blank**, set it to a 2-column layout.
2. Left column: **Image Block** with the flyer. Set *Design → Image Fit: Fill*, and add alt text (Squarespace: *Image → Edit → Alt text*) in the format `Artist, date, venue, city`.
3. Right column: **Text Block** with the date eyebrow, `H3` artist name, support line, then a 2-column list of Venue / City / Doors / Status.
4. Below it: **Button Block** for Tickets. Paste the real ticket URL; if there is no URL yet, set the button link to `#tickets` and change its label to `Tickets — soon`.
5. Duplicate the whole section for each supporting show, then reorder sections so the headliner is first.
6. Add the section-level class hook in *Edit Section → Advanced → CSS Class*: `mt-show` for cards, `mt-show-featured` for the headline show. The Custom CSS below styles them.

### 5.3 Ticket rows in Squarespace

1. Add a **Blank** section, anchor id `tickets`.
2. Inside, add one **3-column row per show**: date (Text Block) · title + venue line (Text Block) · buttons (Button Blocks, or a single Text Block with inline links).
3. Give each row's section a CSS Class of `mt-link-row`.
4. **To edit a show's link:** click the Ticket Button Block → *Edit → Link* → paste the ticket URL.
5. **To add a new show:** hover the row → *Duplicate*, then change the date, title, venue line, and all three link URLs. Drag it into date order.
6. **When a link is not ready:** leave the button label as `Tickets — soon`, set the link to `#tickets`, and add CSS Class `is-soon` to the block. The Custom CSS below dims it and disables the pointer.

### 5.4 Where to paste code

| Code | Squarespace location |
|------|----------------------|
| Fonts + JSON-LD + OG overrides | *Settings → Advanced → Code Injection → Header* |
| The site's visual styling | *Website → Website Tools → Custom CSS* (paste the token block + the section rules you need from `assets/styles.css`) |
| Theme toggle + "link coming soon" behavior | *Code Injection → Footer*, wrapped in `<script>` — paste sections 1 and 4 of `assets/main.js` |
| Per-section overrides | *Edit Section → Advanced → CSS Class*, then target `.mt-show`, `.mt-link-row`, `.is-soon` in Custom CSS |

Minimum Custom CSS to carry the brand over:

```css
/* paste the :root / [data-theme] token blocks from assets/styles.css first */
body { background: var(--bg); color: var(--text); font-family: 'Switzer', sans-serif; }
h1, h2, h3 { font-family: 'Cabinet Grotesk', sans-serif; letter-spacing: -.02em; }
.mt-link-row { border-bottom: 1px solid var(--border); }
.is-soon a { opacity: .55; pointer-events: none; }
```

Squarespace's built-in dark/light "Color Themes" can substitute for the JS toggle: assign the *Black* theme to every section, and use a *Lightest* variant if you want a light section. If you want the compact sun/moon toggle instead, paste the toggle script into Code Injection → Footer and add the button to the header via a Code Block.

### 5.5 Replacing flyers and ticket links in Squarespace

- **Flyer:** click the Image Block → *Edit → Replace Image* → upload the new 4:5 flyer (≥1100px wide, under ~500KB) → update alt text.
- **Ticket link:** click the Button Block → *Edit → Link* → paste URL → set *Open in new window* on.
- **Both places matter:** every show appears twice — once as a card in Upcoming Shows, once as a row in Tickets. Update both, or the row will contradict the card.

### 5.6 Launch checks

- Set the site title/description in *Settings → SEO*, and upload `assets/img/og-manifest-texas.jpg` as the Social Sharing Logo.
- Preview on a phone — most traffic will arrive from Instagram.
- Confirm every button either goes somewhere real or clearly reads "soon".

---

## 6. Design conventions

- **Palette:** near-black surfaces (`#050607` / `#0b0d0f`), brushed-chrome text ramp (white → `#b9c2cb` → `#6f7a84`), one icy-blue accent (`#8ed3ff` dark, `#0f6f9e` light). No purple, no neon, no gradient fills on buttons.
- **Type:** Cabinet Grotesk (display, 700/800) + Switzer (body, 400–600), both from Fontshare. Uppercase micro-labels at 12–14px with `.16em` tracking are the only decorative type treatment.
- **Layout:** asymmetric, flyer-led. Featured show is a 1.05fr / 1fr split; supporting shows are compact image-left cards; the ticket rows are a strict date / title / actions grid.
- **Motion:** CSS-only. Slow hero sheen, scan-line texture, IntersectionObserver opacity/translate reveals, 120ms tactile button press. Everything collapses under `prefers-reduced-motion`.
- **Accessibility:** one `<h1>`, skip link, semantic landmarks, 44px minimum touch targets, visible accent focus rings, alt text on every flyer, AA contrast in both themes.
- **Naming:** BEM-ish flat classes (`.show-card`, `.link-row-actions`), tokens for every color/space value, and numbered comment banners in `styles.css` so sections are easy to find.

---

## 7. Known editorial notes

- The Getter flyer credits **Zhonk**; the wording on the site follows the flyer exactly. Change it in `index.html` (Upcoming Shows + JSON-LD) if the artist spells it differently.
- **Past Shows** deliberately lists rooms and production partners rather than invented past dates. Replace those tiles with real recaps as shows wrap, using the template comment in that section.
- Booking, partnership, and venue inquiries route to `anthonyjones@manifesttexas.com`. The artist-submission inbox remains a separate structural suggestion until confirmed.
