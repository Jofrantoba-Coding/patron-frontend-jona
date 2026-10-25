import { render, screen, within } from '@testing-library/react';
import { JTextBox } from '../../atoms/JTextBox';
import { JField } from '../JField';
import { JFormSection } from '../JFormSection';
import { TEXT_SECTION } from '../../theme/tokenClasses';
import { seriousViolations } from '../../__tests__/quality/axe';

const period = (props: { error?: string; description?: string; headingLevel?: 2 | 3 | 4 }) => (
  <JFormSection title="Período" {...props}>
    <JField id="desde" label="Desde">{(aria) => <JTextBox {...aria} />}</JField>
    <JField id="hasta" label="Hasta">{(aria) => <JTextBox {...aria} />}</JField>
  </JFormSection>
);

describe('JFormSection (R-FRM-3)', () => {
  it('S-FRM-6: a group named by the title, described by its error', () => {
    render(period({ error: 'La fecha final es menor a la inicial' }));

    const group = screen.getByRole('group', { name: 'Período' });
    expect(group).toHaveAccessibleDescription('La fecha final es menor a la inicial');
    expect(within(group).getByRole('textbox', { name: 'Desde' })).toBeInTheDocument();
    expect(within(group).getByRole('textbox', { name: 'Hasta' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('S-FRM-6: the description comes before the error, and the error leaves with its value', () => {
    const { rerender } = render(period({ description: 'Rango del reporte', error: 'La fecha final es menor a la inicial' }));
    const group = screen.getByRole('group', { name: 'Período' });

    expect(group).toHaveAccessibleDescription('Rango del reporte La fecha final es menor a la inicial');

    rerender(period({ description: 'Rango del reporte' }));

    expect(group).toHaveAccessibleDescription('Rango del reporte');
    expect(screen.queryByText('La fecha final es menor a la inicial')).toBeNull();
  });

  it('S-FND-15: the title is an h3 by default with the section style', () => {
    render(period({}));

    const heading = screen.getByRole('heading', { level: 3, name: 'Período' });
    expect(heading).toHaveClass(...TEXT_SECTION.split(' '));
  });

  it('takes the heading level of its place in the page', () => {
    render(period({ headingLevel: 2 }));

    expect(screen.getByRole('heading', { level: 2, name: 'Período' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
  });

  it('has no serious axe violations', async () => {
    const { container } = render(period({ description: 'Rango del reporte', error: 'La fecha final es menor a la inicial' }));

    expect(await seriousViolations(container)).toEqual([]);
  });
});
