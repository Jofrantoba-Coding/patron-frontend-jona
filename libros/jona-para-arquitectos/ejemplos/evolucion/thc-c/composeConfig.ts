// Reconstrucción para análisis (no es el código original) de: Harol Rodriguez, "Patrón THC / THC-C", Medium, 2026-03-21,
// https://medium.com/@elbugdepajarito/patr%C3%B3n-thc-thc-c-2e7887a03921. Reproduce sus tipos y su estructura de módulos.
// Configuración global del Composer. En modo real, como queda tras la integración del Test Plan.
export const composeConfig = {
  register: {
    useMock: false,
    scenario: 'exitoso',
  },
} as const;

export type FeatureKey = keyof typeof composeConfig;
