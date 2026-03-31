import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

export const MarketingLayout = () => (
  <div className="min-h-screen text-slate-900">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);
