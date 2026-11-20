// Violación de la regla 5: el título del diálogo es un <h2> escrito a mano.
import { BACKDROP } from '../../tema/clasesToken.js';

export function JConfirmDialogView({ title, titleId }: { title: string; titleId: string }) {
  return (
    <div className={BACKDROP} role="alertdialog" aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>
    </div>
  );
}
