import type { Metadata } from 'next';
import Link from 'next/link';
import CinematicHero from '@/components/cinematic-hero';
import Reveal from '@/components/reveal';
import EditorialPaths from '@/components/editorial-paths';
import ReferenceHighlights from '@/components/reference-highlights';

export const metadata: Metadata = {
  title: 'Community — owner stories, newsletters and what comes next',
  description:
    'Reader stories, the monthly newsletter, and the roadmap for community features. No forums yet, and no fake member counts.',
  alternates: { canonical: '/community' },
};

export default function CommunityPage() {
  return (
    <div className="vibrant-page">
      <CinematicHero variant="community"
        kicker="Community"
        title={<>A welcoming place for pet people.</>}
        intro="Reader stories, corrections and the monthly digest. Comment threads and forums are deliberately not switched on yet — a community needs moderation before it needs a text box."
      />

      <ReferenceHighlights
        eyebrow="For pet people"
        heading="A Little More Joy, Together"
        subtitle="Real stories and useful updates, without invented membership numbers."
        items={[
          {eyebrow:'Your story',title:'Share life with your pet',body:'Submit real experiences for editorial review.',href:'/contact',image:'/brand/sections/community.jpg',action:'Tell us your story'},
          {eyebrow:'Stay informed',title:'One update a month',body:'Learn about new guides and corrections.',href:'#newsletter',image:'/brand/at-home-poster.jpg',action:'Newsletter details'},
          {eyebrow:'Discover',title:'Care that helps',body:'Explore guides for dogs and cats.',href:'/knowledge',image:'/brand/sections/knowledge.jpg',action:'Browse guides'},
        ]}
      />

      <EditorialPaths
        kicker="A welcoming corner"
        heading="Good stories start with good care."
        intro="Our forums are not launched yet. Share your experience, read helpful guides, or subscribe to updates."
        items={[
          { label: 'Share your experience', title: 'Your pet has a story', text: 'Submit a real owner experience for editorial consideration.', href: '/contact', image: '/brand/sections/community.jpg' },
          { label: 'Learn together', title: 'Practical pet guides', text: 'Explore source-linked dog and cat checklists.', href: '/knowledge', image: '/brand/sections/knowledge.jpg' },
          { label: 'Everyday discoveries', title: 'Browse pet gear', text: 'See clearly labeled retailer categories without invented reviews.', href: '/shop', image: '/brand/sections/shop.jpg' },
        ]}
      />
      <section className="py-[clamp(48px,7vw,88px)]">
        <div className="mx-auto grid max-w-wrap gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            <p className="kicker mb-4">Owner stories</p>
            <h2 className="display text-[clamp(1.8rem,3.2vw,2.5rem)] text-[#fcf8f1]">Published with permission, edited for facts.</h2>
            <p className="lede mt-4">
              First-hand accounts are clearly marked as experience, not evidence. We ask contributors to name the costs
              they actually paid and the breed they actually kept, and we cut anything that reads as a product pitch.
            </p>
            <div className="mt-8 rounded-2xl border border-white/[0.08] bg-moss/60 p-7">
              <p className="tag mb-4">Submissions open</p>
              <h3 className="font-serif text-2xl text-cream">0 stories published</h3>
              <p className="mt-3 text-[0.94rem] leading-relaxed text-cream/70">
                The first stories are in editing. Nothing appears here until the contributor has approved the final copy
                and any veterinary claim in their account has been checked — an owner&apos;s experience is not a clinical
                claim, and we will not dress it up as one.
              </p>
              <Link href="/contact" className="btn btn-ghost mt-6">
                Submit your story
              </Link>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border border-white/[0.08] bg-forest p-7">
              <p className="kicker mb-4">Newsletter</p>
              <h3 className="font-serif text-2xl text-cream">One email a month</h3>
              <ul className="mt-4 space-y-3 text-[0.92rem] leading-relaxed text-cream/75">
                {[
                  'New and updated guides, with what changed',
                  'Price re-checks that moved more than 10%',
                  'Marketplace policy and verification changes',
                  'Corrections we issued, in public',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber" />
                    {line}
                  </li>
                ))}
              </ul>
              <form action="/api/newsletter" method="post" className="mt-6 grid gap-3">
                <label htmlFor="community-email" className="text-[0.68rem] uppercase tracking-[0.2em] text-cream/60">
                  Email address
                </label>
                <input
                  id="community-email"
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="rounded-xl border border-white/15 bg-void/60 px-4 py-3.5 text-cream placeholder:text-cream/35 focus:border-amber focus:outline-none"
                />
                <button type="submit" className="btn btn-solid w-full justify-center">
                  Subscribe
                </button>
              </form>
              <p className="mt-3 text-[0.72rem] leading-relaxed text-cream/45">
                Double opt-in, stored for the newsletter only. Unsubscribe link in every send.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/[0.07] bg-forest py-[clamp(56px,8vw,96px)]">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <Reveal className="mb-8 max-w-[620px]">
            <p className="kicker mb-4">Roadmap</p>
            <h2 className="display text-[clamp(1.7rem,3vw,2.4rem)] text-[#fcf8f1]">What is not live yet, and why.</h2>
          </Reveal>
          <div className="overflow-x-auto">
            <table className="table min-w-[680px]">
              <caption className="sr-only">Community roadmap</caption>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Status</th>
                  <th scope="col">Gate before launch</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Reader story submissions', 'Open (editing)', 'Contributor approval + fact pass on any veterinary claim'],
                  ['Monthly newsletter', 'Wired', 'Double opt-in and unsubscribe verified end to end'],
                  ['Comment threads', 'Not started', 'Moderation rota staffed 7 days a week'],
                  ['Owner-to-owner forum', 'Not started', 'Public moderation policy, reporting flow, appeal path'],
                  ['Marketplace messaging', 'Not started', 'Scam-pattern monitoring on every thread'],
                ].map(([feature, status, gate]) => (
                  <tr key={feature}>
                    <th scope="row" className="text-left font-serif text-base font-normal text-cream">
                      {feature}
                    </th>
                    <td className="text-cream/80">{status}</td>
                    <td className="text-cream/65">{gate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
