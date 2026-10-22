import type { CatalogConfig } from '../CatalogConfig';

export interface Localidad {
  id_localidad: string;
  id_empresa: string;
  descripcion: string;
  direccion: string;
  id_ubigeo: string;
  empresa: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

const MAX_TEXT = 100;

/** Localidad (`PanelTFLocalidad` + `RegisterLocalidad`): config only, no template code. */
export const localidadConfig: CatalogConfig<Localidad> = {
  formId: 'mi_localidad',
  title: 'Localidad',
  catalog: 'localidades',
  idKey: 'id_localidad',
  columns: [
    { key: 'descripcion', header: 'Descripción', sortable: true },
    { key: 'direccion', header: 'Dirección', sortable: true },
    { key: 'empresa', header: 'Empresa', sortable: true },
    { key: 'departamento', header: 'Departamento', sortable: true },
    { key: 'provincia', header: 'Provincia', sortable: true },
    { key: 'distrito', header: 'Distrito', sortable: true },
  ],
  fields: [
    { kind: 'select', name: 'id_empresa', label: 'Empresa', required: true, lookup: 'empresas' },
    { kind: 'text', name: 'descripcion', label: 'Descripción', required: true, uppercase: true, maxLength: MAX_TEXT },
    { kind: 'text', name: 'direccion', label: 'Dirección', required: true, uppercase: true, maxLength: MAX_TEXT },
    {
      kind: 'cascade',
      name: 'id_ubigeo',
      lookup: 'ubigeo',
      required: true,
      levels: [
        { name: 'id_departamento', label: 'Departamento' },
        { name: 'id_provincia', label: 'Provincia' },
        // The leaf level carries the field name: the distrito id is `id_ubigeo`.
        { name: 'id_ubigeo', label: 'Distrito' },
      ],
      // INEI codes nest by prefix: departamento 2 digits, provincia 4, distrito 6.
      ancestorsOf: (leafId) => [leafId.slice(0, 2), leafId.slice(0, 4)],
    },
  ],
};
