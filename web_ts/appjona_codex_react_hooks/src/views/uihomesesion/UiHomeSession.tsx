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
  const headlineName = resolvedName.split(' ')[0] || resolvedName;

  return (
    <BorderLayout
      north={<AppHeader />}
      south={<AppFooter />}
      center={
        <div className="page-grid page-grid--single">
          <div className="session-shell">
            <section className="card session-hero stack-lg">
              <div className="session-head stack-sm">
                <span className="badge">Authenticated Organism</span>
                <TextAtom as="h1" tone="strong" className="card__title">
                  Bienvenido, {headlineName}
                </TextAtom>
                <TextAtom tone="muted">
                  Esta vista prioriza lectura rapida de la sesion activa. El Template
                  presenta estado y acciones; la hidratacion y navegacion real viven en el
                  Impl.
                </TextAtom>
              </div>

              <UserAvatarMolecule name={resolvedName} email={resolvedEmail} />

              <div className="session-kpi-grid">
                <article className="session-kpi-card stack-2xs">
                  <TextAtom as="span" tone="muted" className="eyebrow">
                    Estado
                  </TextAtom>
                  <TextAtom as="strong" tone="strong">
                    Sesion activa
                  </TextAtom>
                </article>

                <article className="session-kpi-card stack-2xs">
                  <TextAtom as="span" tone="muted" className="eyebrow">
                    Capa visible
                  </TextAtom>
                  <TextAtom as="strong" tone="strong">
                    Template
                  </TextAtom>
                </article>

                <article className="session-kpi-card stack-2xs">
                  <TextAtom as="span" tone="muted" className="eyebrow">
                    Integracion real
                  </TextAtom>
                  <TextAtom as="strong" tone="strong">
                    UiHomeSessionImpl
                  </TextAtom>
                </article>
              </div>
            </section>

            <section className="card session-panel stack-lg">
              <div className="stack-sm">
                <TextAtom as="h2" tone="strong" className="session-panel__title">
                  Resumen de la sesion
                </TextAtom>
                <TextAtom tone="muted">
                  El contrato mantiene responsabilidades claras para no mezclar experiencia
                  visual con integraciones de infraestructura.
                </TextAtom>
              </div>

              <ul className="key-value-list key-value-list--compact">
                <li>
                  <TextAtom tone="muted">Usuario</TextAtom>
                  <TextAtom tone="strong">{resolvedName}</TextAtom>
                </li>
                <li>
                  <TextAtom tone="muted">Correo</TextAtom>
                  <TextAtom tone="strong">{resolvedEmail}</TextAtom>
                </li>
                <li>
                  <TextAtom tone="muted">Destino de salida</TextAtom>
                  <TextAtom tone="strong">/login</TextAtom>
                </li>
              </ul>

              <div className="session-actions">
                <ButtonAtom variant="secondary" onClick={handlerGoToPublicHome}>
                  Volver a /login
                </ButtonAtom>
                <ButtonAtom variant="danger" onClick={handlerLogout}>
                  Cerrar sesion
                </ButtonAtom>
              </div>
            </section>
          </div>
        </div>
      }
    />
  );
}
