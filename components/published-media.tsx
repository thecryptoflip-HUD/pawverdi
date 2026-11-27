export type PublishedMediaDetails = { path: string; description: string; credit: string };

export default function PublishedMedia({ slug, media }: { slug: string; media: PublishedMediaDetails }) {
  return (
        <figure>
          {/\.(mp4|webm)$/.test(media.path) ? (
            <video
              controls
              muted
              playsInline
              preload="metadata"
              aria-label={media.description}
              src={"/media/" + slug}
            />
          ) : (
            <img
              loading="lazy"
              src={"/media/" + slug}
              alt={media.description}
            />
          )}
          <figcaption>
            {media.description} · {media.credit}
          </figcaption>
        </figure>
  );
}
