import type { ReglaId } from '../herramientas/jona-check.js';

/** Cada árbol de fixtures/ contiene exactamente una violación: [árbol, regla que la detecta, archivo]. */
export const CASOS: Array<[string, ReglaId, string]> = [
  ['n1-unidad-sin-contrato', 'JONA-N1', 'perfil/PerfilImpl.ts'],
  ['n1-impl-importa-adaptador', 'JONA-N1', 'uilogin/UiLoginImpl.ts'],
  ['n2-contrato-con-funcion', 'JONA-N2', 'uilogin/InterUiLogin.ts'],
  ['n2-defaults-con-funcion', 'JONA-N2', 'jbutton/InterJButton.ts'],
  ['n2-contrato-con-clase', 'JONA-N2', 'uilogin/InterUiLogin.ts'],
  ['n2-contrato-importa-modulo', 'JONA-N2', 'uilogin/InterUiLogin.ts'],
  ['n3-vista-con-fetch', 'JONA-N3', 'jbutton/JButtonView.ts'],
  ['n3-vista-importa-adaptador', 'JONA-N3', 'uilogin/UiLoginView.ts'],
  ['n3-contrato-importa-adaptador', 'JONA-N3', 'uilogin/InterUiLogin.ts'],
  ['n3-entrada-con-almacenamiento', 'JONA-N3', 'jbutton/JButton.ts'],
  ['n4-importa-impl', 'JONA-N4', 'App.ts'],
  ['n4-importa-vista', 'JONA-N4', 'App.ts'],
  ['n4-unidad-importa-contrato-ajeno', 'JONA-N4', 'jbutton/JButtonView.ts'],
  // Forma de Plantilla: la Implementación hereda de la base y es la entrada; la base es interna.
  ['n4-importa-base-de-plantilla', 'JONA-N4', 'App.ts'],
];
