// Capa: Template
// Responsabilidad: componer layout + organismo de login + contenido explicativo.
// Restricciones: no importar backend, router ni storage.
import { useState } from 'react';
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom';
import { BorderLayout } from '../../uilayouts/BorderLayout';
import { AppFooter } from '../../uiutils/AppFooter';
import { AppHeader } from '../../uiutils/AppHeader';
import { UiIniciarSesion } from '../uiiniciarsesion/UiIniciarSesion';
import type { UiIniciarSesionProps } from '../uiiniciarsesion/UiIniciarSesionProps';
import type { InterUiHome } from './InterUiHome';

export interface UiHomeProps {
  loginVm: UiIniciarSesionProps;
  isPatternGuideVisible: boolean;
  handlerOpenPatternGuide: () => void;
  handlerClosePatternGuide: () => void;
}

export interface UiHomeTemplateModel extends InterUiHome {
  isPatternGuideVisible: boolean;
  setPatternGuideVisible: (value: boolean) => void;
  handlerOpenPatternGuide: () => void;
  handlerClosePatternGuide: () => void;
}

export interface UiHomeViewModel extends UiHomeTemplateModel {
  loginVm: UiIniciarSesionProps;
}

export function useUiHome(): UiHomeTemplateModel {
  const [isPatternGuideVisible, setPatternGuideVisible] = useState(true);

  function openPatternGuide(): void {
    setPatternGuideVisible(true);
  }

  function closePatternGuide(): void {
    setPatternGuideVisible(false);
  }

  return {
    isPatternGuideVisible,
    setPatternGuideVisible,
    openPatternGuide,
    closePatternGuide,
    handlerOpenPatternGuide: openPatternGuide,
    handlerClosePatternGuide: closePatternGuide,
  };
}

export function UiHome({
  loginVm,
  isPatternGuideVisible,
  handlerOpenPatternGuide,
  handlerClosePatternGuide,
}: UiHomeProps) {
  return (
    <BorderLayout
      north={<AppHeader />}
      south={<AppFooter />}
      center={
        <div className="page-grid">
          <section className="stack-lg">
            <div className="card stack-lg">
              <div className="hero-copy">
                <span className="badge">Page / Main Organism</span>
                <TextAtom as="h1" tone="strong" className="card__title">
                  UiHomeView registra la ruta; UiIniciarSesion concentra el contrato de login.
                </TextAtom>
                <TextAtom tone="muted">
                  La intención del patrón es que no busques métodos de negocio dentro de
                  cientos de líneas visuales. La Interface declara capacidades, el Template
                  compone la UI y el Impl integra servicios reales.
                </TextAtom>
              </div>

              <ul className="key-value-list">
                <li>
                  <TextAtom tone="muted">Interface</TextAtom>
                  <TextAtom tone="strong">Contrato de capacidades públicas</TextAtom>
                </li>
                <li>
                  <TextAtom tone="muted">Template</TextAtom>
                  <TextAtom tone="strong">Estado local, handlers y composición visual</TextAtom>
                </li>
                <li>
                  <TextAtom tone="muted">Implementation</TextAtom>
                  <TextAtom tone="strong">Backend, router, storage y errores externos</TextAtom>
                </li>
                <li>
                  <TextAtom tone="muted">View</TextAtom>
                  <TextAtom tone="strong">Punto de entrada registrado en rutas</TextAtom>
                </li>
              </ul>
            </div>

            {isPatternGuideVisible ? (
              <aside className="card guide-panel stack-sm">
                <TextAtom as="strong" tone="strong">
                  Guía de lectura del arquetipo
                </TextAtom>
                <TextAtom tone="muted">
                  1. Lee la Interface para conocer el contrato. 2. Lee el Template para
                  entender estado y composición. 3. Lee el Impl para ver integraciones reales.
                </TextAtom>
                <ButtonAtom variant="ghost" onClick={handlerClosePatternGuide}>
                  Ocultar guía y persistir decisión
                </ButtonAtom>
              </aside>
            ) : (
              <div className="card stack-sm">
                <TextAtom tone="muted">
                  La guía fue cerrada desde el Impl y persistida en storage.
                </TextAtom>
                <ButtonAtom variant="ghost" onClick={handlerOpenPatternGuide}>
                  Volver a mostrar guía
                </ButtonAtom>
              </div>
            )}
          </section>

          <UiIniciarSesion {...loginVm} />
        </div>
      }
    />
  );
}
