/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Signal } from '../utils/signal';

export function useSignalValue<T>(signal: Signal<T>): T {
  const [val, setVal] = React.useState(signal.value);

  React.useEffect(() => {
    const unsubscribe = signal.subscribe(setVal);
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [signal]);

  return val;
}
