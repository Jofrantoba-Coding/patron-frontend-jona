import { useState } from 'react';
import type { InterUiHomeSession } from './InterUiHomeSession';
import type { UiHomeSessionProps } from './UiHomeSessionProps';

export interface UiHomeSessionTemplateModel
  extends InterUiHomeSession,
    UiHomeSessionProps {
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
    window.alert('La navegacion publica vive en UiHomeSessionImpl.');
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
