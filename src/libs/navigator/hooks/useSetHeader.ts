import React from 'react';
import { Signal } from '../utils/signal';

type HeaderConfig = {
  title: string;
  showBack: boolean;
};

// A signal that holds the configuration of the visible header
export const headerSignal = new Signal<HeaderConfig>({
  title: 'Home',
  showBack: false,
});

// Helper hook for screens to set their own header
export const useSetHeader = (config: HeaderConfig) => {
  React.useEffect(() => {
    // When this component mounts, we take control of the header
    headerSignal.value = config;

    // Optional: When unmounting, you might want to revert,
    // but usually the incoming screen (previous one) will take over immediately.
  }, [config]);
};
