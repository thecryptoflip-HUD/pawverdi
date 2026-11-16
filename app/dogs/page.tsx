import type { Metadata } from 'next';
import Link from 'next/link';
import NewsletterForm from '@/components/newsletter-form';
import CareIcon from '@/components/care-icon';
import ArticleCard from '@/components/article-card';
import AdSlot from '@/components/ad-slot';
import ReferenceDetails from '@/components/reference-details';
import ResourceCard from '@/components/resource-card';
import { articlesBySpecies, breedsBySpecies } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Dog Care — puppy care, nutrition, training, health and grooming',
  description: 'Explore friendly, evidence-aware dog care topics, real published guides and practical gear research from PawVerdi.',
  alternates: { canonical: '/dogs' },
};

const paths = [
  { title: 'Puppy Care', label: 'A happy start', body: 'Prepare for a calm first week with practical, source-linked checklists.', href: '/knowledge/new-puppy-checklist', action: 'Explore puppy care', photo: '/brand/garden/puppy.webp' },
  { title: 'Everyday Care', label: 'For every life stage', body: 'Find clear ideas for everyday walks, health, feeding and wellbeing.', href: '/knowledge?species=dog', action: 'Explore everyday care', photo: '/brand/garden/dog-garden.webp' },
  { title: 'Dog Gear', label: 'Shop thoughtfully', body: 'Compare harnesses, beds and other essentials without invented ratings.', href: '/shop?species=dog', action: 'Browse dog gear', photo: '/brand/garden/pet-gear.webp' },
];

const topics = [
  { title: 'Health', icon: '♡', section: 'health', photo: '/brand/garden/dog-garden.webp' },
  { title: 'Nutrition', icon: '♧', section: 'nutrition', photo: '/brand/garden/dog-nutrition.webp' },
  { title: 'Training', icon: '☆', section: 'training', photo: '/brand/garden/dog-training.webp' },
  { title: 'Grooming', icon: '✂', section: 'grooming', photo: '/brand/garden/dog-grooming.webp' },
  { title: 'Puppy Care', icon: '✿', section: 'setup', photo: '/brand/garden/puppy.webp' },
];

export default function DogsPage() {
  const dogArticles = articlesBySpecies('dog');
  const published = dogArticles.filter((article) => Boolean(article.guide));
  const breedReferences = breedsBySpecies('dog');
  const featured = published.slice(0, 3);
  return (
    <div className="vibrant-page pv-dog-reference">
      <section className="pv-dog-cover" aria-labelledby="dog-main-heading">
        <div className="pv-dog-cover-photo" aria-hidden="true" />
        <div className="pv-dog-cover-shade" aria-hidden="true" />
        <div className="mx-auto flex min-h-[440px] max-w-wrap items-center px-5 pb-20 pt-[calc(76px+58px)] sm:px-8 lg:min-h-[510px]">
          <div className="pv-dog-cover-content">
            <span className="pv-dog-overline">A happier world for pets</span>
            <h1 id="dog-main-heading">Make every day<br /><em>a good dog day.</em></h1>
            <p>Care, training, nutrition and gear — all in one happy place for a healthier, happier dog. Our guidance shows its sources and review status.</p>
            <div className="pv-dog-cover-buttons">
              <Link className="pv-dog-pill pv-dog-pill-coral" href="/knowledge?species=dog">Explore dog care <span aria-hidden="true">→</span></Link>
              <Link className="pv-dog-pill pv-dog-pill-ivory" href="/shop?species=dog">Shop dog gear <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
        <span className="pv-dog-doodle pv-dog-doodle-heart" aria-hidden="true">♡</span>
        <span className="pv-dog-doodle pv-dog-doodle-spark" aria-hidden="true">✦</span>
      </section>

      <div className="pv-dog-paper">
        <div className="mx-auto max-w-wrap px-5 sm:px-8">
          <section className="pv-dog-paths" aria-label="Dog care collections">
            {paths.map((path, index) => (
              <Link className={`pv-dog-path pv-dog-path-${index}`} href={path.href} key={path.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={path.photo} alt="" width={540} height={330} loading="lazy" />
                <div className="pv-dog-path-info">
                  <span>{path.label}</span>
                  <h2>{path.title}</h2>
                  <p>{path.body}</p>
                  <span className="pv-dog-dark-pill">{path.action} <span aria-hidden="true">→</span></span>
                </div>
              </Link>
            ))}
          </section>

          <section className="pv-dog-topic-section" aria-labelledby="popular-dog-topics">
            <div className="pv-dog-section-title">
              <div><p className="pv-dog-label">Explore dog topics</p><h2 id="popular-dog-topics">Popular Dog Care Topics</h2></div>
              <Link href="/knowledge?species=dog">Browse all dog topics <span aria-hidden="true">→</span></Link>
            </div>
            <div className="pv-dog-topic-grid">
              {topics.map((topic, index) => (
                <Link href={`/knowledge?species=dog&section=${topic.section}#guide-search`} key={topic.title} className={`pv-dog-topic pv-dog-topic-${index}`}>
                  <div className="pv-dog-topic-heading"><CareIcon name={topic.title}/><h3>{topic.title}</h3><i aria-hidden="true">✦</i></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={topic.photo} alt="" width={440} height={310} loading="lazy" />
                </Link>
              ))}
            </div>
          </section>

          <section className="pv-dog-guide-section" aria-labelledby="featured-dog-guides">
            <div className="pv-dog-section-title">
              <div><p className="pv-dog-label">Knowledge &amp; guides</p><h2 id="featured-dog-guides">Featured Dog Guides</h2><p className="pv-dog-section-intro">Real published articles with transparent review status and practical information.</p></div>
              <Link href="/knowledge?species=dog">All dog guides <span aria-hidden="true">→</span></Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {featured.map((article, index) => (
                <div className="pv-dog-featured-card" key={article.slug}>
                  <ArticleCard article={article} image={['/brand/garden/puppy.webp', '/brand/garden/pet-gear.webp', '/brand/garden/dog-training.webp'][index]} />
                </div>
              ))}
              <ResourceCard title="Explore dog care topics" body="Browse dog health, nutrition and training topics, with unfinished guides clearly marked." href="/knowledge?species=dog#guide-search" image="/brand/garden/dog-training.webp" label="Topic directory"/>
              <ResourceCard title="Choose gear with care" body="Start with fit, materials and everyday needs. Browse our clearly labeled retailer categories." href="/shop?species=dog#gear-types" image="/brand/garden/pet-gear.webp" label="Gear resource"/>
            </div>
            {featured.length === 0 && <p className="pv-dog-empty">Additional dog guides are in preparation.</p>}
          </section>

          <ReferenceDetails title="Dog breed reference">
<section className="pv-dog-breed-reference" id="breed-reference" aria-labelledby="breed-reference-title">
        <div className="mx-auto max-w-wrap px-5 py-14 sm:px-8">
          <p className="pv-dog-label">Breed reference</p>
          <h2 id="breed-reference-title">Breed reference, not a guarantee</h2>
          <p>Breed tendencies vary by individual. Screening and health needs should be discussed with a veterinarian.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="table min-w-[700px]">
              <caption className="sr-only">Dog breed reference</caption>
              <thead><tr><th scope="col">Breed</th><th scope="col">Size</th><th scope="col">Lifespan</th><th scope="col">Energy</th><th scope="col">Grooming</th></tr></thead>
              <tbody>{breedReferences.map((breed) => <tr key={breed.slug}><th scope="row">{breed.name}</th><td>{breed.size}</td><td>{breed.lifespanYears[0]}–{breed.lifespanYears[1]} yrs</td><td>{breed.energy}</td><td>{breed.grooming}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>
          </ReferenceDetails>

          <section className="pv-dog-trust" aria-label="Our publishing standards">
            <div><span aria-hidden="true">♧</span><div><h2>Clear Disclosures</h2><p>Sponsored content and affiliate links are clearly labeled.</p></div></div>
            <div><span aria-hidden="true">▤</span><div><h2>Practical Guides</h2><p>Real-world help, with sources and review status.</p></div></div>
            <div><span aria-hidden="true">✓</span><div><h2>Transparent Review</h2><p>Veterinary review is in progress, not falsely claimed as complete.</p></div></div>
          </section>

          <section className="pv-dog-subscribe" aria-label="Dog care updates">
            <div className="pv-dog-subscribe-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/garden/dog-garden.webp" alt="Happy dog" width={550} height={390} loading="lazy" />
            </div>
            <div className="pv-dog-subscribe-main">
              <h2>Explore More Dog Care Help</h2>
              <p>Get monthly pet care guides, new research and important corrections delivered to your inbox.</p>
              <NewsletterForm id="dog-newsletter-email" placeholder="Enter your email address"/>
              <p className="pv-dog-subscribe-note">Monthly updates only. <Link href="/trust">Editorial and disclosure standards</Link>.</p>
            </div>
          </section>
        </div>
      </div>

      <div className="pv-dog-ad"><div className="mx-auto max-w-wrap px-5 py-8 sm:px-8"><AdSlot placement="dogs-inline-01" /></div></div>
    </div>
  );
}
