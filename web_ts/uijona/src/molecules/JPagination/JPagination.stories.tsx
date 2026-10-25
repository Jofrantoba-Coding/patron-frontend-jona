import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JPagination } from './JPagination';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JPagination> = {
  title: 'Molecules/JPagination',
  component: JPagination,
  tags: ['autodocs'],
  args: { onPageChange: fn(), onPrevious: fn(), onNext: fn() },
  argTypes: {
    currentPage:  { control: { type: 'number', min: 1, max: 20 } },
    totalPages:   { control: { type: 'number', min: 1, max: 20 } },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
  },
};
export default meta;
type Story = StoryObj<typeof JPagination>;

export const Default: Story = {
  args: { currentPage: 5, totalPages: 10 },
};

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 10 },
};

export const LastPage: Story = {
  args: { currentPage: 10, totalPages: 10 },
};

/** Rows info (R-DAT-7): `{first}–{last} de {total}`. */
export const RowsInfo: Story = {
  args: { currentPage: 1, totalPages: 7, totalRows: 134, pageSize: 20, showRowsInfo: true },
};

export const RowsInfoLastPage: Story = {
  args: { currentPage: 7, totalPages: 7, totalRows: 134, pageSize: 20, showRowsInfo: true },
};

/** With no rows only the info shows: `0 de 0`. */
export const RowsInfoEmpty: Story = {
  args: { currentPage: 1, totalPages: 1, totalRows: 0, pageSize: 20, showRowsInfo: true },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      source: {
        code: `const [page, setPage] = useState(1);

<JPagination
  currentPage={page}
  totalPages={15}
  onPageChange={setPage}
/>`,
      },
    },
  },
  args: {
    onPageChange: fn(),
  },
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <JPanel variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <JLabel>Página actual: <strong>{page}</strong> de 15</JLabel>
        <JPagination
          currentPage={page}
          totalPages={15}
          onPageChange={(p) => { args.onPageChange?.(p); setPage(p); }}
        />
      </JPanel>
    );
  },
};
