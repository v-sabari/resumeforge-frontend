import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

export const MarketingLayout = () => (
  <div className="flex min-h-screen flex-col overflow-x-hidden">
    <Navbar />
    <main className="flex-1 overflow-x-hidden">
      <Outlet />
    </main>
    <Footer />
  </div>
);
