# Chesta & Udit — Ring Ceremony Invitation

A premium, mobile-first interactive Ring Ceremony invitation website for **Chesta & Udit**.

**Event:** Saturday, 28 November 2026 · 6:30 PM onwards  
**Venue:** Golden Dream Vista, Noida Extension

Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, and HTML Canvas.

---

## Requirements

- Node.js 20+ (LTS recommended)
- npm 10+

## Local setup (macOS / Windows / Linux)

```bash
cd chesta-udit-ring-ceremony
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/invite/`).

> **Note:** Vite `base` is `/invite/` for a short GitHub Pages link:
> `https://TestingWithUdit.github.io/invite/`

### Production build & preview

```bash
npm run build
npm run preview
```

## Update event details

Edit one file only:

```text
src/config/event.ts
```

You can change:
- Names and initials
- Date / time / timezone display strings
- Venue name and Google Maps search query
- Optional WhatsApp RSVP number (`rsvpWhatsApp` — leave empty to hide the button)
- Asset paths (couple image, Ganesha, audio)

## Replace artwork

See [`public/assets/ASSETS.md`](public/assets/ASSETS.md).

Primary couple hero image:

```text
public/assets/couple/chesta-udit-engagement.png
```

## Create the GitHub repository

## Live invitation URL (share this)

```text
https://TestingWithUdit.github.io/invite/
```

Works on mobile, tablet/iPad, and desktop. Repo name is short (`invite`) so the link stays easy to share.

### Deploy / update

```bash
git init
git add .
git commit -m "Add Chesta & Udit Ring Ceremony invitation site"
git branch -M main
git remote add origin https://github.com/TestingWithUdit/invite.git
git push -u origin main
```

Then: repo **Settings → Pages → Source: GitHub Actions**.

If you rename the repo, update `base` in `vite.config.ts` to match:

```ts
base: '/YOUR-REPO-NAME/',
```

The workflow file is [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Features

- Shubh Aarambh opening with Lord Ganesha blessing
- Interactive royal envelope
- Couple introduction with cinematic parallax reveal
- Canvas scratch-card date reveal (+ accessible “Reveal the Date” button)
- Formal invitation with Get Directions (Google Maps search)
- Live IST countdown to 28 Nov 2026, 6:30 PM
- Save the Date `.ics` download
- Optional WhatsApp RSVP (hidden when no number is configured)
- Optional music toggle (no autoplay)
- `prefers-reduced-motion` support

## License & assets

Use only original or properly licensed illustrations and music.  
Placeholder couple artwork is not a personalized portrait — replace it with your custom illustration before sharing widely.
