import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const FeaturesRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });

    setTimeout(() => {
      const el = document.getElementById('features');
      if (el) {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 200);
  }, [navigate]);

  return null;
};