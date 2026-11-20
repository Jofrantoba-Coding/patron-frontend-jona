// Violación de la regla 5: la vista escribe el <title>. React 19 lo llevaría a la cabeza, pero se
// salta el contrato de metadatos y la canónica, la descripción y el JSON-LD quedan en otro lugar.
export function UiProductoView({ nombre }: { nombre: string }) {
  return (
    <>
      <title>{nombre}</title>
      <h2>{nombre}</h2>
    </>
  );
}
