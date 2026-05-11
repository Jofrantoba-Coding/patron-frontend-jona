import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { UserAvatarMolecule } from './UserAvatarMolecule';
import { ButtonAtom } from '../../atoms/ButtonAtom/ButtonAtom';
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
            <ButtonAtom
              key={i}
              variant={current === i ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setCurrent(i)}
            >
              {u.name.split(' ')[0]}
            </ButtonAtom>
          ))}
        </PanelAtom>
      </PanelAtom>
    );
  },
};
