import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { JUserAvatar, JUSERAVATAR_DEFAULTS } from './JUserAvatar';
import { JButton } from '../../atoms/JButton/JButton';

const meta: Meta<typeof JUserAvatar> = {
  title: 'Molecules/JUserAvatar',
  component: JUserAvatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'JUserAvatar muestra el avatar con iniciales del usuario junto a nombre y email opcionales. Soporta tamaños `sm`, `md` y `lg`.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      table: { type: { summary: 'string' }, defaultValue: { summary: JUSERAVATAR_DEFAULTS.size } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JUserAvatar>;

export const Default: Story = {
  args: { name: 'Jonathan Franck', email: 'jofrantoba@gmail.com', size: 'md' },
};

export const Small: Story = {
  args: { name: 'Ana García', email: 'ana@email.com', size: 'sm' },
};

export const Large: Story = {
  args: { name: 'Carlos Pérez', email: 'carlos@email.com', size: 'lg' },
};

export const NoEmail: Story = {
  args: { name: 'Usuario Sin Email' },
  parameters: {
    docs: { description: { story: 'Sin `email`: solo se muestra el nombre bajo las iniciales.' } },
  },
};

export const SingleName: Story = {
  args: { name: 'Jonathan' },
  parameters: {
    docs: { description: { story: 'Nombre de una sola palabra: muestra la inicial única.' } },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: { description: { story: 'Alterna entre distintos usuarios para ver el cambio de iniciales y nombre.' } },
  },
  render: () => {
    const users = [
      { name: 'Jonathan Franck', email: 'jofrantoba@gmail.com' },
      { name: 'Ana García',      email: 'ana@empresa.com' },
      { name: 'Carlos Pérez',    email: 'carlos@empresa.com' },
    ];
    const [current, setCurrent] = useState(0);
    return (
      <div className="flex flex-col gap-4 items-start">
        <JUserAvatar name={users[current].name} email={users[current].email} size="md" />
        <div className="flex gap-2">
          {users.map((u, i) => (
            <JButton
              key={i}
              variant={current === i ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setCurrent(i)}
            >
              {u.name.split(' ')[0]}
            </JButton>
          ))}
        </div>
      </div>
    );
  },
};
