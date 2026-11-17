import catalogue from './pet-photography.json';

type PetPhoto = { src: string; alt: string };
const photos: Record<string, PetPhoto> = catalogue;

/** Each visible placement owns a photo; sharing a subject category never shares an image. */
export function petPhoto(id: string): string {
  if (!photos[id]) throw new Error(`Unassigned PawVerdi photo placement: ${id}`);
  return photos[id].src;
}

export function petPhotoAlt(id: string): string {
  if (!photos[id]) throw new Error(`Unassigned PawVerdi photo placement: ${id}`);
  return photos[id].alt;
}

/** Future guides may omit a photo until a new, distinct illustration is assigned. */
export function guidePhoto(page: string, slug: string): string | undefined {
  return photos[`${page}-guide-${slug}`]?.src;
}
