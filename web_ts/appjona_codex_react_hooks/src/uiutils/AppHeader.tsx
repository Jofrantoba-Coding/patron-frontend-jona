import { TextAtom } from '../atoms/TextAtom';

export function AppHeader() {
  return (
    <div className="app-header">
      <div className="stack-2xs">
        <TextAtom as="span" tone="muted" className="eyebrow">
          React Hooks + JONA
        </TextAtom>
        <TextAtom as="strong" tone="strong" className="app-header__brand">
          appjona_codex_react_hooks
        </TextAtom>
      </div>
      <TextAtom tone="muted" className="app-header__caption">
        El contrato vive en la Interface; la integración vive en el Impl.
      </TextAtom>
    </div>
  );
}
