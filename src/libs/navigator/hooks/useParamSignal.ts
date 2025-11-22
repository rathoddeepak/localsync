import React from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Signal } from '../utils/signal';
/* eslint-enable @typescript-eslint/no-unused-vars */

export const useParamsSignal = (params$: Signal<any>, key: string) => {
  const [val, setVal] = React.useState(params$.value[key]);

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    // Subscribe to the WHOLE object (Simple version)
    // A real Legend implementation would use Proxies for key-based subscription
    return () => {
      if (typeof params$.subscribe === 'function') {
        params$.subscribe(newParams => {
          if (newParams[key] !== val) setVal(newParams[key]);
        });
      }
    };
  }, [params$, key]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return val;
};
