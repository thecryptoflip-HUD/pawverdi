import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-wrap flex-col justify-center px-5 py-24 sm:px-8">
      <p className="kicker mb-5">404</p>
      <h1 className="display max-w-[18ch] text-[clamp(2rem,4vw,3.2rem)] text-[#fcf8f1]">
        This page has wandered off.
      </h1>
      <p className="lede mt-5 max-w-[52ch]">
        The link may be old, or the guide may have been renamed during a correction. The knowledge index is the best place
        to pick up the thread.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/knowledge" className="btn btn-solid">
          Knowledge Center
        </Link>
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
      </div>
    </div>
  );
}
