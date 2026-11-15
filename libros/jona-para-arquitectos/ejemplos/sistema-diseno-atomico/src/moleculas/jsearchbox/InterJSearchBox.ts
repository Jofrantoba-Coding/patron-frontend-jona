// Contrato de UI del buscador: una molécula (campo + botón) con estado de interacción propio.

export interface InterJSearchBox {
  /** Nombre accesible del campo y de la región de búsqueda. */
  label: string;
  placeholder?: string;
  submitLabel?: string;
  /** Se llama al enviar, con el término ya recortado. Qué se busca y dónde lo decide la aplicación. */
  onSearch: (term: string) => void;
}

/** Lo que dibuja la vista: el contrato más el borrador que el usuario escribe. */
export interface InterJSearchBoxVista extends Required<Pick<InterJSearchBox, 'label' | 'submitLabel'>> {
  placeholder?: string;
  term: string;
  onTermChange: (term: string) => void;
  onSubmit: () => void;
}

/** Solo configuración de presentación. */
export const JSEARCHBOX_DEFAULTS = {
  submitLabel: 'Buscar',
} as const satisfies Required<Pick<InterJSearchBox, 'submitLabel'>>;
