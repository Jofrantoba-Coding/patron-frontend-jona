// La misma caracterización en cada paso desde el 01. Este archivo es idéntico en todos los pasos
// (lo vigila test/guardas.test.ts): ningún paso puede ajustar la red de seguridad a su gusto.
import { caracterizar } from '../../../caracterizacion/suite.js';

caracterizar(import.meta.url);
