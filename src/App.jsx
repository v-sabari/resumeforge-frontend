import { BrowserRouter }  from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import { AppRoutes }      from './routes/AppRoutes';
import { CookieBanner }   from './components/common/CookieBanner';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
      <CookieBanner />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
