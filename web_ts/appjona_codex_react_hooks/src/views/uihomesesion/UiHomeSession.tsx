// Capa: Template
// Responsabilidad: mostrar la sesión autenticada y delegar acciones del contrato.
// Restricciones: sin router, sin storage y sin backend.
import { useState } from 'react';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom';
import { UserAvatarMolecule } from '../../molecules/UserAvatarMolecule';
import { BorderLayout } from '../../uilayouts/BorderLayout';
import { AppFooter } from '../../uiutils/AppFooter';
import { AppHeader } from '../../uiutils/AppHeader';
import type { InterUiHomeSession } from './InterUiHomeSession';

export interface UiHomeSessionProps {
  name: string;
  email: string;
  handlerLogout: () => void;
  handlerGoToPublicHome: () => void;
}

export interface UiHomeSessionTemplateModel extends InterUiHomeSession, UiHomeSessionProps {
  setName: (value: string) => void;
  setEmail: (value: string) => void;
}

export function useUiHomeSession(): UiHomeSessionTemplateModel {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  function logout(): void {
    window.alert('El Template no limpia storage ni cambia rutas; eso vive en el Impl.');
  }

  function goToPublicHome(): void {
    window.alert('La navegación pública vive en UiHomeSessionImpl.');
  }

  function handlerLogout(): void {
    logout();
  }

  function handlerGoToPublicHome(): void {
    goToPublicHome();
  }

  return {
    name,
    email,
    setName,
    setEmail,
    logout,
    goToPublicHome,
    handlerLogout,
    handlerGoToPublicHome,
  };
}

export function UiHomeSession({
  name,
  email,
  handlerLogout,
  handlerGoToPublicHome,
}: UiHomeSessionProps) {
  const resolvedName = name || 'Sesión pendiente de hidratar';
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
                lectura del usuario persistido y la limpieza de sesión pertenecen al Impl.
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
                <TextAtom tone="strong">Presentar una sesión ya integrada</TextAtom>
              </li>
            </ul>

            <div className="card__actions">
              <ButtonAtom variant="secondary" onClick={handlerGoToPublicHome}>
                Volver a /login
              </ButtonAtom>
              <ButtonAtom variant="danger" onClick={handlerLogout}>
                Cerrar sesión
              </ButtonAtom>
            </div>
          </section>
        </div>
      }
    />
  );
}
