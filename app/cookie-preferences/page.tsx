import type { Metadata } from 'next';
import PageHeader from '@/components/page-header';
import PreferenceControls from '@/components/analytics-preferences';

export const metadata: Metadata = { title: 'Cookie preferences', description: 'Choose whether PawVerdi may use optional analytics in this browser.', alternates: { canonical: '/cookie-preferences' } };
export default function CookiePreferences() {
  return <div className="vibrant-page"><PageHeader kicker="Privacy" title="Cookie preferences" intro="Choose whether to share optional measurements about visits to PawVerdi."/><PreferenceControls/></div>;
}
