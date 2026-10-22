// Layer: public entry. Localidad is the generic crud list over its config; this only supplies the services.
import { useMemo } from 'react';
import { localidadConfig, type Localidad } from '../../catalogs/localidad/localidad.config';
import type { Permissions } from '../../domain/permissions';
import { useServices } from '../../services/ServicesContext';
import { UiCrudList } from '../uicrudlist';

export function UiLocalidad({ permissions }: { permissions: Permissions }) {
  const { catalog, lookup } = useServices();
  // The list refetches when its service changes, so the catalog service is built once.
  const service = useMemo(() => catalog<Localidad>(localidadConfig.catalog), [catalog]);
  return <UiCrudList config={localidadConfig} service={service} lookup={lookup} permissions={permissions} />;
}
