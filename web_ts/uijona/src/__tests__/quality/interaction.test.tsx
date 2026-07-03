/**
 * Design-quality contract: INTERACTION DESIGN
 * Verifica teclado, foco, gestos y bloqueo por estado, y la firma
 * "value-first" de los eventos (patrón Observer de JONA).
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { JTextBox } from '../../atoms/JTextBox';
import { JButton } from '../../atoms/JButton';
import { JSwitch } from '../../atoms/JSwitch';
import { JCheckBox } from '../../atoms/JCheckBox';
import { JSearchInput } from '../../molecules/JSearchInput';
import { JAlert } from '../../molecules/JAlert';

describe('Interaction — JTextBox keyboard & value-first events', () => {
  it('onChange delivers value first, event second', () => {
    const onChange = vi.fn();
    render(<JTextBox onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hola' } });
    expect(onChange).toHaveBeenCalledWith('hola', expect.anything());
  });

  it('Enter fires onEnterPress with current value', () => {
    const onEnterPress = vi.fn();
    render(<JTextBox defaultValue="query" onEnterPress={onEnterPress} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onEnterPress).toHaveBeenCalledWith('query', expect.anything());
  });

  it('Backspace on empty value triggers onClear gesture', () => {
    const onClear = vi.fn();
    render(<JTextBox value="" onClear={onClear} onChange={() => {}} />);
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Backspace' });
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

describe('Interaction — state blocks interaction', () => {
  it('JButton disabled does not fire onClick', () => {
    const onClick = vi.fn();
    render(<JButton disabled onClick={onClick}>x</JButton>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('JButton loading disables and does not fire onClick', () => {
    const onClick = vi.fn();
    render(<JButton loading onClick={onClick}>x</JButton>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('JSwitch disabled does not toggle', () => {
    const onCheckedChange = vi.fn();
    render(<JSwitch disabled onCheckedChange={onCheckedChange} aria-label="s" />);
    fireEvent.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

describe('Interaction — toggles report value-first', () => {
  it('JSwitch onCheckedChange(next, event) and aria-checked flips', () => {
    const onCheckedChange = vi.fn();
    render(<JSwitch onCheckedChange={onCheckedChange} aria-label="s" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(sw);
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('JCheckBox onCheckedChange delivers boolean first', () => {
    const onCheckedChange = vi.fn();
    render(<JCheckBox onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });
});

describe('Interaction — JSearchInput', () => {
  it('Enter fires onSearch with value', () => {
    const onSearch = vi.fn();
    render(<JSearchInput defaultValue="term" onSearch={onSearch} />);
    fireEvent.keyDown(screen.getByRole('searchbox'), { key: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('term', expect.anything());
  });

  it('clear button appears with value and fires onClear', () => {
    const onClear = vi.fn();
    render(<JSearchInput defaultValue="term" onClear={onClear} />);
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});

describe('Interaction — JAlert dismissible', () => {
  it('fires onDismiss when close is clicked', () => {
    const onDismiss = vi.fn();
    render(<JAlert dismissible onDismiss={onDismiss}>msg</JAlert>);
    fireEvent.click(screen.getByLabelText('Cerrar alerta'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
