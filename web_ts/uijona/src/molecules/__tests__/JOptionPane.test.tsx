import { render, screen, within } from '@testing-library/react';
import { JOptionPane } from '../JOptionPane';
import type { InterJOptionPane } from '../JOptionPane';

const pane = (props: Partial<InterJOptionPane> = {}) => (
  <JOptionPane
    open
    title="Eliminar"
    description="Se eliminará el registro."
    confirmLabel="Eliminar"
    cancelLabel="No"
    onConfirm={() => undefined}
    onCancel={() => undefined}
    {...props}
  />
);

describe('JOptionPane details and initial focus (R-FBK-4)', () => {
  it('S-FBK-11: without details the output equals the pre-1.6.0 pane (approval snapshot)', () => {
    render(pane());

    expect(screen.getByRole('alertdialog').parentElement).toMatchSnapshot();
  });

  it('S-FBK-11: details sit inside the pane, after the description, and join its description', () => {
    render(pane({ details: '000123 · ACME SAC' }));
    const dialog = screen.getByRole('alertdialog', { name: 'Eliminar' });

    expect(within(dialog).getByText('000123 · ACME SAC')).toBeInTheDocument();
    expect(dialog).toHaveAccessibleDescription('Se eliminará el registro. 000123 · ACME SAC');
    const description = within(dialog).getByText('Se eliminará el registro.');
    const details = within(dialog).getByText('000123 · ACME SAC');
    expect(description.compareDocumentPosition(details) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(details.compareDocumentPosition(within(dialog).getByRole('button', { name: 'Eliminar' })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('S-FBK-11: details alone describe the pane, and may be any node', () => {
    render(pane({ description: undefined, details: <strong>0002 · CUSCO</strong> }));
    const dialog = screen.getByRole('alertdialog', { name: 'Eliminar' });

    expect(dialog).toHaveAccessibleDescription('0002 · CUSCO');
    expect(within(dialog).getByText('0002 · CUSCO').tagName).toBe('STRONG');
  });

  it('initialFocus="cancel" focuses the cancel button on open', () => {
    render(pane({ initialFocus: 'cancel' }));

    expect(screen.getByRole('button', { name: 'No' })).toHaveFocus();
  });

  it('initialFocus="confirm" focuses the confirm button on open', () => {
    render(pane({ initialFocus: 'confirm', variant: 'info' }));

    expect(screen.getByRole('button', { name: 'Eliminar' })).toHaveFocus();
  });

  it('without initialFocus the panel keeps the focus, as before', () => {
    render(pane());

    expect(screen.getByRole('alertdialog')).toHaveFocus();
  });
});
