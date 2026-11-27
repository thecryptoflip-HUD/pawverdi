'use client';

import { useEffect, useRef, useState } from 'react';

const clips = [
  { id: 'lMS29FGqRNY', title: 'Maru and the box', credit: 'mugumogu', end: 18 },
  { id: 'nGeKSiCQkPw', title: 'Ultimate Dog Tease', credit: 'Talking Animals', end: 23 },
  { id: 'teue4UTF5sE', title: 'Dachshund ball hockey', credit: 'Crusoe the Dachshund', end: 15 },
  { id: 'J---aiyznGQ', title: 'Keyboard Cat', credit: 'Charlie Schmidt', end: 18 },
  { id: 'pYrOty3N2-4', title: 'Dachshund miners', credit: 'Crusoe the Dachshund', end: 18 },
  { id: 'XjZLLcARc6Y', title: 'Sliding Cat Maru', credit: 'mugumogu', end: 20 },
];

type Player = {
  destroy(): void;
  loadVideoById(clip: { videoId: string; startSeconds: number; endSeconds: number }): void;
};
type YouTube = { Player: new (node: HTMLElement, options: Record<string, unknown>) => Player };
const apiWindow = () => window as Window & { YT?: YouTube; onYouTubeIframeAPIReady?: () => void };
let loading: Promise<YouTube> | undefined;

function loadAPI() {
  const win = apiWindow();
  if (win.YT?.Player) return Promise.resolve(win.YT);
  return loading ??= new Promise<YouTube>((resolve, reject) => {
    const script = document.createElement('script');
    const fail = () => { clearTimeout(timeout); script.remove(); loading = undefined; reject(new Error('Player unavailable')); };
    const timeout = window.setTimeout(fail, 12000);
    win.onYouTubeIframeAPIReady = () => {
      if (!win.YT?.Player) return fail();
      clearTimeout(timeout);
      resolve(win.YT);
    };
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = fail;
    document.head.append(script);
  });
}

export default function PetReel() {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const index = useRef(0);
  const [selected, select] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState('');
  function pick(i: number) {
    index.current = i;
    select(i);
    setNotice('');
    setPlaying(true);
    const clip = clips[i];
    player.current?.loadVideoById({videoId: clip.id, startSeconds: 0, endSeconds: clip.end});
  }
  useEffect(() => {
    if (!playing || !host.current) return;
    const container = host.current;
    let disposed = false;
    let instance: Player | undefined;
    const fail = () => {
      if (disposed) return;
      setNotice('Player unavailable. Try the YouTube link.');
      setPlaying(false);
    };
    loadAPI().then(api => {
      if (disposed) return;
      const target = document.createElement('div');
      container.replaceChildren(target);
      const load = (i: number) => {
        index.current = i;
        select(i);
        const clip = clips[i];
        instance?.loadVideoById({videoId:clip.id, startSeconds:0, endSeconds:clip.end});
      };
      instance = new api.Player(target, {
        host:'https://www.youtube-nocookie.com', width:'100%', height:'100%',
        playerVars:{ playsinline:1, origin:location.origin, rel:0 },
        events:{
          onReady:() => { if (!disposed) { player.current = instance ?? null; load(index.current); } },
          onStateChange:({data}: {data:number}) => {
            if (disposed || data !== 0) return;
            if (index.current + 1 < clips.length) load(index.current + 1);
            else { setPlaying(false); index.current = 0; select(0); }
          },
          onError:fail,
        },
      });
    }).catch(fail);
    return () => { disposed = true; player.current = null; instance?.destroy(); container.replaceChildren(); };
  }, [playing]);

  const current = clips[selected];

  return (
    <section id="pet-reel" aria-labelledby="reel-title" className="pb-5 pt-20 sm:pt-24">
      <div className="mx-auto max-w-wrap px-4 sm:px-8">
        <div className="grid gap-3 rounded-2xl border border-emerald-900/15 bg-emerald-50/75 p-3 sm:p-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] md:items-start md:gap-x-5">
          <header className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 md:col-start-1 md:row-start-1">
            <h2 id="reel-title" className="text-2xl font-bold text-emerald-950">The funny pet reel</h2>
            <p className="text-sm text-emerald-900">{clips.length} short clips</p>
          </header>

          <div className="md:col-start-2 md:row-span-2 md:row-start-1">
            <div className="relative aspect-video min-h-[200px] overflow-hidden rounded-xl bg-emerald-950">
              <div ref={host} className="absolute inset-0" />
              {!playing && (
                <button
                  type="button"
                  onClick={() => pick(selected)}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-3 text-white focus-visible:outline focus-visible:-outline-offset-4 focus-visible:outline-white"
                >
                  <span className="font-serif text-xl">{current.title}</span>
                  <span className="rounded-full bg-emerald-950 px-3 py-1.5 text-sm font-semibold">▶ Play the reel</span>
                </button>
              )}
            </div>
            <p aria-live="polite" className="mt-1.5 text-xs text-emerald-950">
              {notice && <span>{notice} </span>}
              {current.credit} · <a className="underline underline-offset-2" href={`https://www.youtube.com/watch?v=${current.id}`}>Watch on YouTube</a>
            </p>
          </div>

          <ol className="grid list-none grid-cols-2 gap-1.5 p-0 md:col-start-1 md:row-start-2">
            {clips.map((clip, i) => (
              <li key={clip.id}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-current={selected === i ? 'true' : undefined}
                  className="flex h-full w-full items-center justify-between gap-1.5 rounded-lg border border-emerald-900/15 bg-white/70 px-2.5 py-1.5 text-left text-emerald-950 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-emerald-800 aria-[current=true]:border-emerald-800 aria-[current=true]:bg-emerald-100"
                >
                  <strong className="break-words text-sm leading-tight">{clip.title}</strong>
                  <span className="shrink-0 text-xs tabular-nums">{clip.end}s</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
