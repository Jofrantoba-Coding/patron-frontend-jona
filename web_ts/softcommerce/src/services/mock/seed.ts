/// <reference types="vite/client" />
import empresas from '../../../mock-server/data/empresas.json';
import localidades from '../../../mock-server/data/localidades.json';
import menu from '../../../mock-server/data/menu.json';
import params from '../../../mock-server/data/params.json';
import permissions from '../../../mock-server/data/permissions.json';
import puntosVenta from '../../../mock-server/data/puntos-venta.json';
import tenants from '../../../mock-server/data/tenants.json';
import ubigeo from '../../../mock-server/data/ubigeo.json';
import users from '../../../mock-server/data/users.json';
import { REGISTRY } from '../../../mock-server/registry/index.js';
import { collectSeeds } from '../../../mock-server/registry/seeds.js';

/** Seed shape consumed by `mock-server/core` (`createStore`). */
export type Seed = Record<string, any>;

/** Catalog seeds, registered automatically from `entry.seed` (R-REG-5). */
const catalogFiles = import.meta.glob<unknown>('../../../mock-server/data/catalogs/*.json', {
  eager: true,
  import: 'default',
});

/**
 * The same JSON files the Node mock server reads from disk: one data source
 * for both sides, so http and mock mode cannot drift apart.
 */
export const seed: Seed = {
  tenants,
  users,
  empresas,
  puntosVenta,
  ubigeo,
  localidades,
  params,
  menu,
  permissions,
  ...collectSeeds(REGISTRY, (name) => catalogFiles[`../../../mock-server/data/catalogs/${name}.json`]),
};
