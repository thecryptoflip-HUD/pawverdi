import { Fragment } from 'react';
import type { Guide } from '@/lib/guides';

function CitationText({ text }: { text: string }) {
  return <>{text.split(/(\[\d+\])/).map((part, i) => {
    const citation = /^\[(\d+)\]$/.exec(part);
    return citation ? (
      <a key={i} href={`#source-${citation[1]}`} aria-label={`Source ${citation[1]}`} className="ml-0.5 text-[0.8em] text-gold underline underline-offset-2">{part}</a>
    ) : <Fragment key={i}>{part}</Fragment>;
  })}</>;
}

export default function GuideBody({ guide }: { guide: Guide }) {
  return (
    <div data-guide-body className="prose-paw space-y-7 text-[1rem] leading-[1.8] text-cream/85 sm:text-[1.05rem]">
      <p>{guide.introduction}</p>
      <nav aria-label="On this page" className="rounded-2xl border border-white/10 bg-moss/50 p-5">
        <h2 className="!mt-0 font-serif text-xl text-cream">On this page</h2>
        <ul className="mt-3 space-y-1">
          {guide.sections.map((section) => <li key={section.id}><a href={`#${section.id}`} className="inline-block py-2 text-[0.9rem] text-gold underline underline-offset-4">{section.title}</a></li>)}
        </ul>
      </nav>
      {guide.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-28">
          <h2 className="mb-4 font-serif text-[1.6rem] leading-tight text-[#fcf8f1]">{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}><CitationText text={paragraph} /></p>)}
          {section.items && <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-amber">{section.items.map((item) => <li key={item}><CitationText text={item} /></li>)}</ul>}
        </section>
      ))}
    </div>
  );
}
