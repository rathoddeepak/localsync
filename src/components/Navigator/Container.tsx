import React from 'react';
import { AppHeader } from '../common/AppHeader';

export const NavigationContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <React.Fragment>
      <AppHeader />
      {children}
    </React.Fragment>
  );
};
