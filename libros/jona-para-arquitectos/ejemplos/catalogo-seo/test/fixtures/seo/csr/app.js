// Contraejemplo (no se ejecuta en las pruebas): los metadatos y el contenido existen solo después
// de que este script corre. En el HTML que entrega el servidor no están.
const sku = location.pathname.split('/').pop();
document.title = `Producto ${sku} | Tienda JONA`;
const canonica = Object.assign(document.createElement('link'), { rel: 'canonical', href: location.href });
document.head.append(canonica);
document.getElementById('root').innerHTML = `<h1>Producto ${sku}</h1>`;
