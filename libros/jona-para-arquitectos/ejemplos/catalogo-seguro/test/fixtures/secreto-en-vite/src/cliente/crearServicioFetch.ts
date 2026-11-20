// Violación de la regla 3: la clave de la API de productos, compilada en el bundle del cliente.
export function listar() {
  return fetch('https://api.productos.example/v1/productos', { headers: { 'X-Api-Key': import.meta.env.VITE_PRODUCTOS_API_KEY } });
}
