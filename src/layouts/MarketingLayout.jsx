import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

export const MarketingLayout = () => (
  // PHASE-3c: `overflow-x-hidden` on the outer container prevents any child
  // element (a wide table, a negative-margin decoration, a fixed-width grid
  // item) from causing a 5px horizontal overflow on narrow viewports like the
  // 390px iPhone width. The homepage's hero blur circles use -right-24/-left-16
  // inside an overflow-hidden section, but other sections (ReferralSection's
  // min-w-[130px] stat boxes, the footer's social links) could collectively
  // push past the viewport. This is a defensive guard that doesn't change any
  // visible layout — it only clips horizontal overflow that would otherwise
  // produce a horizontal scrollbar.
  <div className="flex min-h-screen flex-col overflow-x-hidden">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
