import { fireEvent, render, screen } from '@testing-library/react';
import { JImagen } from '../JImagen';

describe('JImagen', () => {
  it('renders an accessible image with default loading behavior', () => {
    render(<JImagen src="/logo.svg" alt="Develtrex logo" />);

    const image = screen.getByAltText('Develtrex logo');

    expect(image).toHaveAttribute('src', '/logo.svg');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
  });

  it('switches to fallbackSrc when the image fails', () => {
    render(<JImagen src="/missing.svg" fallbackSrc="/fallback.svg" alt="Fallback logo" />);

    const image = screen.getByAltText('Fallback logo');
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/fallback.svg');
  });
});
