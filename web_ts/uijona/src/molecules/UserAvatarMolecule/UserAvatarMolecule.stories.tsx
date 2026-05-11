import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { UserAvatarMolecule } from './UserAvatarMolecule';
import { PanelAtom } from '../../atoms/PanelAtom/PanelAtom';

const meta: Meta<typeof UserAvatarMolecule> = {
  title: 'Molecules/UserAvatarMolecule',
  component: UserAvatarMolecule,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof UserAvatarMolecule>;

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
};

export const Interactive: Story = {
  render: () => {
    const users = [
      { name: 'Jonathan Franck', email: 'jofrantoba@gmail.com' },
      { name: 'Ana García', email: 'ana@empresa.com' },
      { name: 'Carlos Pérez', email: 'carlos@empresa.com' },
    ];
    const [current, setCurrent] = useState(0);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-4 items-start">
        <UserAvatarMolecule name={users[current].name} email={users[current].email} size="md" />
        <PanelAtom variant="ghost" padding="none" className="flex gap-2">
          {users.map((u, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-md border px-3 py-1.5 text-xs ${current === i ? 'bg-neutral-100 font-semibold' : ''}`}
            >
              {u.name.split(' ')[0]}
            </button>
          ))}
        </PanelAtom>
      </PanelAtom>
    );
  },
};
