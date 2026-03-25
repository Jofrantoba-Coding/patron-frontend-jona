// Capa: Template (componente visual)
// Responsabilidad: mostrar la sesion autenticada y delegar acciones del contrato.
// Restricciones: sin router, sin storage y sin backend.
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom';
import { UserAvatarMolecule } from '../../molecules/UserAvatarMolecule';
import { BorderLayout } from '../../uilayouts/BorderLayout';
import { AppFooter } from '../../uiutils/AppFooter';
import { AppHeader } from '../../uiutils/AppHeader';
import type { UiHomeSessionProps } from './UiHomeSessionProps';

export function UiHomeSession({
  name,
  email,
  handlerLogout,
  handlerGoToPublicHome,
}: UiHomeSessionProps) {
  const resolvedName = name || 'Sesion pendiente de hidratar';
  const resolvedEmail = email || 'No hay usuario persistido';

  return (
    <BorderLayout
      north={<AppHeader />}
      south={<AppFooter />}
      center={
        <div className="page-grid page-grid--single">
          <section className="card stack-lg">
            <div className="stack-sm">
              <span className="badge">Authenticated Organism</span>
              <TextAtom as="h1" tone="strong" className="card__title">
                UiHomeSession
              </TextAtom>
              <TextAtom tone="muted">
                El Template solo presenta el estado que recibe o mantiene localmente. La
                lectura del usuario persistido y la limpieza de sesion pertenecen al Impl.
              </TextAtom>
            </div>

            <UserAvatarMolecule name={resolvedName} email={resolvedEmail} />

            <ul className="key-value-list">
              <li>
                <TextAtom tone="muted">Usuario</TextAtom>
                <TextAtom tone="strong">{resolvedName}</TextAtom>
              </li>
              <li>
                <TextAtom tone="muted">Correo</TextAtom>
                <TextAtom tone="strong">{resolvedEmail}</TextAtom>
              </li>
              <li>
                <TextAtom tone="muted">Responsabilidad actual</TextAtom>
                <TextAtom tone="strong">Presentar una sesion ya integrada</TextAtom>
              </li>
            </ul>

            <div className="card__actions">
              <ButtonAtom variant="secondary" onClick={handlerGoToPublicHome}>
                Volver a /login
              </ButtonAtom>
              <ButtonAtom variant="danger" onClick={handlerLogout}>
                Cerrar sesion
              </ButtonAtom>
            </div>
          </section>
        </div>
      }
    />
  );
}
