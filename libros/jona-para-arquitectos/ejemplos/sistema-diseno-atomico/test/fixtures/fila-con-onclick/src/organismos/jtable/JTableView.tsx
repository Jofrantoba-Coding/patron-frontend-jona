// Violación de la regla 6: la fila entera navega al detalle con onClick. Ni el teclado la enfoca,
// ni un rastreador encuentra el destino: no hay href. El detalle se enlaza con JLink en una celda.
import { TABLE } from '../../tema/clasesToken.js';

export function JTableView({ filas, onAbrir }: { filas: string[]; onAbrir: (fila: string) => void }) {
  return (
    <table className={TABLE}>
      <tbody>
        {filas.map((fila) => (
          <tr key={fila} onClick={() => onAbrir(fila)}>
            <td>{fila}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
