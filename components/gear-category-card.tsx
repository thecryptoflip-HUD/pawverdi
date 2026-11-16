import type { Product } from '@/lib/shop';

export default function GearCategoryCard({ product }: { product: Product }) {
  return <article className="pv-gear-card" data-gear-card={product.id} aria-labelledby={`${product.id}-title`}>
    {/* Category illustrations do not represent a retailer's actual product. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={product.image} alt={product.imageAlt} width={720} height={480} loading="lazy" />
    <div className="pv-gear-card-copy">
      <span className="pv-seven-eyebrow">{product.species === 'dog' ? 'Dog' : product.species === 'cat' ? 'Cat' : 'Pet'} gear · category guide</span>
      <h3 id={`${product.id}-title`}>{product.name}</h3>
      <p>{product.description}</p>
      <ul aria-label="What to compare">{product.considerations.map((item) => <li key={item}>{item}</li>)}</ul>
      <div className="pv-gear-card-action">
        <span id={`${product.id}-disclosure`} className="pv-gear-link-label">
          {product.affiliate ? 'Affiliate link · we may earn a commission' : 'Retailer link · untracked'}
        </span>
        <a href={product.href} data-track={product.affiliate ? 'tracked' : 'UNTRACKED'} target="_blank"
          rel="sponsored nofollow noopener" aria-describedby={`${product.id}-disclosure shop-disclosure`}>
          Browse {product.category} on {product.merchant}
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M7 17 17 7M7 7h10v10" /></svg>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  </article>;
}
