import Link from 'next/link';
import type { ReactNode } from 'react';
import { treatments, type CinematicVariant } from '@/lib/cinematic';

const words: Record<CinematicVariant, {label:string;href:string;action:string}> = {
 dog: {label:'Explore every good dog day',href:'/knowledge?species=dog',action:'Explore dog guides'},
 cat: {label:'For curious cats and their people',href:'/knowledge?species=cat',action:'Explore cat guides'},
 knowledge: {label:'Pet care made clearer',href:'/knowledge?species=dog',action:'Browse dog guides'},
 marketplace: {label:'Thoughtful connections first',href:'/trust#sellers',action:'Our seller standards'},
 shop: {label:'Gear for everyday adventures',href:'/shop?species=dog',action:'Browse dog gear'},
 community: {label:'A community worth caring for',href:'/contact',action:'Share your story'},
};
export default function CinematicHero({variant,kicker,title,intro,children}:{
 variant:CinematicVariant;kicker:string;title:ReactNode;intro?:string;children?:ReactNode;
}) {
 const t=treatments[variant], item=words[variant];
 return (
   <section className={`pv-reference-sectionhero pv-ref-${variant}`} aria-labelledby={`pv-ref-title-${variant}`}>
     <div className="pv-reference-section-photo" aria-hidden="true" style={{backgroundImage:`url("${t.image}")`,backgroundPosition:t.position}} />
     <div className="pv-reference-section-shade" aria-hidden="true" />
     <div className="relative mx-auto flex min-h-[395px] max-w-wrap items-center px-5 pb-20 pt-[calc(76px+58px)] sm:px-8 lg:min-h-[485px]">
       <div className="pv-reference-section-copy">
         <span className="pv-reference-overline">✦ {kicker} · {item.label}</span>
         <h1 id={`pv-ref-title-${variant}`}>{title}</h1>
         {intro && <p>{intro}</p>}
         {children ? <div className="pv-reference-section-actions">{children}</div> :
           <Link href={item.href} className="pv-reference-hero-button pv-reference-hero-coral">{item.action} <span aria-hidden="true">→</span></Link>}
       </div>
     </div>
     <span aria-hidden="true" className="pv-reference-section-spark">✦</span>
   </section>
 );
}
