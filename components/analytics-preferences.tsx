'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const measurementId = 'G-62K9ZD3ZGP';
const disabledKey = 'ga-disable-G-62K9ZD3ZGP';

interface AnalyticsWindow extends Window {
  dataLayer?: unknown[][];
  [disabledKey]?: boolean;
}

function allowed() {
  return document.cookie.split(';').some(cookie => cookie.trim() === 'pv_analytics=allow');
}

function removeAnalyticsCookies() {
  for (const item of document.cookie.split(';')) {
    const name = item.trim().split('=')[0];
    if (name === 'pv_campaign' || name === '_ga' || name.startsWith('_ga_')) {
      document.cookie = name + '=; Max-Age=0; Path=/';
      document.cookie = name + '=; Max-Age=0; Path=/; Domain=pawverdi.com';
    }
  }
}

export function AnalyticsLoader() {
  const path = usePathname();
  useEffect(() => {
    const api = window as AnalyticsWindow;
    if (!allowed() || path.startsWith('/admin') || location.hostname !== 'pawverdi.com') {
      api[disabledKey] = true;
      return;
    }
    api[disabledKey] = false;
    api.dataLayer ??= [];
    // Google's queue expects the arguments object used by the standard gtag snippet.
    function tag(..._values: unknown[]) {
      api.dataLayer!.push(arguments as unknown as unknown[]);
    }
    if (!document.getElementById('pawverdi-ga')) {
      tag('js', new Date());
      tag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false, send_page_view: false });
      const script = document.createElement('script');
      script.id = 'pawverdi-ga';
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      script.async = true;
      document.head.appendChild(script);
    }
    tag('event', 'page_view', { page_location: location.origin + path, page_title: document.title });
  }, [path]);
  return null;
}

export default function PreferenceControls() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    setEnabled(allowed());
    if (allowed() && new URLSearchParams(location.search).get('saved') === '1') setMessage('Your analytics preference was saved.');
  }, []);
  function save(value: boolean) {
    document.cookie = 'pv_analytics=' + (value ? 'allow' : 'deny') + '; Path=/; Max-Age=15552000; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    if (allowed() !== value) {
      setMessage('Your browser could not save this preference.');
      return;
    }
    if (!value) {
      (window as AnalyticsWindow)[disabledKey] = true;
      removeAnalyticsCookies();
    }
    setEnabled(value);
    setMessage('Your analytics preference was saved.');
    // Reinitialise page-level measurement under the new choice.
    if (value) location.replace(location.pathname + '?saved=1');
  }
  return <section className="mx-auto max-w-[820px] px-5 py-14 sm:px-8">
    <h2 className="font-serif text-2xl text-cream">Optional analytics</h2>
    <p className="my-4 text-cream/85">Google Analytics is {enabled ? 'allowed' : 'off'} in this browser. Your choice is stored for six months. Essential settings and staff sign-in work either way.</p>
    <div className="flex flex-wrap gap-3"><button type="button" className="btn btn-ghost" onClick={() => save(false)}>Keep analytics off</button><button type="button" className="btn btn-ghost" onClick={() => save(true)}>Allow analytics</button></div>
    <p role="status" className="mt-3 text-cream">{message}</p></section>;
}
