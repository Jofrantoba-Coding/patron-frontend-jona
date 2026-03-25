// Capa: Template (componente visual)
// Responsabilidad: componer layout + organismo de login + contenido explicativo.
// Restricciones: no importar backend, router ni storage.
import { ButtonAtom } from '../../atoms/ButtonAtom';
import { TextAtom } from '../../atoms/TextAtom';
import { BorderLayout } from '../../uilayouts/BorderLayout';
import { AppFooter } from '../../uiutils/AppFooter';
import { AppHeader } from '../../uiutils/AppHeader';
import { UiIniciarSesion } from '../uiiniciarsesion/UiIniciarSesion';
import type { UiHomeProps } from './UiHomeProps';

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
                  La intencion del patron es que no busques metodos de negocio dentro de
                  cientos de lineas visuales. La Interface declara capacidades, el Template
                  compone la UI y el Impl integra servicios reales.
                </TextAtom>
              </div>

              <ul className="key-value-list">
                <li>
                  <TextAtom tone="muted">Interface</TextAtom>
                  <TextAtom tone="strong">Contrato de capacidades publicas</TextAtom>
                </li>
                <li>
                  <TextAtom tone="muted">Template</TextAtom>
                  <TextAtom tone="strong">Estado local, handlers y composicion visual</TextAtom>
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
                  Guia de lectura del arquetipo
                </TextAtom>
                <TextAtom tone="muted">
                  1. Lee la Interface para conocer el contrato. 2. Lee el Template para
                  entender estado y composicion. 3. Lee el Impl para ver integraciones reales.
                </TextAtom>
                <ButtonAtom variant="ghost" onClick={handlerClosePatternGuide}>
                  Ocultar guia y persistir decision
                </ButtonAtom>
              </aside>
            ) : (
              <div className="card stack-sm">
                <TextAtom tone="muted">
                  La guia fue cerrada desde el Impl y persistida en storage.
                </TextAtom>
                <ButtonAtom variant="ghost" onClick={handlerOpenPatternGuide}>
                  Volver a mostrar guia
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
