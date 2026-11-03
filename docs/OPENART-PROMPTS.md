# OpenArt prompt pack

**No further generations are run without explicit approval.** Every prompt below is ready to paste; nothing here spends credits by itself.

Account state at time of writing: `openart` CLI 0.1.1 authenticated, plan **Plus**, 12,000 credits. Generations already made for this build: 5 stills (4 in use) and 2 five-second video drafts (the 4:3 loop used in the homepage film band).

Model guidance
- **Stills:** `byte-plus-seedream-5-pro` for photographic realism, `gpt-image-2-5-flare` when you need text or product accuracy.
- **Film:** `kling-v3` or `byte-plus-seedance-2-5` for camera choreography. Both returned 4:3 from a 16:9 source in testing — ask for 16:9 explicitly *and* check the output dimensions before using it full-bleed.
- Ask for "no text, no logos" every time; models invent brand marks otherwise.

---

## 1. Homepage hero — still

`byte-plus-seedream-5-pro` · 16:9 · 1920px wide

> Cinematic editorial photograph, anatomically correct paws with clearly separated toes: a golden retriever lying and a tabby cat sitting beside it on a dark walnut floor, both on the right third of frame, left two-thirds a clean dark forest-green wall in soft shadow with warm light falloff, golden hour rim light from a window at right, shallow depth of field, fine film grain, teal-and-amber cinematic grade, generous empty space on the left for a large headline, natural candid poses, magazine quality, no text

Why it works: the composition reserves the left 40% as a low-detail field, which is what keeps the headline legible without a heavy scrim.

## 2. Homepage hero — film loop

`kling-v3` · 16:9 · 5s · image-to-video from **1.**

> Extremely subtle cinematic motion: slow dolly push-in on the golden retriever and tabby cat, the cat blinks slowly, dust motes drift through the warm window light, the dog's fur ruffles faintly, no camera shake, no cuts, filmic grain, warm amber grade

Reject any take where the animals morph, the paws change shape, or the camera "breathes" more than a few percent. A 5-second loop at 544 KB (h264 crf 27, no audio) is the budget this design expects.

## 3. Dog Center band

`byte-plus-seedream-5-pro` · 16:9

> Cinematic photograph of a young Labrador standing in a doorway at golden hour, seen slightly from behind, dark interior in the foreground, warm light outlining the coat, shallow depth of field, film grain, no people, no text

## 4. Cat Center band

`byte-plus-seedream-5-pro` · 16:9

> Cinematic photograph of a tabby cat sitting on a windowsill in low warm evening light, dust motes visible, dark room behind, shallow depth of field, quiet documentary mood, teal-and-amber grade, no text

## 5. Marketplace — verification band

`gpt-image-2-5-flare` · 16:9

> Editorial still life on dark walnut: a folded paper health record, a small metal microchip tag, a stethoscope, and a soft blanket, arranged as a flat-lay, single warm light from the left, deep shadows, no readable text, no logos

## 6. Marketplace — adoption band

`byte-plus-seedream-5-pro` · 4:3

> Cinematic photograph of a volunteer's hands opening a shelter kennel door, an older mixed-breed dog looking up through the gap, warm light from a corridor, muted greens, documentary realism, shallow depth of field, no text

## 7. Product shop — gear still life

`gpt-image-2-5-flare` · 16:9

> Cinematic still life: leather dog harness, coiled rope leash, stainless steel bowl, folded knit blanket on dark walnut, deep forest-green wall behind, warm amber rim light from the left, long shadows, dust in the air, editorial product photography, no text, no logos

## 8. Product shop — bed and carrier pair

`byte-plus-seedream-5-pro` · 3:2

> Two-object editorial composition: a cream bouclé orthopedic dog bed on the left and an open top-loading cat carrier on the right, photographed in the same room under one warm light source, dark green wall, walnut floor, catalogue realism, no text

## 9. Breed portraits (repeat per breed, 16:9 or 1:1)

`byte-plus-seedream-5-pro` · 1:1

> Studio portrait of a <BREED> against a deep forest-green seamless backdrop, three-quarter angle, soft key light from the upper left, gentle falloff, natural posture, no props, no text

Breeds to prioritise: Labrador Retriever, Border Collie, Cavalier King Charles Spaniel, Maine Coon, Domestic Shorthair, Bengal. Keep one lighting setup across the set so the breed pages read as a series.

## 10. Advertising banners (only for sold inventory)

`gpt-image-2-5-flare` · 728×90 and 640×360

> Wide banner background for a pet nutrition brand, warm amber gradient over a dark forest-green field, subtle grain, abstract shapes suggesting kibble and leaves, generous empty space on the right for a logo, no text, no existing brand marks

The `AdSlot` component supplies the labels and layout; banner art must stay generic so the sponsor's own creative can replace it.

## 11. Newsletter header

`byte-plus-seedream-5-pro` · 3:1

> Very wide cinematic strip: the same quiet living room from the hero, empty of animals, warm afternoon light across the floor, dust in the air, deep shadows, film grain, no text

## QA on every generated asset

1. Check paws, eyes and ears at 100% — fused toes and glassy eyes are the usual tells.
2. Check the negative space actually exists where the layout needs it.
3. Check the file size at final export (hero still ≤ 220 KB at 1920 w JPEG q5; loop ≤ 600 KB).
4. Convert to WebP/AVIF for production, keep the JPEG as a fallback.
5. Record what was generated, with model and prompt, in `docs/asset-log.md` so a future edit does not silently change the brand look.
