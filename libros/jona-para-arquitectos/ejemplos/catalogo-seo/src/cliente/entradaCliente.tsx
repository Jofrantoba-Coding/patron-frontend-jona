// Entrada del navegador, igual en los dos modos: lee la página que dejó el servidor (o el
// generador estático) e hidrata el mismo árbol, ahora con lo que solo existe en el navegador.
import '@jona-libro/ds-atomico/tokens.css';
import { hydrateRoot } from 'react-dom/client';
import { leerDatosIncrustados } from '../compartido/datosIncrustados';
import { Pagina, type DatosPagina } from '../ui';
import { crearServicioBusquedaFetch } from './crearServicioBusquedaFetch';

const pagina = leerDatosIncrustados<DatosPagina>(document);
const servicios = { busqueda: crearServicioBusquedaFetch(), terminoUrl: new URLSearchParams(location.search).get('q') };

hydrateRoot(document.getElementById('raiz')!, <Pagina pagina={pagina} servicios={servicios} />, {
  onRecoverableError: (error) => console.error('Hidratación con diferencias:', error),
});
