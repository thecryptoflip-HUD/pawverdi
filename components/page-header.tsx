import type { ReactNode } from 'react';

export default function PageHeader({
  kicker,
  title,
  intro,
  children,
}: {
  kicker: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/[0.07] bg-gradient-to-b from-forest to-void pb-14 pt-[calc(76px+64px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] -top-[30%] h-[560px] w-[560px] rounded-full blur-[90px]"
        style={{ background: 'radial-gradient(circle, rgba(227,165,117,.16), transparent 65%)' }}
      />
      <div className="relative mx-auto max-w-wrap px-5 sm:px-8">
        <p className="kicker mb-5">{kicker}</p>
        <h1 className="display max-w-[20ch] text-[clamp(2.2rem,4.6vw,3.9rem)] text-[#fcf8f1]">{title}</h1>
        {intro && <p className="lede mt-6 max-w-[58ch]">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </header>
  );
}
