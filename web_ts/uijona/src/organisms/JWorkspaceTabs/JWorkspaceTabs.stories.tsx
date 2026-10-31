import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { JWorkspaceTab, JWorkspaceTabs } from './JWorkspaceTabs';

const FORMS: JWorkspaceTab[] = [
  { id: 'cliente', title: 'Cliente', dirty: true },
  { id: 'color', title: 'Color' },
  { id: 'localidad', title: 'Localidad' },
  { id: 'transportista', title: 'Transportista' },
  { id: 'banco', title: 'Banco' },
  { id: 'marca', title: 'Marca' },
  { id: 'almacen', title: 'Almacén', dirty: true },
  { id: 'registro-ventas', title: 'Registro de Ventas' },
];

function Workspace({ initial, maxVisible }: { initial: JWorkspaceTab[]; maxVisible?: number }) {
  const [tabs, setTabs] = useState(initial);
  const [activeId, setActiveId] = useState<string | null>(initial[0]?.id ?? null);
  const close = (id: string) => {
    const index = tabs.findIndex((tab) => tab.id === id);
    const rest = tabs.filter((tab) => tab.id !== id);
    setTabs(rest);
    if (id === activeId) setActiveId(rest[Math.min(index, rest.length - 1)]?.id ?? null);
  };
  return (
    <div style={{ height: '18rem' }}>
      <JWorkspaceTabs
        tabs={tabs}
        activeId={activeId}
        maxVisible={maxVisible}
        renderPanel={(id) => (
          <div style={{ padding: '1rem' }}>
            <p>Formulario {tabs.find((tab) => tab.id === id)?.title}</p>
            <input aria-label={`Campo de ${id}`} />
          </div>
        )}
        onSelect={setActiveId}
        onCloseRequest={close}
      />
    </div>
  );
}

const meta: Meta<typeof JWorkspaceTabs> = {
  title: 'Organisms/JWorkspaceTabs',
  component: JWorkspaceTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'JWorkspaceTabs muestra una pestaña por formulario abierto. El `tablist` contiene solo `tab`; cada botón `Cerrar pestaña {título}` está junto a su pestaña pero fuera del `tablist`. El botón y el clic central piden el cierre (`onCloseRequest`): el host decide. Una pestaña `dirty` muestra un punto y la descripción `Cambios sin guardar`. ← → Home End seleccionan al enfocar. Los paneles inactivos siguen montados y `hidden`. Con `maxVisible`, el resto va al menú `Más pestañas` (Esc en su propia raíz). `focusPanel(id)` mueve el foco al panel.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JWorkspaceTabs>;

export const Default: Story = {
  render: () => <Workspace initial={FORMS.slice(0, 3)} />,
};

export const Overflow: Story = {
  render: () => <Workspace initial={FORMS} maxVisible={5} />,
};

export const OverflowOpen: Story = {
  render: () => <Workspace initial={FORMS} maxVisible={5} />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Más pestañas' }));
  },
};
