import { TextAtom } from '../atoms/TextAtom';

export function AppFooter() {
  return (
    <div className="app-footer">
      <TextAtom tone="muted">
        Arquetipo didáctico: las decisiones de capa importan más que el conteo de archivos.
      </TextAtom>
    </div>
  );
}
