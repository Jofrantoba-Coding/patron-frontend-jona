export interface CatalogosPageContract {
  catalogos: Array<{ code: string; values: string[] }>;
  estructuras: import('../../core/models').EstructuraArchivo[];
}
