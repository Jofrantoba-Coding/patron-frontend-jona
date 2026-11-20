// Violación de la regla 5: la vista incrusta su propio JSON-LD, con JSON.stringify a secas.
export function UiProductoView({ nombre }: { nombre: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ name: nombre }) }} />;
}
