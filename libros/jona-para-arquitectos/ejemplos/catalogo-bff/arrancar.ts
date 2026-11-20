// npm start: los dos backends simulados, con datos de ejemplo, y el BFF delante de ellos.
// Puertos fijos por defecto (BFF 4020, catalogo 4021, inventario 4022); con 0, uno libre.
// El BFF escucha en 4020 porque es la VITE_API_URL por defecto de aplicacion-catalogo.
import { crearServidorCatalogo } from './backends/catalogo/servidorCatalogo.js';
import { escuchar } from './backends/http.js';
import { crearServidorInventario } from './backends/inventario/servidorInventario.js';
import { crearBff } from './src/app/crearBff.js';

const EJEMPLOS = [
  { sku: 'TEC-001', titulo: 'Teclado mecánico', precioCentimos: 12000, unidades: 8 },
  { sku: 'MOU-002', titulo: 'Mouse inalámbrico', precioCentimos: 4550, unidades: 20 },
  { sku: 'MON-003', titulo: 'Monitor de 24 pulgadas', precioCentimos: 69900, unidades: 3 },
];

const puerto = (nombre: string, porDefecto: number) => Number(process.env[nombre] ?? porDefecto);

const catalogo = await escuchar(
  crearServidorCatalogo(EJEMPLOS.map(({ sku, titulo, precioCentimos }) => ({ sku, titulo, precioCentimos }))),
  puerto('CATALOGO_PUERTO', 4021),
);
console.log(`Backend catalogo listo en ${catalogo.url}`);

const inventario = await escuchar(crearServidorInventario(EJEMPLOS.map(({ sku, unidades }) => ({ sku, unidades }))), puerto('INVENTARIO_PUERTO', 4022));
console.log(`Backend inventario listo en ${inventario.url}`);

const bff = await escuchar(
  crearBff({ CATALOGO_URL: catalogo.url, INVENTARIO_URL: inventario.url, BFF_CORS_ORIGEN: process.env.BFF_CORS_ORIGEN }),
  puerto('BFF_PUERTO', 4020),
);
console.log(`BFF listo en ${bff.url}`);
