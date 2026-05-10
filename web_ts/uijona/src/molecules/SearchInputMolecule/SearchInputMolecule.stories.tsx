import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { SearchInputMolecule } from './SearchInputMolecule';

const meta: Meta<typeof SearchInputMolecule> = {
  title: 'Molecules/SearchInputMolecule',
  component: SearchInputMolecule,
  tags: ['autodocs'],
  args: {
    placeholder: 'Search customers',
    onSearch: fn(),
    onChange: fn(),
    onClear: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SearchInputMolecule>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
    defaultValue: 'revenue',
  },
};

export const Interactive: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const allItems = ['React', 'Vue', 'Angular', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind CSS', 'Storybook'];
    const filtered = query
      ? allItems.filter((i) => i.toLowerCase().includes(query.toLowerCase()))
      : allItems;
    return (
      <div className="flex flex-col gap-3 w-72">
        <SearchInputMolecule
          placeholder="Buscar tecnología..."
          onSearch={setQuery}
          onChange={(v) => setQuery(v)}
          onClear={() => setQuery('')}
        />
        <ul className="text-sm text-neutral-600 flex flex-col gap-1">
          {filtered.length > 0
            ? filtered.map((i) => (
                <li key={i} className="px-2 py-1 rounded hover:bg-neutral-100">{i}</li>
              ))
            : <li className="text-neutral-400 px-2">Sin resultados para &quot;{query}&quot;</li>}
        </ul>
      </div>
    );
  },
};
