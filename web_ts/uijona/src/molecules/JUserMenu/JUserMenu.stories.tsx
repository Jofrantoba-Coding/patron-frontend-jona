import type { Meta, StoryObj } from '@storybook/react';
import { fn, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { JUserMenu, JUserMenuItem } from './JUserMenu';

function Menu() {
  const [tema, setTema] = useState('system');
  const items: JUserMenuItem[] = [
    {
      kind: 'radio',
      id: 'tema',
      label: 'Tema',
      value: tema,
      options: [
        { value: 'system', label: 'Sistema' },
        { value: 'light', label: 'Claro' },
        { value: 'dark', label: 'Oscuro' },
      ],
    },
    { kind: 'action', id: 'atajos', label: 'Atajos de teclado' },
    { kind: 'action', id: 'logout', label: 'Cerrar sesión', tone: 'danger' },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', minHeight: '20rem' }}>
      <JUserMenu
        name="Administrador"
        subtitle="Comercial Demo SAC"
        items={items}
        onAction={fn()}
        onRadioChange={(value) => setTema(value)}
      />
    </div>
  );
}

const meta: Meta<typeof JUserMenu> = {
  title: 'Molecules/JUserMenu',
  component: JUserMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JUserMenu es un botón de menú nombrado por el usuario (`aria-haspopup="menu"`). El menú tiene una cabecera no interactiva (nombre y subtítulo), grupos `menuitemradio` con etiqueta (por ejemplo `Tema`: Sistema, Claro, Oscuro) y acciones con tono `danger`. ↑ ↓ Home End recorren, Enter o Espacio activan, Esc cierra en su propia raíz (un diálogo debajo sigue abierto) y un clic fuera también cierra.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JUserMenu>;

export const Default: Story = {
  render: () => <Menu />,
};

export const Open: Story = {
  render: () => <Menu />,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Administrador' }));
  },
};
