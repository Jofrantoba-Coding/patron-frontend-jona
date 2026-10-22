import { createContext, useContext, type ReactNode } from 'react';
import type { AppServices } from './serviceComposer';

const ServicesContext = createContext<AppServices | undefined>(undefined);

/** Gives the registered forms the composed services (the registry maps names to components, not instances). */
export function ServicesProvider({ services, children }: { services: AppServices; children: ReactNode }) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): AppServices {
  const services = useContext(ServicesContext);
  if (!services) throw new Error('useServices needs a ServicesProvider.');
  return services;
}
