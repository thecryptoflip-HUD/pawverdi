import Link from 'next/link';
import NewsletterForm from '@/components/newsletter-form';
import type { ReactNode } from 'react';
import ArticleCard from '@/components/article-card';
import CareIcon from '@/components/care-icon';
import ResourceCard from '@/components/resource-card';
import { completeArticles } from '@/lib/content';

type Variant = 'cat' | 'knowledge' | 'shop' | 'marketplace' | 'community';
type Card = {title:string;eyebrow:string;description:string;href:string;image:string;action:string};
type Topic = {title:string;icon:string;href:string;image:string};
type VariantData = {
  eyebrow:string;heading:string;summary:string;cards:[Card,Card,Card];
  topicEyebrow:string;topicsHeading:string;topics:Topic[];
  featureEyebrow:string;featureHeading:string;featureIntro:string;featureCards:Card[];
  emailHeading:string;emailText:string;newsletterImage:string;
  trust:[{title:string;body:string},{title:string;body:string},{title:string;body:string}];
};
const common = {
  dog:'/brand/garden/dog-garden.webp',cat:'/brand/garden/cat-garden.webp',
  puppy:'/brand/garden/puppy.webp',kitten:'/brand/garden/kitten.webp',
  nutrition:'/brand/garden/dog-nutrition.webp',catNutrition:'/brand/garden/cat-nutrition.webp',
  training:'/brand/garden/dog-training.webp',grooming:'/brand/garden/dog-grooming.webp',
  catGrooming:'/brand/garden/cat-grooming.webp',enrichment:'/brand/garden/cat-enrichment.webp',
  gear:'/brand/garden/pet-gear.webp',knowledge:'/brand/garden/pets-together.webp',
  community:'/brand/garden/people-pets-garden.webp',bed:'/brand/garden/pet-gear.webp',carrier:'/brand/garden/pet-gear.webp',
};
const data:Record<Variant,VariantData> = {
  cat:{
    eyebrow:'Explore cat care',heading:'Little comforts, big purrs.',summary:'A friendly place to begin with your cat.',
    cards:[
      {title:'Kitten Care',eyebrow:'Start here',description:'Prepare a quiet, comfortable first week.',href:'/knowledge/new-kitten-checklist',image:common.kitten,action:'Kitten checklist'},
      {title:'Everyday Cat Care',eyebrow:'Feel at home',description:'Find guidance on routines and enrichment.',href:'/knowledge?species=cat#guide-search',image:common.cat,action:'Explore cat care'},
      {title:'Cat Gear',eyebrow:'Shop with care',description:'Look for fit and function before buying.',href:'/shop?species=cat#gear-types',image:common.gear,action:'Browse cat gear'},
    ],
    topicEyebrow:'Explore cat topics',topicsHeading:'Popular Cat Care Topics',topics:[
      {title:'Health',icon:'♡',href:'/knowledge?species=cat&section=health#guide-search',image:common.cat},
      {title:'Nutrition',icon:'♧',href:'/knowledge?species=cat&section=nutrition#guide-search',image:common.catNutrition},
      {title:'Enrichment',icon:'✦',href:'/knowledge?species=cat&section=behaviour#guide-search',image:common.enrichment},
      {title:'Grooming',icon:'✂',href:'/knowledge?species=cat&section=grooming#guide-search',image:common.catGrooming},
      {title:'Kitten Care',icon:'❀',href:'/knowledge/new-kitten-checklist',image:common.kitten},
    ],
    featureEyebrow:'Knowledge and guides',featureHeading:'Featured Cat Guides',featureIntro:'Published source-linked guides only; unfinished topics are clearly identified.',
    featureCards:[],
    emailHeading:'Explore More Cat Care Help',emailText:'Get monthly updates with practical new guides and corrections.',newsletterImage:common.cat,
    trust:[{title:'Clear Disclosures',body:'Commercial links are labeled.'},{title:'Practical Guides',body:'Sources and review status are visible.'},{title:'Review Transparency',body:'Veterinary review is never claimed without evidence.'}],
  },
  knowledge:{
    eyebrow:'Knowledge and guides',heading:'Start with trusted sources.',summary:'Find topics and the source-linked guides already published.',
    cards:[
      {title:'Start Here',eyebrow:'Pet parent basics',description:'Prepare for your first pet care milestones.',href:'/knowledge/new-puppy-checklist',image:common.puppy,action:'Puppy basics'},
      {title:'Dog Guides',eyebrow:'For dogs',description:'Browse practical dog care topics.',href:'/knowledge?species=dog#guide-search',image:common.dog,action:'Dog topics'},
      {title:'Cat Guides',eyebrow:'For cats',description:'Explore kitten and cat care knowledge.',href:'/knowledge?species=cat#guide-search',image:common.cat,action:'Cat topics'},
    ],
    topicEyebrow:'Explore by topic',topicsHeading:'Popular Knowledge Topics',topics:[
      {title:'Health',icon:'♡',href:'/knowledge?section=health#guide-search',image:common.dog},
      {title:'Nutrition',icon:'♧',href:'/knowledge?section=nutrition#guide-search',image:common.nutrition},
      {title:'Training',icon:'☆',href:'/knowledge?section=training#guide-search',image:common.training},
      {title:'Grooming',icon:'✂',href:'/knowledge?section=grooming#guide-search',image:common.grooming},
      {title:'Pet Basics',icon:'✿',href:'/knowledge?section=setup#guide-search',image:common.puppy},
    ],
    featureEyebrow:'Knowledge and guides',featureHeading:'Featured Guides',featureIntro:'Only completed, source-linked guides are shown here.',
    featureCards:[],
    emailHeading:'Get More Pet Knowledge',emailText:'Receive a monthly digest of new guides, important updates, and corrections.',newsletterImage:common.dog,
    trust:[{title:'Clear Disclosures',body:'Sponsored content is identifiable.'},{title:'Practical Guides',body:'Read the cited sources and checklists.'},{title:'Review Transparency',body:'Vet review status is clearly labeled.'}],
  },
  shop:{
    eyebrow:'Shop with care',heading:'Find the right fit.',summary:'Start with needs and dimensions before choosing a retailer.',
    cards:[
      {title:'Dog Gear',eyebrow:'For the everyday walk',description:'Look at harnesses and useful essentials.',href:'/shop?species=dog#gear-types',image:common.gear,action:'Browse dog gear'},
      {title:'Cat Gear',eyebrow:'For curious cats',description:'Browse carriers, litter gear, and comfort.',href:'/shop?species=cat#gear-types',image:common.gear,action:'Browse cat gear'},
      {title:'Home Essentials',eyebrow:'Comfort first',description:'Compare practical beds and accessories.',href:'/shop?category=beds#gear-types',image:common.bed,action:'Explore beds'},
    ],
    topicEyebrow:'Explore our shop',topicsHeading:'Popular Shopping Topics',topics:[
      {title:'Harnesses',icon:'♡',href:'/shop?species=dog&category=harnesses#gear-types',image:common.gear},
      {title:'Carriers',icon:'▣',href:'/shop?category=carriers#gear-types',image:common.carrier},
      {title:'Beds',icon:'⌂',href:'/shop?category=beds#gear-types',image:common.bed},
      {title:'Litter',icon:'✦',href:'/shop?category=litter#gear-types',image:common.cat},
      {title:'Cat Essentials',icon:'✿',href:'/shop?species=cat#gear-types',image:common.cat},
    ],
    featureEyebrow:'Shopping guidance',featureHeading:'Explore Pet Gear Categories',featureIntro:'Retailer categories are not PawVerdi-tested products; prices and reviews are not invented.',
    featureCards:[
      {title:'Harness Fit',eyebrow:'Dog gear',description:'Check sizing and attachment points before you buy.',href:'/shop?species=dog&category=harnesses#gear-types',image:common.gear,action:'Browse harnesses'},
      {title:'Comfy Rest',eyebrow:'Beds',description:'Compare dimensions, washability, and returns.',href:'/shop?category=beds#gear-types',image:common.bed,action:'Browse beds'},
      {title:'Travel Ready',eyebrow:'Carriers',description:'Check ventilation and carrier sizing.',href:'/shop?category=carriers#gear-types',image:common.carrier,action:'Browse carriers'},
    ],
    emailHeading:'Get More Gear Ideas',emailText:'Find new gear guides and research updates in the monthly PawVerdi digest.',newsletterImage:common.gear,
    trust:[{title:'Clear Disclosures',body:'Retailer and affiliate links are labeled.'},{title:'Useful Criteria',body:'Fit, safety, and returns matter.'},{title:'No Invented Picks',body:'Test results and prices require evidence.'}],
  },
  marketplace:{
    eyebrow:'Responsible connections',heading:'Care comes before every listing.',summary:'The marketplace is not accepting public animal listings yet.',
    cards:[
      {title:'Adopt & Rehome',eyebrow:'Welfare first',description:'Review placement and adoption standards.',href:'#adoption',image:common.dog,action:'Adoption guidance'},
      {title:'Seller Standards',eyebrow:'Before joining',description:'Read identification and welfare checks.',href:'#sellers',image:common.community,action:'Verification rules'},
      {title:'Pet Care Resources',eyebrow:'Get prepared',description:'Start with the practical pet guides.',href:'/knowledge',image:common.community,action:'Browse knowledge'},
    ],
    topicEyebrow:'Marketplace readiness',topicsHeading:'Popular Marketplace Topics',topics:[
      {title:'Adoption',icon:'♡',href:'#adoption',image:common.dog},
      {title:'Seller Standards',icon:'✓',href:'#sellers',image:common.cat},
      {title:'Pet Supplies',icon:'▣',href:'/shop',image:common.gear},
      {title:'Safe Meetups',icon:'✦',href:'/trust#sellers',image:common.community},
      {title:'Care Guides',icon:'❀',href:'/knowledge',image:common.knowledge},
    ],
    featureEyebrow:'Marketplace resources',featureHeading:'Resources Before Listings',featureIntro:'0 listings published. These are resources, not fictional pets or verified sellers.',
    featureCards:[
      {title:'Understanding Adoption',eyebrow:'Adoption',description:'Start with animal welfare and careful placement.',href:'#adoption',image:common.dog,action:'Read adoption standards'},
      {title:'How Verification Works',eyebrow:'Seller standards',description:'Review documents required before public listings.',href:'#sellers',image:common.cat,action:'View the process'},
      {title:'Prepare for Pet Care',eyebrow:'Care essentials',description:'Read our source-linked introductory checklists.',href:'/knowledge',image:common.knowledge,action:'Start learning'},
    ],
    emailHeading:'Marketplace Updates',emailText:'Read launch updates, welfare resources, and new guide announcements.',newsletterImage:common.dog,
    trust:[{title:'Welfare First',body:'No unverified animal listings.'},{title:'Clear Disclosures',body:'The current marketplace status is visible.'},{title:'Responsible Standards',body:'Identity and welfare checks are required.'}],
  },
  community:{
    eyebrow:'For pet people',heading:'A happy place to connect.',summary:'Stories and community features are developed with safety and moderation in mind.',
    cards:[
      {title:'Pet Stories',eyebrow:'Share responsibly',description:'Send your real story for editorial consideration.',href:'/contact',image:common.dog,action:'Share a pet story'},
      {title:'Helpful Resources',eyebrow:'Learn together',description:'Read useful pet care information.',href:'/knowledge',image:common.enrichment,action:'Explore guides'},
      {title:'Updates & News',eyebrow:'Stay in the loop',description:'Get monthly guide and project updates.',href:'#pv-seven-updates',image:common.community,action:'Updates'},
    ],
    topicEyebrow:'Explore the community',topicsHeading:'Popular Community Topics',topics:[
      {title:'Stories',icon:'♡',href:'/contact',image:common.dog},
      {title:'Questions',icon:'?',href:'/contact',image:common.cat},
      {title:'Pet News',icon:'✦',href:'#pv-seven-updates',image:common.community},
      {title:'Training Tips',icon:'☆',href:'/knowledge?section=training#guide-search',image:common.training},
      {title:'New Pet Tips',icon:'❀',href:'/knowledge?section=setup#guide-search',image:common.puppy},
    ],
    featureEyebrow:'Community resources',featureHeading:'Community Highlights & Guides',featureIntro:'Forums and member stories are not live yet. These links go to real guides or contact options.',
    featureCards:[
      {title:'Share Your Pet Story',eyebrow:'Get involved',description:'Submit an original experience for editorial consideration.',href:'/contact',image:common.community,action:'Contact PawVerdi'},
      {title:'Learn Together',eyebrow:'Care basics',description:'Read source-linked guides for pet parents.',href:'/knowledge',image:common.dog,action:'Browse guides'},
      {title:'Stay Informed',eyebrow:'Monthly updates',description:'Get news as community features become ready.',href:'#pv-seven-updates',image:common.cat,action:'Newsletter details'},
    ],
    emailHeading:'Stay Connected with PawVerdi',emailText:'One email a month with new guides, updates, and corrections.',newsletterImage:common.community,
    trust:[{title:'Friendly Community',body:'People and pets come first.'},{title:'Helpful Resources',body:'Practical information without fake stories.'},{title:'Safety Before Features',body:'Forums launch only with moderation.'}],
  }
};

function ShowcaseCard({card,index}:{card:Card;index:number}) {
 return <Link href={card.href} className={`pv-seven-feature-card pv-seven-tone-${index%3}`}>
    <span className="pv-seven-feature-image">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={card.image} alt="" width={560} height={380} loading="lazy"/></span>
    <span className="pv-seven-feature-copy"><span className="pv-seven-eyebrow">{card.eyebrow}</span><strong>{card.title}</strong><span>{card.description}</span><span className="pv-seven-pill">{card.action} →</span></span>
 </Link>;
}
export default function PawVerdiShowcase({variant, children, featuredContent}:{variant:Variant;children?:ReactNode;featuredContent?:ReactNode}) {
 const page=data[variant];
 const published=variant==='cat' ? completeArticles.filter(a=>a.species==='cat') : completeArticles;
 return <div className={`pv-seven-showcase pv-seven-${variant}`}>
   <section className="pv-seven-feature" aria-label={page.heading}>
      <div className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
        <div className="pv-seven-feature-grid">{page.cards.map((card,i)=><ShowcaseCard key={card.title} card={card} index={i}/>)}</div>
      </div>
   </section>
   <section className="pv-seven-topics" aria-labelledby={`pv-seven-topics-${variant}`}>
     <div className="mx-auto max-w-wrap px-5 py-8 sm:px-8">
       <div className="pv-seven-heading"><div><span className="pv-seven-eyebrow">{page.topicEyebrow}</span><h2 id={`pv-seven-topics-${variant}`}>{page.topicsHeading}</h2></div><Link href={variant==='cat'?'/knowledge?species=cat':variant==='marketplace'?'/trust#sellers':variant==='community'?'/knowledge':variant==='shop'?'/shop':'/knowledge'}>Browse all topics →</Link></div>
       <div className="pv-seven-topic-grid">{page.topics.map((topic,i)=><Link href={topic.href} key={topic.title} className={`pv-seven-topic pv-seven-topic-${i}`}>
         <span className="pv-seven-topic-title"><CareIcon name={topic.title}/><strong>{topic.title}</strong><i aria-hidden="true">✦</i></span>
         {/* eslint-disable-next-line @next/next/no-img-element */}<img src={topic.image} width={420} height={260} alt="" loading="lazy"/>
       </Link>)}</div>
     </div>
   </section>
   <section className="pv-seven-guides" aria-labelledby={`pv-seven-guides-${variant}`}>
     <div className="mx-auto max-w-wrap px-5 py-12 sm:px-8">
       <div className="pv-seven-heading"><div><span className="pv-seven-eyebrow">{page.featureEyebrow}</span><h2 id={`pv-seven-guides-${variant}`}>{page.featureHeading}</h2><p>{page.featureIntro}</p></div><Link href={variant==='cat'?'/knowledge?species=cat':variant==='shop'?'/shop':variant==='marketplace'?'/trust#sellers':variant==='community'?'/contact':'/knowledge'}>Explore more →</Link></div>
       {featuredContent ?? (variant==='knowledge'||variant==='cat' ? <div className="pv-seven-guide-grid">
         {published.map((article)=><div key={article.slug} className="pv-seven-article"><ArticleCard article={article} image={article.species==='cat'?common.kitten:common.puppy}/></div>)}
         {variant==='cat' && <>
           <ResourceCard title="Explore everyday cat care" body="Browse health, nutrition, grooming and enrichment topics. Upcoming guides are clearly marked." href="/knowledge?species=cat#guide-search" image={common.enrichment} label="Topic directory"/>
           <ResourceCard title="Find comfortable cat gear" body="Compare practical carrier and comfort criteria before visiting a retailer." href="/shop?species=cat#gear-types" image={common.gear} label="Gear resource"/>
         </>}
         {published.length===0 && <p>More guides are in preparation.</p>}
       </div> : <div className="pv-seven-guide-grid">{page.featureCards.map((card,i)=><Link href={card.href} key={card.title} className="pv-seven-resource">
         <div className="pv-seven-resource-image">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={card.image} alt="" loading="lazy" width={600} height={340}/></div>
         <div className="pv-seven-resource-copy"><span>{card.eyebrow}</span><h3>{card.title}</h3><p>{card.description}</p><b>{card.action} →</b></div>
       </Link>)}</div>)}
     </div>
   </section>
   {children && <div className="pv-seven-support">{children}</div>}
   <section className="pv-seven-trust" aria-label="PawVerdi publishing and welfare standards">
     <div className="mx-auto grid max-w-wrap gap-5 px-5 py-9 sm:px-8 md:grid-cols-3">{page.trust.map((item,i)=><div key={item.title}><span aria-hidden="true">{['♧','▤','✓'][i]}</span><div><h2>{item.title}</h2><p>{item.body}</p></div></div>)}</div>
     <p className="pb-6 text-center text-sm"><Link href="/trust">Our research, safety, and disclosure standards →</Link></p>
   </section>
   <section id="pv-seven-updates" className="pv-seven-newsletter" aria-label="Email updates">
     <div className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
       <div className="pv-seven-newsletter-shell">
         <div className="pv-seven-newsletter-image">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={page.newsletterImage} alt="" width={600} height={400} loading="lazy"/></div>
         <div className="pv-seven-newsletter-copy"><h2>{page.emailHeading}</h2><p>{page.emailText}</p><NewsletterForm id={`pv-seven-email-${variant}`}/><small>Monthly updates. <Link href="/trust">Read our policies.</Link></small></div>
       </div>
     </div>
   </section>
 </div>;
}
