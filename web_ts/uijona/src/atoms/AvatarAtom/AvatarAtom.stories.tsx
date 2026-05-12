import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { AvatarAtom } from './AvatarAtom';
import { ButtonAtom } from '../ButtonAtom/ButtonAtom';
import { PanelAtom } from '../PanelAtom/PanelAtom';
import { TextAtom } from '../TextAtom/TextAtom';

const meta: Meta<typeof AvatarAtom> = {
  title: 'Atoms/AvatarAtom',
  component: AvatarAtom,
  tags: ['autodocs'],
  argTypes: {
    size:  { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'radio', options: ['circle', 'square'] },
  },
};
export default meta;
type Story = StoryObj<typeof AvatarAtom>;

export const WithInitials: Story = {
  args: { initials: 'JO', size: 'md' },
};

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    alt: 'Usuario',
    size: 'md',
  },
};

export const Square: Story = {
  args: { initials: 'JO', shape: 'square', size: 'md' },
};

export const AllSizes: Story = {
  render: () => (
    <PanelAtom variant="ghost" padding="none" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <AvatarAtom initials="XS" size="xs" />
      <AvatarAtom initials="SM" size="sm" />
      <AvatarAtom initials="MD" size="md" />
      <AvatarAtom initials="LG" size="lg" />
      <AvatarAtom initials="XL" size="xl" />
    </PanelAtom>
  ),
};

export const Interactive: Story = {
  render: () => {
    const users = [
      { initials: 'JF', name: 'Jonathan Franck' },
      { initials: 'AG', name: 'Ana García' },
      { initials: 'CP', name: 'Carlos Pérez' },
    ];
    const [active, setActive] = useState(0);
    return (
      <PanelAtom variant="ghost" padding="none" className="flex flex-col gap-3">
        <PanelAtom variant="ghost" padding="none" className="flex gap-3">
          {users.map((u, i) => (
            <ButtonAtom
              key={i}
              variant="ghost"
              onClick={() => setActive(i)}
              className={`rounded-full p-0.5 border-2 ${active === i ? 'border-primary-500' : 'border-transparent'}`}
            >
              <AvatarAtom initials={u.initials} size="md" />
            </ButtonAtom>
          ))}
        </PanelAtom>
        <TextAtom size="sm" className="text-neutral-600">
          Usuario activo: <strong>{users[active].name}</strong>
        </TextAtom>
      </PanelAtom>
    );
  },
};
