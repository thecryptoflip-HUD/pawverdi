export default function CareIcon({ name }: { name: string }) {
  let drawing;
  if (/nutrition/i.test(name)) drawing = <><path d="M4 12h24l-2 13H6L4 12Z"/><path d="M7 12c0-5 18-5 18 0M10 8l1-3m5 2V3m5 5 1-3"/></>;
  else if (/groom/i.test(name)) drawing = <><circle cx="8" cy="24" r="4"/><circle cx="24" cy="24" r="4"/><path d="m11 21 14-17M21 21 7 4"/></>;
  else if (/training|guides|basics|knowledge/i.test(name)) drawing = <><path d="m3 10 13-6 13 6-13 6-13-6ZM8 13v10c5 4 11 4 16 0V13M29 10v13"/></>;
  else if (/puppy|kitten|pet tips/i.test(name)) drawing = <><ellipse cx="8" cy="9" rx="3" ry="4"/><ellipse cx="24" cy="9" rx="3" ry="4"/><ellipse cx="13" cy="5" rx="2.5" ry="3.5"/><ellipse cx="19" cy="5" rx="2.5" ry="3.5"/><path d="M16 14c-4 0-9 6-9 10 0 5 6 5 9 2 3 3 9 3 9-2 0-4-5-10-9-10Z"/></>;
  else if (/health/i.test(name)) drawing = <><path d="M16 28S3 20 3 11C3 3 13 2 16 9 19 2 29 3 29 11c0 9-13 17-13 17Z"/><path d="M6 16h6l3-6 3 12 3-6h5"/></>;
  else if (/gear|supplies|carrier|litter|beds|harness/i.test(name)) drawing = <><rect x="5" y="10" width="22" height="18" rx="4"/><path d="M11 10V7a5 5 0 0 1 10 0v3M11 17h10M16 14v6"/></>;
  else if (/enrich|questions|stories|news|meet|community/i.test(name)) drawing = <><path d="M4 5h24v17H16l-7 6v-6H4V5Z"/><path d="M10 11h12M10 16h8"/></>;
  else drawing = <><path d="M16 28S3 20 3 11C3 3 13 2 16 9 19 2 29 3 29 11c0 9-13 17-13 17Z"/></>;
  return <svg className="pv-care-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawing}</svg>;
}
