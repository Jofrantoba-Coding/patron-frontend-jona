import { useState } from 'react';
import { JButton } from './jbutton/JButton';
import type { InterAuthService, LoginResult } from './services/InterAuthService';
import { UiLogin as UiLoginMinimal } from './uilogin';
import { UiLogin as UiLoginExtended } from './uiloginextendida';

type Form = 'minima' | 'extendida';

/** Solo conoce las entradas de cada unidad (N4). El servicio llega desde main.tsx. */
export function App({ service }: { service: InterAuthService }) {
  const [session, setSession] = useState<LoginResult | undefined>();
  const [form, setForm] = useState<Form>('minima');

  if (session) {
    return (
      <main>
        <h1>Hola, {session.user.nombre}</h1>
        <JButton variant="outline" onClick={() => setSession(undefined)}>Cerrar sesión</JButton>
      </main>
    );
  }

  const UiLogin = form === 'minima' ? UiLoginMinimal : UiLoginExtended;
  return (
    <main>
      <nav>
        <JButton variant={form === 'minima' ? 'default' : 'outline'} onClick={() => setForm('minima')}>Forma mínima</JButton>
        <JButton variant={form === 'extendida' ? 'default' : 'outline'} onClick={() => setForm('extendida')}>Forma extendida</JButton>
      </nav>
      <UiLogin key={form} service={service} onAuthenticated={setSession} />
    </main>
  );
}
