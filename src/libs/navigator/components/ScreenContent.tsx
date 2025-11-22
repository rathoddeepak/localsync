import { RouteDef } from '../types/route';

type ScreenContentProps = {
  route: RouteDef;
};

/**
 * SCREEN CONTENT
 * Handles the "Fine Grained" params updates.
 */
export const ScreenContent = ({ route }: ScreenContentProps) => {
  // We assume the component is an observer or uses our hooks
  const Component = route.component;

  // Pass signals down so the User Component can choose to listen granularly
  return (
    <Component
      params={route.paramsSignal.value} // For legacy compat (will re-render on param change)
      params$={route.paramsSignal} // For Legend-style fine-grained access
    />
  );
};
