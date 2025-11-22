import { useContext } from 'react';
import { NavContext } from '../components/NavigationStack';

export const useNav = () => {
  const store = useContext(NavContext);
  if (!store) throw new Error('Wrap in LegendaryStack');
  return {
    push: (name: string, params?: any) => store.push(name, params),
    pop: () => store.pop(),
  };
};
