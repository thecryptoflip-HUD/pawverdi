import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact — corrections, submissions and enquiries',
  description: 'Contact PawVerdi about corrections, story submissions, seller verification or advertising.',
  alternates: { canonical: '/contact' },
};

const routes = [
  ['Corrections', 'Factual errors, sourcing disputes, or a claim you believe is unsafe.', 'Correct in 24h if animal safety is involved'],
  ['Story submissions', 'First-hand owner accounts with real costs and outcomes.', 'Reply within 10 working days'],
  ['Seller verification', 'Start the five-gate process for marketplace listings.', 'Reply within 5 working days'],
  ['Advertising', 'Inventory enquiries, after a category check.', 'Rate card after category check'],
  ['Privacy / data', 'Access, correction or deletion requests.', 'Actioned within 30 days'],
];

export default function ContactPage() {
  return (
    <div className="vibrant-page">
      <PageHeader
        kicker="Contact"
        title={<>We would love to hear from you.</>}
        intro="Every route below has an owner and a stated response window. Corrections involving animal safety jump the queue."
      />

      <div className="mx-auto max-w-wrap px-5 py-16 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <div className="overflow-x-auto">
              <table className="table min-w-[560px]">
                <caption className="sr-only">Contact routes and response times</caption>
                <thead>
                  <tr>
                    <th scope="col">Topic</th>
                    <th scope="col">What to send</th>
                    <th scope="col">Response</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map(([topic, what, response]) => (
                    <tr key={topic}>
                      <th scope="row" className="text-left font-normal text-cream">
                        {topic}
                      </th>
                      <td className="text-cream/70">{what}</td>
                      <td className="text-cream/60">{response}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-8 text-[0.95rem] text-cream/75">
              Email:{' '}
              <a className="text-gold underline underline-offset-4" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
            <p className="mt-2 text-[0.85rem] text-cream/50">
              PawVerdi cannot give veterinary advice by email. For an unwell animal, contact a licensed veterinarian or an
              emergency service.
            </p>
          </div>

          <form action="/api/contact" method="post" className="grid h-fit gap-4 rounded-2xl border border-white/[0.08] bg-moss/60 p-7">
            <h2 className="font-serif text-xl text-cream">Send a message</h2>
            <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
              Your email
              <input required type="email" name="email" className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
            </label>
            <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
              Topic
              <select name="topic" className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none">
                {routes.map(([topic]) => (
                  <option key={topic} value={topic.toLowerCase()}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-cream/60">
              Message
              <textarea required name="message" rows={5} className="rounded-xl border border-white/15 bg-void/60 px-4 py-3 text-base normal-case tracking-normal text-cream focus:border-amber focus:outline-none" />
            </label>
            <button type="submit" className="btn btn-solid w-full justify-center">
              Send
            </button>
            <p className="text-[0.72rem] leading-relaxed text-cream/45">
              Routed to <code className="text-cream/70">/api/contact</code>. In demo mode the endpoint validates and reports
              that nothing was stored — it will not pretend to deliver mail.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
