import Link from 'next/link';
import Hero from '@/components/hero';
import ArticleCard from '@/components/article-card';
import AdSlot from '@/components/ad-slot';
import { completeArticles } from '@/lib/content';

const collections = [
  { label:'Start here', name:'Puppy Care', description:'A calm, prepared start for your new companion.', href:'/knowledge/new-puppy-checklist', image:'/brand/sections/dogs.jpg', action:'Puppy checklist' },
  { label:'For everyday life', name:'Daily Care', description:'Thoughtful routines for health and happiness.', href:'/knowledge?species=dog', image:'/brand/bed.jpg', action:'Dog care guides' },
  { label:'Choose with care', name:'Pet Gear', description:'Beds, carriers and harnesses for real life.', href:'/shop', image:'/brand/sections/shop.jpg', action:'Explore pet gear' },
];

const topics = [
  { label:'Health', glyph:'♡', image:'/brand/sections/dogs.jpg', href:'/knowledge?section=health', tone:'mint' },
  { label:'Nutrition', glyph:'♧', image:'/brand/hero.jpg', href:'/knowledge?section=nutrition', tone:'sun' },
  { label:'Training', glyph:'☆', image:'/brand/sections/community.jpg', href:'/knowledge?section=training', tone:'pink' },
  { label:'Daily setup', glyph:'✦', image:'/brand/sections/knowledge.jpg', href:'/knowledge?section=setup', tone:'blue' },
  { label:'Cats', glyph:'❀', image:'/brand/sections/cats.jpg', href:'/cats', tone:'peach' },
];

const featuredPhotos = ['/brand/sections/dogs.jpg','/brand/sections/cats.jpg','/brand/sections/knowledge.jpg'];
export default function HomePage() {
  // Only published, source-linked guides appear as article cards.
  const guides = completeArticles.slice(0,3);
  return (
    <div className="vibrant-page pv-finished-home">
      <Hero />

      <section className="pv-home-collections" aria-label="Explore pet care collections">
        <div className="mx-auto grid max-w-wrap gap-4 px-5 pb-8 pt-7 sm:px-8 lg:grid-cols-3">
          {collections.map((item,i)=>(
            <Link href={item.href} key={item.name} className={`pv-home-collection pv-home-collection-${i}`}>
              <div className="pv-home-collection-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" width={600} height={390} loading="lazy" />
              </div>
              <div className="pv-home-collection-copy">
                <span className="pv-home-label">{item.label}</span>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <span className="pv-home-round-button">{item.action} <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="pv-home-topics" aria-labelledby="pv-topic-title">
        <div className="mx-auto max-w-wrap px-5 pb-14 pt-6 sm:px-8">
          <div className="pv-home-heading">
            <div><p className="pv-home-label">Explore pet topics</p><h2 id="pv-topic-title">Popular Pet Care Topics</h2></div>
            <Link href="/knowledge">Browse all topics <span aria-hidden="true">→</span></Link>
          </div>
          <div className="pv-home-topic-grid">
            {topics.map(t=>(
              <Link key={t.label} href={t.href} className={`pv-home-topic pv-home-topic-${t.tone}`}>
                <div className="pv-home-topic-name"><span aria-hidden="true">{t.glyph}</span><h3>{t.label}</h3><span aria-hidden="true" className="pv-home-topic-spark">✦</span></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} width={400} height={280} alt="" loading="lazy" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pv-home-guides" aria-labelledby="pv-guides-title">
        <div className="mx-auto max-w-wrap px-5 pb-14 sm:px-8">
          <div className="pv-home-heading">
            <div>
              <p className="pv-home-label">Knowledge &amp; guides</p>
              <h2 id="pv-guides-title">Featured Pet Guides</h2>
              <p className="pv-home-intro">Helpful articles with sources, reading time, and honest review status.</p>
            </div>
            <Link href="/knowledge">All pet guides <span aria-hidden="true">→</span></Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {guides.map((article,i)=><div className="pv-home-article" key={article.slug}>
              <ArticleCard article={article} image={featuredPhotos[i]}/>
            </div>)}
          </div>
          {guides.length===0 && <p>Our first source-linked guides are being prepared.</p>}
        </div>
      </section>

      <section className="pv-home-transparency" aria-label="Why PawVerdi">
        <div className="mx-auto grid max-w-wrap gap-5 px-5 py-8 sm:px-8 md:grid-cols-3">
          <div><span aria-hidden="true">♧</span><div><h2>Clear Disclosures</h2><p>Sponsored content and commercial links are clearly labeled.</p></div></div>
          <div><span aria-hidden="true">▤</span><div><h2>Practical Guides</h2><p>Real-world help with visible sources and review status.</p></div></div>
          <div><span aria-hidden="true">✓</span><div><h2>Review Transparency</h2><p>Veterinary review in progress, never claimed without evidence.</p></div></div>
        </div>
        <p className="pb-6 text-center text-sm"><Link href="/trust">How we research, review and disclose <span aria-hidden="true">→</span></Link></p>
      </section>

      <section className="pv-home-subscribe" aria-labelledby="pv-subscribe-title">
        <div className="mx-auto px-5 py-9 sm:px-8 lg:max-w-wrap">
          <div className="pv-home-subscribe-shell">
            <div className="pv-home-subscribe-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/sections/dogs.jpg" alt="Happy dog in warm sunlight" width={640} height={440} loading="lazy" />
            </div>
            <div className="pv-home-subscribe-copy">
              <h2 id="pv-subscribe-title">Explore More Pet Care Help</h2>
              <p>One useful email each month with new guides, updates and corrections. No invented reviews or daily blasts.</p>
              <form action="/api/newsletter" method="post">
                <label className="sr-only" htmlFor="pv-home-email">Email address</label>
                <input id="pv-home-email" name="email" type="email" required autoComplete="email" placeholder="Enter your email address" />
                <button type="submit">Subscribe <span aria-hidden="true">→</span></button>
              </form>
              <p className="pv-home-subscribe-small">Reader-supported. <Link href="/trust#disclosure">Read our disclosures</Link>.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pv-home-ad" aria-label="Advertising">
        <div className="mx-auto max-w-wrap px-5 py-8 sm:px-8"><AdSlot placement="home-inline-01" format="leaderboard" /></div>
      </section>
    </div>
  );
}
