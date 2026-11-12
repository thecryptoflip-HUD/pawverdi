import Link from 'next/link';
export default function CommunityInvitation() {
  return (
    <section className="pv-invitation">
      <div className="mx-auto grid max-w-wrap items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-[.8fr_1.2fr]">
        <div className="pv-invite-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/at-home-poster.jpg" alt="Dog and cat resting comfortably together" width={1200} height={900} loading="lazy" />
        </div>
        <div>
          <span className="pv-eyebrow">A little more joy in your inbox</span>
          <h2 className="pv-display mt-4">Join the PawVerdi community.</h2>
          <p className="mt-4 max-w-[52ch]">Get a monthly digest of practical new guides, updates and corrections. Unsubscribe any time.</p>
          <form action="/api/newsletter" method="post" className="pv-invite-form mt-7">
            <label htmlFor="pv-invite-email" className="sr-only">Email address</label>
            <input id="pv-invite-email" name="email" type="email" placeholder="Your email address" autoComplete="email" required />
            <button type="submit">Join updates <span aria-hidden="true">→</span></button>
          </form>
          <p className="mt-3 text-xs">Only the monthly digest. <Link href="/trust">Our privacy and editorial policies</Link>.</p>
        </div>
      </div>
    </section>
  );
}
