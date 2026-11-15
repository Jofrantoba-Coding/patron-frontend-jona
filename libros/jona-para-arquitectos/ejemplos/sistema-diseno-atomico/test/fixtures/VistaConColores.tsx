// Fixture: una Vista que se salta el sistema de diseño de todas las formas que el lint vigila.
export function BotonView({ children }: { children: string }) {
  return (
    <button
      className="ds-primary"
      style={{ background: '#1f4e79', color: 'rgb(var(--ds-neutral-50))' }}
    >
      {children}
    </button>
  );
}
