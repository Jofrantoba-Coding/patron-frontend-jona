import { crearApp } from './App.js';
import { AuthServiceFake } from './servicios/AuthServiceFake.js';
import { AuthServiceHttp } from './servicios/AuthServiceHttp.js';

// Raíz de composición: el único lugar que elige un adaptador.
const servicio = location.search.includes('falso') ? new AuthServiceFake() : new AuthServiceHttp('http://127.0.0.1:4010');
document.body.append(crearApp(servicio));
