/**
 * Per-section cinematic art direction.
 *
 * Each of the six primary sections gets its own treatment: grade, crop, motion
 * and overlay geometry. The treatments are declarative so a new section is a
 * config entry, and swapping the artwork later (e.g. purpose-shot OpenArt
 * renders) means changing only `image`.
 */
export type CinematicVariant = 'dog' | 'cat' | 'knowledge' | 'marketplace' | 'shop' | 'community';

export interface CinematicTreatment {
  image: string;
  /** CSS filter applied to the plate */
  filter: string;
  /** object-position of the plate */
  position: string;
  /** kenburns | pan | drift | sweep | float | none */
  motion: 'kenburns' | 'pan' | 'drift' | 'sweep' | 'float' | 'none';
  /** gradient stack over the image */
  scrim: string;
  /** accent used by the beam / rule details */
  accent: string;
  /** decorative overlays */
  letterbox?: boolean;
  spotlight?: boolean;
  bokeh?: boolean;
  /** vertical placement of the copy */
  align: 'center' | 'end';
  /** one-line art-direction note, shown in the code only */
  note: string;
}

export const treatments: Record<CinematicVariant, CinematicTreatment> = {
  dog: {
    image: '/brand/sections/dogs.jpg',
    filter: 'saturate(1.02) contrast(1.03) brightness(.97)',
    position: '66% 34%',
    motion: 'kenburns',
    scrim:
      'linear-gradient(94deg, rgba(5,8,7,.95) 0%, rgba(5,8,7,.82) 34%, rgba(5,8,7,.16) 66%, rgba(5,8,7,.55) 100%), linear-gradient(to top, #050807 2%, rgba(5,8,7,.2) 30%, transparent 62%)',
    accent: '#e3a575',
    align: 'center',
    note: 'Stylised 3D render of an adult border collie. Warm key light, subject right, clean left field.',
  },
  cat: {
    image: '/brand/sections/cats.jpg',
    filter: 'saturate(.94) contrast(1.05) brightness(.95) hue-rotate(-5deg)',
    position: '68% 32%',
    motion: 'pan',
    scrim:
      'linear-gradient(90deg, rgba(4,10,12,.96) 0%, rgba(4,10,12,.84) 36%, rgba(6,14,16,.25) 70%, rgba(4,10,12,.6) 100%), radial-gradient(80% 60% at 78% 40%, rgba(90,180,190,.16), transparent 70%)',
    accent: '#8fd0d6',
    align: 'center',
    note: '3D render of an adult British Shorthair. Cool moonlight mixed with interior warmth.',
  },
  knowledge: {
    image: '/brand/sections/knowledge.jpg',
    filter: 'grayscale(.4) contrast(1.08) brightness(.92)',
    position: '64% 50%',
    motion: 'drift',
    scrim:
      'linear-gradient(to right, rgba(6,8,7,.96) 0%, rgba(6,8,7,.88) 42%, rgba(6,8,7,.55) 72%, rgba(6,8,7,.8) 100%), linear-gradient(to top, #050807 0%, transparent 55%)',
    accent: '#d8cbb8',
    letterbox: true,
    align: 'end',
    note: '3D render of a corgi puppy with books. Archive grade, letterbox rules, copy anchored low.',
  },
  marketplace: {
    image: '/brand/sections/marketplace.jpg',
    filter: 'saturate(.72) contrast(1.06) brightness(.94)',
    position: '66% 50%',
    motion: 'sweep',
    scrim:
      'linear-gradient(100deg, rgba(5,7,8,.97) 0%, rgba(5,7,8,.86) 40%, rgba(10,14,16,.3) 72%, rgba(5,7,8,.62) 100%), linear-gradient(0deg, rgba(5,7,8,.9), transparent 45%)',
    accent: '#9fb4c2',
    align: 'center',
    note: '3D render of a tabby kitten in a rehoming box. Procedural, institutional grade.',
  },
  shop: {
    image: '/brand/sections/shop.jpg',
    filter: 'saturate(1) contrast(1.05) brightness(1.02)',
    position: '50% 50%',
    motion: 'none',
    scrim:
      'radial-gradient(70% 90% at 62% 45%, rgba(255,236,214,.14), transparent 62%), linear-gradient(92deg, rgba(5,8,7,.96) 0%, rgba(5,8,7,.8) 38%, rgba(5,8,7,.22) 70%, rgba(5,8,7,.6) 100%)',
    accent: '#f6d6ac',
    spotlight: true,
    align: 'center',
    note: '3D render of a vizsla in harness beside product props. High-key retail light.',
  },
  community: {
    image: '/brand/sections/community.jpg',
    filter: 'saturate(1.06) brightness(.96) contrast(1.03)',
    position: '64% 50%',
    motion: 'float',
    scrim:
      'linear-gradient(88deg, rgba(8,6,4,.96) 0%, rgba(10,7,5,.84) 40%, rgba(20,12,8,.2) 74%, rgba(8,6,4,.6) 100%), radial-gradient(60% 70% at 76% 34%, rgba(255,196,140,.2), transparent 68%)',
    accent: '#ffca9a',
    bokeh: true,
    align: 'center',
    note: '3D render of an owner with a dog and kitten at lamp light. Warm, intimate, no faces shown.',
  },
};
