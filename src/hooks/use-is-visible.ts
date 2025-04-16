import {useState, useEffect} from 'react';

export const useIsVisible = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return isVisible;
};
