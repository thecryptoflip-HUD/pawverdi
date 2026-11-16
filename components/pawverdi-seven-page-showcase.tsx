import Link from 'next/link';
import ArticleCard from '@/components/article-card';
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
  dog:'/brand/sections/dogs.jpg',cat:'/brand/sections/cats.jpg',
  gear:'/brand/sections/shop.jpg',knowledge:'/brand/sections/knowledge.jpg',
  community:'/brand/sections/community.jpg',bed:'/brand/bed.jpg',carrier:'/brand/carrier.jpg',
};
const data:Record<Variant,VariantData> = {
  cat:{
    eyebrow:'Explore cat care',heading:'Little comforts, big purrs.',summary:'A friendly place to begin with your cat.',
    cards:[
      {title:'Kitten Care',eyebrow:'Start here',description:'Prepare a quiet, comfortable first week.',href:'/knowledge/new-kitten-checklist',image:common.cat,action:'Kitten checklist'},
      {title:'Everyday Cat Care',eyebrow:'Feel at home',description:'Find guidance on routines and enrichment.',href:'/knowledge?species=cat',image:common.carrier,action:'Explore cat care'},
      {title:'Cat Gear',eyebrow:'Shop with care',description:'Look for fit and function before buying.',href:'/shop?species=cat',image:common.gear,action:'Browse cat gear'},
    ],
    topicEyebrow:'Explore cat topics',topicsHeading:'Popular Cat Care Topics',topics:[
      {title:'Health',icon:'♡',href:'/knowledge?species=cat&section=health',image:common.cat},
      {title:'Nutrition',icon:'♧',href:'/knowledge?species=cat&section=nutrition',image:common.carrier},
      {title:'Enrichment',icon:'✦',href:'/knowledge?species=cat&section=behaviour',image:common.community},
      {title:'Grooming',icon:'✂',href:'/knowledge?species=cat&section=grooming',image:common.bed},
      {title:'Kitten Care',icon:'❀',href:'/knowledge/new-kitten-checklist',image:common.cat},
    ],
    featureEyebrow:'Knowledge and guides',featureHeading:'Featured Cat Guides',featureIntro:'Published source-linked guides only; unfinished topics are clearly identified.',
    featureCards:[],
    emailHeading:'Explore More Cat Care Help',emailText:'Get monthly updates with practical new guides and corrections.',newsletterImage:common.cat,
    trust:[{title:'Clear Disclosures',body:'Commercial links are labeled.'},{title:'Practical Guides',body:'Sources and review status are visible.'},{title:'Review Transparency',body:'Veterinary review is never claimed without evidence.'}],
  },
  knowledge:{
    eyebrow:'Knowledge and guides',heading:'Start with trusted sources.',summary:'Find topics and the source-linked guides already published.',
    cards:[
      {title:'Start Here',eyebrow:'Pet parent basics',description:'Prepare for your first pet care milestones.',href:'/knowledge/new-puppy-checklist',image:common.dog,action:'Puppy basics'},
      {title:'Dog Guides',eyebrow:'For dogs',description:'Browse practical dog care topics.',href:'/knowledge?species=dog',image:common.dog,action:'Dog topics'},
      {title:'Cat Guides',eyebrow:'For cats',description:'Explore kitten and cat care knowledge.',href:'/knowledge?species=cat',image:common.cat,action:'Cat topics'},
    ],
    topicEyebrow:'Explore by topic',topicsHeading:'Popular Knowledge Topics',topics:[
      {title:'Health',icon:'♡',href:'/knowledge?section=health',image:common.dog},
      {title:'Nutrition',icon:'♧',href:'/knowledge?section=nutrition',image:common.carrier},
      {title:'Training',icon:'☆',href:'/knowledge?section=training',image:common.community},
      {title:'Grooming',icon:'✂',href:'/knowledge?section=grooming',image:common.cat},
      {title:'Pet Basics',icon:'✿',href:'/knowledge?section=setup',image:common.knowledge},
    ],
    featureEyebrow:'Knowledge and guides',featureHeading:'Featured Guides',featureIntro:'Only completed, source-linked guides are shown here.',
    featureCards:[],
    emailHeading:'Get More Pet Knowledge',emailText:'Receive a monthly digest of new guides, important updates, and corrections.',newsletterImage:common.dog,
    trust:[{title:'Clear Disclosures',body:'Sponsored content is identifiable.'},{title:'Practical Guides',body:'Read the cited sources and checklists.'},{title:'Review Transparency',body:'Vet review status is clearly labeled.'}],
  },
  shop:{
    eyebrow:'Shop with care',heading:'Find the right fit.',summary:'Start with needs and dimensions before choosing a retailer.',
    cards:[
      {title:'Dog Gear',eyebrow:'For the everyday walk',description:'Look at harnesses and useful essentials.',href:'/shop?species=dog',image:common.dog,action:'Browse dog gear'},
      {title:'Cat Gear',eyebrow:'For curious cats',description:'Browse carriers, litter gear, and comfort.',href:'/shop?species=cat',image:common.cat,action:'Browse cat gear'},
      {title:'Home Essentials',eyebrow:'Comfort first',description:'Compare practical beds and accessories.',href:'/shop?category=beds',image:common.bed,action:'Explore beds'},
    ],
    topicEyebrow:'Explore our shop',topicsHeading:'Popular Shopping Topics',topics:[
      {title:'Harnesses',icon:'♡',href:'/shop?species=dog&category=harnesses',image:common.gear},
      {title:'Carriers',icon:'▣',href:'/shop?category=carriers',image:common.carrier},
      {title:'Beds',icon:'⌂',href:'/shop?category=beds',image:common.bed},
      {title:'Litter',icon:'✦',href:'/shop?category=litter',image:common.cat},
      {title:'Shop by Pet',icon:'✿',href:'/shop?species=cat',image:common.dog},
    ],
    featureEyebrow:'Shopping guidance',featureHeading:'Explore Pet Gear Categories',featureIntro:'Retailer categories are not PawVerdi-tested products; prices and reviews are not invented.',
    featureCards:[
      {title:'Harness Fit',eyebrow:'Dog gear',description:'Check sizing and attachment points before you buy.',href:'/shop?species=dog&category=harnesses',image:common.gear,action:'Browse harnesses'},
      {title:'Comfy Rest',eyebrow:'Beds',description:'Compare dimensions, washability, and returns.',href:'/shop?category=beds',image:common.bed,action:'Browse beds'},
      {title:'Travel Ready',eyebrow:'Carriers',description:'Check ventilation and carrier sizing.',href:'/shop?category=carriers',image:common.carrier,action:'Browse carriers'},
    ],
    emailHeading:'Get More Gear Ideas',emailText:'Find new gear guides and research updates in the monthly PawVerdi digest.',newsletterImage:common.gear,
    trust:[{title:'Clear Disclosures',body:'Retailer and affiliate links are labeled.'},{title:'Useful Criteria',body:'Fit, safety, and returns matter.'},{title:'No Invented Picks',body:'Test results and prices require evidence.'}],
  },
  marketplace:{
    eyebrow:'Responsible connections',heading:'Care comes before every listing.',summary:'The marketplace is not accepting public animal listings yet.',
    cards:[
      {title:'Adopt & Rehome',eyebrow:'Welfare first',description:'Review placement and adoption standards.',href:'#adoption',image:common.dog,action:'Adoption guidance'},
      {title:'Seller Standards',eyebrow:'Before joining',description:'Read identification and welfare checks.',href:'#sellers',image:common.cat,action:'Verification rules'},
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
      {title:'Helpful Resources',eyebrow:'Learn together',description:'Read useful pet care information.',href:'/knowledge',image:common.cat,action:'Explore guides'},
      {title:'Updates & News',eyebrow:'Stay in the loop',description:'Get monthly guide and project updates.',href:'#newsletter',image:common.community,action:'Updates'},
    ],
    topicEyebrow:'Explore the community',topicsHeading:'Popular Community Topics',topics:[
      {title:'Stories',icon:'♡',href:'/contact',image:common.dog},
      {title:'Questions',icon:'?',href:'/contact',image:common.cat},
      {title:'Pet News',icon:'✦',href:'#newsletter',image:common.community},
      {title:'Training Tips',icon:'☆',href:'/knowledge?section=training',image:common.gear},
      {title:'New Pet Tips',icon:'❀',href:'/knowledge?section=setup',image:common.knowledge},
    ],
    featureEyebrow:'Community resources',featureHeading:'Community Highlights & Guides',featureIntro:'Forums and member stories are not live yet. These links go to real guides or contact options.',
    featureCards:[
      {title:'Share Your Pet Story',eyebrow:'Get involved',description:'Submit an original experience for editorial consideration.',href:'/contact',image:common.community,action:'Contact PawVerdi'},
      {title:'Learn Together',eyebrow:'Care basics',description:'Read source-linked guides for pet parents.',href:'/knowledge',image:common.dog,action:'Browse guides'},
      {title:'Stay Informed',eyebrow:'Monthly updates',description:'Get news as community features become ready.',href:'#newsletter',image:common.cat,action:'Newsletter details'},
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
export default function PawVerdiShowcase({variant}:{variant:Variant}) {
 const page=data[variant];
 const published=variant==='cat' ? completeArticles.filter(a=>a.species==='cat') : completeArticles;
 return <div className={`pv-seven-showcase pv-seven-${variant}`}>
   <section className="pv-seven-feature" aria-label={page.heading}>
      <div className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
        <div className="pv-seven-heading"><div><span className="pv-seven-eyebrow">{page.eyebrow}</span><h2>{page.heading}</h2></div><p>{page.summary}</p></div>
        <div className="pv-seven-feature-grid">{page.cards.map((card,i)=><ShowcaseCard key={card.title} card={card} index={i}/>)}</div>
      </div>
   </section>
   <section className="pv-seven-topics" aria-labelledby={`pv-seven-topics-${variant}`}>
     <div className="mx-auto max-w-wrap px-5 py-8 sm:px-8">
       <div className="pv-seven-heading"><div><span className="pv-seven-eyebrow">{page.topicEyebrow}</span><h2 id={`pv-seven-topics-${variant}`}>{page.topicsHeading}</h2></div><Link href={variant==='cat'?'/knowledge?species=cat':variant==='marketplace'?'/trust#sellers':variant==='community'?'/knowledge':variant==='shop'?'/shop':'/knowledge'}>Browse all topics →</Link></div>
       <div className="pv-seven-topic-grid">{page.topics.map((topic,i)=><Link href={topic.href} key={topic.title} className={`pv-seven-topic pv-seven-topic-${i}`}>
         <span className="pv-seven-topic-title"><b aria-hidden="true">{topic.icon}</b><strong>{topic.title}</strong><i aria-hidden="true">✦</i></span>
         {/* eslint-disable-next-line @next/next/no-img-element */}<img src={topic.image} width={420} height={260} alt="" loading="lazy"/>
       </Link>)}</div>
     </div>
   </section>
   <section className="pv-seven-guides" aria-labelledby={`pv-seven-guides-${variant}`}>
     <div className="mx-auto max-w-wrap px-5 py-12 sm:px-8">
       <div className="pv-seven-heading"><div><span className="pv-seven-eyebrow">{page.featureEyebrow}</span><h2 id={`pv-seven-guides-${variant}`}>{page.featureHeading}</h2><p>{page.featureIntro}</p></div><Link href={variant==='cat'?'/knowledge?species=cat':variant==='shop'?'/shop':variant==='marketplace'?'/trust#sellers':variant==='community'?'/contact':'/knowledge'}>Explore more →</Link></div>
       {variant==='knowledge'||variant==='cat' ? <div className="pv-seven-guide-grid">
         {published.map((article,i)=><div key={article.slug} className="pv-seven-article"><ArticleCard article={article} image={i%2===0?common.dog:common.cat}/></div>)}
         {published.length===0 && <p>More guides are in preparation.</p>}
       </div> : <div className="pv-seven-guide-grid">{page.featureCards.map((card,i)=><Link href={card.href} key={card.title} className="pv-seven-resource">
         <div className="pv-seven-resource-image">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={card.image} alt="" loading="lazy" width={600} height={340}/></div>
         <div className="pv-seven-resource-copy"><span>{card.eyebrow}</span><h3>{card.title}</h3><p>{card.description}</p><b>{card.action} →</b></div>
       </Link>)}</div>}
     </div>
   </section>
   <section className="pv-seven-trust" aria-label="PawVerdi publishing and welfare standards">
     <div className="mx-auto grid max-w-wrap gap-5 px-5 py-9 sm:px-8 md:grid-cols-3">{page.trust.map((item,i)=><div key={item.title}><span aria-hidden="true">{['♧','▤','✓'][i]}</span><div><h2>{item.title}</h2><p>{item.body}</p></div></div>)}</div>
     <p className="pb-6 text-center text-sm"><Link href="/trust">Our research, safety, and disclosure standards →</Link></p>
   </section>
   <section id="pv-seven-updates" className="pv-seven-newsletter" aria-label="Email updates">
     <div className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
       <div className="pv-seven-newsletter-shell">
         <div className="pv-seven-newsletter-image">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={page.newsletterImage} alt="" width={600} height={400} loading="lazy"/></div>
         <div className="pv-seven-newsletter-copy"><h2>{page.emailHeading}</h2><p>{page.emailText}</p><form action="/api/newsletter" method="post"><label className="sr-only" htmlFor={`pv-seven-email-${variant}`}>Email address</label><input id={`pv-seven-email-${variant}`} type="email" name="email" autoComplete="email" placeholder="Your email address" required/><button type="submit">Subscribe →</button></form><small>Subscription storage depends on site configuration. <Link href="/trust">Read our policies.</Link></small></div>
       </div>
     </div>
   </section>
 </div>;
}
