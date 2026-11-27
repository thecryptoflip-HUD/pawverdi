'use client';

import { useEffect, useRef, useState } from 'react';

const clips = [
  { id: 'lMS29FGqRNY', title: 'Maru and the box', credit: 'mugumogu', end: 18 },
  { id: 'nGeKSiCQkPw', title: 'Ultimate Dog Tease', credit: 'Talking Animals', end: 23 },
  { id: 'teue4UTF5sE', title: 'Dachshund ball hockey', credit: 'Crusoe the Dachshund', end: 15 },
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
      setNotice('Player unavailable. Use the original video link below.');
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

  return <section id="pet-reel" aria-labelledby="reel-title" className="pt-24 pb-6">
    <div className="mx-auto grid max-w-wrap items-center gap-5 px-5 sm:px-8 md:grid-cols-2">
      <div>
        <h2 id="reel-title" className="text-3xl font-bold text-emerald-950">The funny pet reel</h2>
        <p className="my-2">Three clips in 56 seconds. One determined cat and two dogs with other plans.</p>
        <ol className="divide-y divide-emerald-900/15">{clips.map((c,i)=><li key={c.id}>
          <button type="button" onClick={()=>pick(i)} aria-current={selected===i} className="flex w-full items-center justify-between gap-4 py-2 text-left text-emerald-950">
            <strong>{c.title}</strong><small>{c.credit}</small>
          </button>
        </li>)}</ol>
      </div>
      <div>
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-emerald-950">
          <div ref={host} className="absolute inset-0" />
          {!playing && <button type="button" onClick={()=>pick(selected)} className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 p-5 text-white">
            <span className="font-serif text-3xl">Maru and the box</span>
            <span className="rounded-full bg-emerald-950 px-5 py-3 font-bold text-white">▶ Play the reel</span>
          </button>}
        </div>
        <p aria-live="polite" className="mt-2 text-sm">{notice} {clips[selected].credit} · <a className="underline" href={'https://www.youtube.com/watch?v='+clips[selected].id}>Watch original on YouTube</a></p>
      </div>
    </div>
  </section>;
}
