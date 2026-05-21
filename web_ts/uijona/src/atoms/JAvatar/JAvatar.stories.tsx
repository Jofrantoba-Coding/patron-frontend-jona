import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JAvatar, JAVATAR_DEFAULTS } from './JAvatar';
import { JButton } from '../JButton/JButton';
import { JPanel } from '../JPanel/JPanel';
import { JLabel } from '../JLabel';

const meta: Meta<typeof JAvatar> = {
  title: 'Atoms/JAvatar',
  component: JAvatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'JAvatar es el atom de avatar de usuario de JONA. Muestra imagen del usuario, iniciales como fallback, o un placeholder genérico si ninguno está disponible. Soporta 5 tamaños y 2 formas. La imagen se degrada graciosamente a las iniciales cuando falla la carga.',
      },
    },
  },
  args: { onImageError: fn() },
  argTypes: {
    src: {
      description: 'URL de la imagen. Si la URL falla al cargar, se muestra `initials` o el placeholder genérico automáticamente.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    alt: {
      description: 'Texto alternativo de la imagen para lectores de pantalla. Obligatorio cuando se usa `src`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    initials: {
      description: 'Texto de 1-2 letras mostrado como fallback cuando no hay `src` o cuando la imagen falla. Ejemplo: "JF" para Juan Fernández.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    size: {
      description: 'Tamaño del avatar. `xs`=24px, `sm`=32px, `md`=40px (default), `lg`=48px, `xl`=64px.',
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      table: {
        type: { summary: 'JAvatarSize' },
        defaultValue: { summary: JAVATAR_DEFAULTS.size },
      },
    },
    shape: {
      description: 'Forma del avatar. `circle` circular (default, estándar para personas), `square` cuadrado con esquinas redondeadas (para organizaciones o apps).',
      control: 'inline-radio',
      options: ['circle', 'square'],
      table: {
        type: { summary: 'JAvatarShape' },
        defaultValue: { summary: JAVATAR_DEFAULTS.shape },
      },
    },
    onImageError: {
      description: 'Callback cuando la imagen falla al cargar. Útil para logging o reintentar con otra URL.',
      table: { type: { summary: '(event: SyntheticEvent) => void' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JAvatar>;

export const WithInitials: Story = {
  args: { initials: 'JO', size: 'md' },
  parameters: {
    docs: {
      description: { story: 'Avatar con iniciales. Se renderiza con fondo de color primario y texto blanco.' },
    },
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'Usuario',
    size: 'md',
  },
  parameters: {
    docs: {
      description: { story: 'Avatar con imagen. Si la URL falla, se muestra el fallback automáticamente.' },
    },
  },
};

export const Square: Story = {
  args: { initials: 'JO', shape: 'square', size: 'md' },
  parameters: {
    docs: {
      description: { story: 'Forma cuadrada. Usar para organizaciones, equipos o aplicaciones.' },
    },
  },
};

export const Fallback: Story = {
  name: 'Fallback on error',
  args: {
    src: 'https://broken.url/image.png',
    initials: 'FB',
    alt: 'Fallback',
    size: 'md',
  },
  parameters: {
    docs: {
      description: { story: 'La URL de imagen está rota, por lo que el avatar se degrada a las iniciales automáticamente. Sin iniciales mostraría un placeholder genérico.' },
    },
  },
};

export const AllSizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Los 5 tamaños disponibles. `md` es el default para uso general en sidebars y listas.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="md" alignItems="end">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <JPanel key={s} gap="xs" alignItems="center">
          <JAvatar initials={s.toUpperCase()} size={s} />
          <JLabel size="xs" color="muted">{s}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const Shapes: Story = {
  parameters: {
    docs: {
      description: { story: 'Comparación de las 2 formas. `circle` para personas, `square` para organizaciones.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="xl" alignItems="center">
      {(['circle', 'square'] as const).map((sh) => (
        <JPanel key={sh} gap="xs" alignItems="center">
          <JAvatar initials="JO" shape={sh} size="lg" />
          <JLabel size="xs" color="muted">{sh}</JLabel>
        </JPanel>
      ))}
    </JPanel>
  ),
};

export const ImageAllSizes: Story = {
  parameters: {
    docs: {
      description: { story: 'Avatares con imagen en los 5 tamaños.' },
    },
  },
  render: () => (
    <JPanel layout="flow" gap="md" alignItems="end">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s, i) => (
        <JAvatar
          key={s}
          src={`https://i.pravatar.cc/150?img=${i + 1}`}
          alt="Usuario"
          size={s}
        />
      ))}
    </JPanel>
  ),
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Selector de usuario activo. El avatar seleccionado muestra un borde primario.' },
    },
  },
  render: (args) => {
    const users = [
      { initials: 'JF', name: 'Jonathan Franck' },
      { initials: 'AG', name: 'Ana García' },
      { initials: 'CP', name: 'Carlos Pérez' },
    ];
    const [active, setActive] = useState(0);
    return (
      <JPanel gap="sm">
        <JPanel layout="flow" gap="sm">
          {users.map((u, i) => (
            <JButton
              key={i}
              variant="ghost"
              onClick={() => setActive(i)}
              className={`rounded-full p-0.5 border-2 ${active === i ? 'border-primary-500' : 'border-transparent'}`}
            >
              <JAvatar initials={u.initials} size="md" onImageError={args.onImageError} />
            </JButton>
          ))}
        </JPanel>
        <JLabel size="sm" className="text-neutral-600">
          Usuario activo: <strong>{users[active].name}</strong>
        </JLabel>
      </JPanel>
    );
  },
};
