/**
 * Átomos: el comportamiento mínimo de cada uno, usado como lo usaría un consumidor
 * (por la superficie pública), y sin violaciones graves de accesibilidad.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { JButton, JHeading, JImage, JInput, JLink, JText } from '../src/index';
import { violacionesGraves } from './axe';

describe('JButton', () => {
  it('aplica los DEFAULTS: primario y de tipo button', () => {
    render(<JButton>Guardar</JButton>);

    const boton = screen.getByRole('button', { name: 'Guardar' });
    expect(boton).toHaveProperty('type', 'button');
    expect(boton.dataset.variant).toBe('primary');
  });

  it('aria-label precisa el nombre accesible sin cambiar el texto visible', async () => {
    const onClick = vi.fn();
    const { container } = render(<JButton aria-label="Editar Teclado" onClick={onClick}>Editar</JButton>);

    await userEvent.click(screen.getByRole('button', { name: 'Editar Teclado' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(container.textContent).toBe('Editar');
    expect(await violacionesGraves(container)).toEqual([]);
  });
});

describe('JInput', () => {
  it('entrega el valor, no el evento', async () => {
    const onChange = vi.fn();
    render(<JInput aria-label="Nombre" value="" onChange={onChange} />);

    await userEvent.type(screen.getByRole('textbox', { name: 'Nombre' }), 'a');

    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('marca el campo inválido solo cuando se le pide', () => {
    render(<><JInput aria-label="Válido" value="" /><JInput aria-label="Inválido" value="" invalid /></>);

    expect(screen.getByRole('textbox', { name: 'Válido' }).getAttribute('aria-invalid')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Inválido' }).getAttribute('aria-invalid')).toBe('true');
  });

  it('name: el campo viaja en un formulario que se envía sin JavaScript', () => {
    const { container } = render(<form action="/buscar" method="get"><JInput type="search" name="q" aria-label="Buscar" value="teclado" /></form>);

    expect([...new FormData(container.querySelector('form')!).entries()]).toEqual([['q', 'teclado']]);
  });

  it('sin nombre accesible, axe lo detecta: el átomo no se usa solo, lo nombra la molécula', async () => {
    const { container } = render(<JInput value="" />);

    expect(await violacionesGraves(container)).toEqual(['label']);
  });
});

describe('JText', () => {
  it('el nivel de título lo decide quien compone', () => {
    render(<JText as="h2">Productos</JText>);

    expect(screen.getByRole('heading', { level: 2, name: 'Productos' })).toBeDefined();
  });

  it('el tono es un rol: peligro se pinta con la clase de token, no con un color', () => {
    render(<JText tone="danger" role="alert">El precio debe ser mayor que cero</JText>);

    expect(screen.getByRole('alert').className).toBe('ds-danger');
  });
});

describe('JHeading', () => {
  it('el nivel es semántica: dibuja <h{level}>', () => {
    render(<><JHeading level={1}>Catálogo</JHeading><JHeading level={3}>Detalle</JHeading></>);

    expect(screen.getByRole('heading', { level: 1, name: 'Catálogo' }).tagName).toBe('H1');
    expect(screen.getByRole('heading', { level: 3, name: 'Detalle' }).tagName).toBe('H3');
  });

  it('el tamaño es estilo y va aparte: un h2 puede verse pequeño sin dejar de ser h2', () => {
    render(<><JHeading level={2}>Por nivel</JHeading><JHeading level={2} size="sm">Pequeño</JHeading></>);

    expect(screen.getByRole('heading', { name: 'Por nivel' }).className).toBe('ds-fg ds-heading-lg');
    expect(screen.getByRole('heading', { name: 'Pequeño' })).toMatchObject({ tagName: 'H2', className: 'ds-fg ds-heading-sm' });
  });

  it('sin nivel no compila: el átomo no adivina en qué lugar del documento está', () => {
    // @ts-expect-error -- InterJHeading exige level.
    render(<JHeading>Sin nivel</JHeading>);
  });

  it('no tiene violaciones graves', async () => {
    const { container } = render(<JHeading level={2}>Productos</JHeading>);

    expect(await violacionesGraves(container)).toEqual([]);
  });
});

describe('JLink', () => {
  it('siempre es un <a href>: el teclado lo enfoca y un rastreador lo sigue', () => {
    render(<JLink href="/productos/TEC-001">Teclado mecánico</JLink>);

    const enlace = screen.getByRole('link', { name: 'Teclado mecánico' });
    expect(enlace.tagName).toBe('A');
    expect(enlace.getAttribute('href')).toBe('/productos/TEC-001');
  });

  it('acepta rutas del sitio armadas con plantillas y URLs completas', () => {
    const sku = 'MOU-002';
    render(<><JLink href={`/productos/${sku}`}>Mouse</JLink><JLink href="https://ejemplo.pe/" rel="external">Sitio</JLink></>);

    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/productos/MOU-002', 'https://ejemplo.pe/']);
  });

  it('aria-current marca la página actual', () => {
    render(<JLink href="/" aria-current="page">Inicio</JLink>);

    expect(screen.getByRole('link', { name: 'Inicio' }).getAttribute('aria-current')).toBe('page');
  });

  it('sin href, con "#" o con javascript: no compila; y no hay onClick que lo reemplace', () => {
    // @ts-expect-error -- InterJLink exige href.
    render(<JLink>Sin destino</JLink>);
    // @ts-expect-error -- "#" no es un destino.
    render(<JLink href="#">Ancla vacía</JLink>);
    // @ts-expect-error -- javascript: no es un destino.
    render(<JLink href="javascript:void(0)">Script</JLink>);
    // @ts-expect-error -- navegar es seguir un href, no ejecutar un manejador.
    render(<JLink href="/" onClick={() => {}}>Con manejador</JLink>);
  });

  it('no tiene violaciones graves', async () => {
    const { container } = render(<JLink href="/">Inicio</JLink>);

    expect(await violacionesGraves(container)).toEqual([]);
  });
});

describe('JImage', () => {
  it('reserva su espacio (width y height) y carga en diferido por defecto', () => {
    render(<JImage src="/img/teclado.svg" alt="Teclado mecánico" width={640} height={480} />);

    const imagen = screen.getByRole('img', { name: 'Teclado mecánico' });
    expect([imagen.getAttribute('width'), imagen.getAttribute('height'), imagen.getAttribute('loading')]).toEqual(['640', '480', 'lazy']);
    expect(imagen.getAttribute('fetchpriority')).toBeNull();
  });

  it('con prioridad, la imagen principal carga de inmediato y con prioridad alta', () => {
    render(<JImage src="/img/teclado.svg" alt="Teclado mecánico" width={640} height={480} prioridad />);

    const imagen = screen.getByRole('img', { name: 'Teclado mecánico' });
    expect([imagen.getAttribute('loading'), imagen.getAttribute('fetchpriority')]).toEqual(['eager', 'high']);
  });

  it('el alt vacío es una decisión explícita: decorativa', () => {
    const { container } = render(<JImage src="/img/fondo.svg" decorativa width={10} height={10} />);

    expect(container.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('sin alt, sin width o sin height no compila; una decorativa no lleva alt', () => {
    // @ts-expect-error -- InterJImage exige alt (o decorativa).
    render(<JImage src="/a.svg" width={1} height={1} />);
    // @ts-expect-error -- InterJImage exige width.
    render(<JImage src="/a.svg" alt="A" height={1} />);
    // @ts-expect-error -- InterJImage exige height.
    render(<JImage src="/a.svg" alt="A" width={1} />);
    // @ts-expect-error -- una imagen decorativa no tiene texto alternativo.
    render(<JImage src="/a.svg" decorativa alt="A" width={1} height={1} />);
  });

  it('no tiene violaciones graves, informativa o decorativa', async () => {
    const { container } = render(
      <><JImage src="/a.svg" alt="Teclado" width={1} height={1} /><JImage src="/b.svg" decorativa width={1} height={1} /></>,
    );

    expect(await violacionesGraves(container)).toEqual([]);
  });

  it('la prueba no es vacía: un <img> sin alt sí es una violación para axe', async () => {
    const { container } = render(<img src="/a.svg" width={1} height={1} />);

    expect(await violacionesGraves(container)).toEqual(['image-alt']);
  });
});
