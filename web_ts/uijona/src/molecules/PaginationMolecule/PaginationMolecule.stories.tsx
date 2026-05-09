import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { PaginationMolecule } from './PaginationMolecule';

const meta: Meta<typeof PaginationMolecule> = {
  title: 'Molecules/PaginationMolecule',
  component: PaginationMolecule,
  tags: ['autodocs'],
  args: { onPageChange: fn(), onPrevious: fn(), onNext: fn() },
  argTypes: {
    currentPage:  { control: { type: 'number', min: 1, max: 20 } },
    totalPages:   { control: { type: 'number', min: 1, max: 20 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
  },
};
export default meta;
type Story = StoryObj<typeof PaginationMolecule>;

export const Default: Story = {
  args: { currentPage: 5, totalPages: 10 },
};

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 10 },
};

export const LastPage: Story = {
  args: { currentPage: 10, totalPages: 10 },
};

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <p>Página actual: <strong>{page}</strong> de 15</p>
        <PaginationMolecule
          currentPage={page}
          totalPages={15}
          onPageChange={setPage}
        />
      </div>
    );
  },
};
