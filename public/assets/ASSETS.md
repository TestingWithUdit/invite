# Asset replacement guide

All visual and audio assets live under `public/assets/`. Update `src/config/event.ts` if you change filenames.

## Couple photos (Meet the Couple slideshow)

Replace these files to update the animated slideshow:

Slideshow order (configured in `event.ts`):
1. `slide-03-ring-ceremony.png` — Ring Ceremony
2. `slide-01-bride-groom.png` — Meet Bride & Groom
3. `slide-02-groom-bride.png` — Meet Groom & Bride
4. `slide-04-sunset-jeep.png` — Sunset floral arch

Order and captions are configured in `src/config/event.ts` → `assets.coupleSlides`.

Guidelines:
- Portrait images work best (~3:4).
- Do not stretch or crop faces.
- Keep aspect ratio with `object-contain` (already set in the slideshow).

`assets.couple` is used for the envelope thumbnail / finale mini image (defaults to slide 03).

## Lord Ganesha

**Path:** `public/assets/ganesha/ganesha-blessing.jpg`

Replace with a properly licensed or original respectful illustration.

## Background music (optional)

**Path:** `public/assets/audio/background.mp3`

Add a locally hosted, properly licensed instrumental track.  
If the file is missing, the music button hides itself gracefully.

## Backgrounds (optional)

Place extra floral / palace artwork in `public/assets/backgrounds/` and reference them from components or config if needed.
