import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ErrorMessageAtom } from './ErrorMessageAtom';
import { JTextBox } from '../JTextBox/JTextBox';
import { JPanel } from '../JPanel/JPanel';

const meta: Meta<typeof ErrorMessageAtom> = {
  title: 'Atoms/ErrorMessageAtom',
  component: ErrorMessageAtom,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'radio', options: ['error', 'description'] },
  },
};
export default meta;
type Story = StoryObj<typeof ErrorMessageAtom>;

export const Error: Story = {
  args: { message: 'El email no es válido', type: 'error' },
};

export const Description: Story = {
  args: { message: 'Mínimo 8 caracteres con letras y números', type: 'description' },
};

export const Empty: Story = {
  args: { message: '' },
};

export const Interactive: Story = {
  render: () => {
    const [email, setEmail] = useState('');
    const error =
      email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? 'El formato de email no es válido'
        : '';
    return (
      <JPanel variant="ghost" padding="none" style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '280px' }}>
        <JTextBox
          type="email"
          value={email}
          placeholder="correo@ejemplo.com"
          onChange={setEmail}
          hasError={!!error}
        />
        <ErrorMessageAtom message={error} type={error ? 'error' : 'description'} />
      </JPanel>
    );
  },
};
