import { useEffect } from 'react';

export const FeaturesRedirect = () => {
  useEffect(() => {
    window.location.replace('/#features');
  }, []);

  return null;
};