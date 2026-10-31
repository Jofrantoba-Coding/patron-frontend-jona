// Violación: la vista llama a la Implementación; solo puede conocer el contrato de UI.
import { useUiLoginImpl } from '../model/UiLoginImpl';

export function UiLoginView() {
  const { title } = useUiLoginImpl();
  return <h1>{title}</h1>;
}
