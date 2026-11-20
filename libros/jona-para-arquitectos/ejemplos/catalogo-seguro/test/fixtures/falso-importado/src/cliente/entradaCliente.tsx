// Violación de la regla 4: el import estático, con una condición que se evalúa al ejecutar. El
// empaquetador no puede saber que la rama no se usa, y el servicio falso va en el bundle de
// producción; con ?falso en la URL, además, se activa.
import { crearServicioFalso } from './servicioFalso';
import { crearServicioFetch } from './crearServicioFetch';

export const servicio = new URLSearchParams(window.location.search).has('falso') ? crearServicioFalso() : crearServicioFetch();
