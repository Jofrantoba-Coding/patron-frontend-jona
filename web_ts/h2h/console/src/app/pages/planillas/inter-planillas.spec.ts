import { describe, expect, it } from 'vitest';
import { esperaOperador, siguientePaso } from './inter-planillas';

/**
 * Qué acción ofrece la consola segun el estado Y el canal.
 *
 * <p>Esto no es cosmetica. El backend RECHAZA `/planillas/enviar` sobre una planilla H2W —es la
 * guarda contra el doble pago, porque ese archivo ya lo sube una persona al portal—. Si la
 * consola ofreciera el boton "Enviar" en una H2W, el operador pulsaria una accion que SIEMPRE
 * falla y no tendria forma de saber por que.</p>
 */
describe('siguientePaso: la accion depende del estado y del canal', () => {
  it('H2H en CIFRADA propone enviar por SFTP', () => {
    expect(siguientePaso('CIFRADA').accion).toBe('Enviar');
    expect(siguientePaso('CIFRADA', 'H2H').accion).toBe('Enviar');
  });

  it('H2W en VALIDADA baja el archivo: en este canal NO se cifra', () => {
    // El cifrado protege el tramo SFTP, donde el archivo viaja solo hasta el buzon del banco. En
    // H2W lo descarga una persona ya autenticada y lo sube por HTTPS al portal, asi que la
    // envoltura PGP no añade proteccion y si un paso mas que puede fallar —y dejaba al operador
    // con un `.gpg` que el portal no acepta—.
    const paso = siguientePaso('VALIDADA', 'H2W');

    expect(paso.accion).toContain('portal');
    expect(paso.accion).not.toContain('Cifrar');
    expect(paso.destino).toBe('PENDIENTE_ENVIO');
  });

  it('H2H en VALIDADA SIGUE cifrando: por SFTP el archivo viaja solo', () => {
    // La contraparte imprescindible. Sacar el cifrado del canal equivocado dejaria salir el TXT
    // en claro al buzon del banco, que es justo lo que el cifrado existe para evitar.
    const paso = siguientePaso('VALIDADA', 'H2H');

    expect(paso.accion).toBe('Cifrar');
    expect(paso.destino).toBe('CIFRADA');
    expect(siguientePaso('VALIDADA').destino).toBe('CIFRADA');
  });

  it('H2W en CIFRADA NO propone enviar: propone bajar el archivo', () => {
    const paso = siguientePaso('CIFRADA', 'H2W');

    expect(paso.accion).toContain('portal');
    expect(paso.accion).not.toContain('Enviar');
    expect(paso.destino).toBe('PENDIENTE_ENVIO');
  });

  it('H2W en ENVIADA no espera al buzon: en este canal no llega nada solo', () => {
    const h2h = siguientePaso('ENVIADA', 'H2H');
    const h2w = siguientePaso('ENVIADA', 'H2W');

    expect(h2h.tono).toBe('espera');
    // Si se dejara "espera", una planilla H2W se quedaria ahi para siempre esperando una
    // respuesta que nadie va a traer.
    expect(h2w.tono).toBe('atencion');
    expect(h2w.destino).toBe('PROCESADA');
  });

  it('acepta la modalidad en minusculas y sin ella asume H2H', () => {
    expect(siguientePaso('CIFRADA', 'h2w').destino).toBe('PENDIENTE_ENVIO');
    expect(siguientePaso('CIFRADA', null).accion).toBe('Enviar');
    expect(siguientePaso('CIFRADA', undefined).accion).toBe('Enviar');
  });

  it('los estados que no cambian entre canales se heredan, no se duplican', () => {
    // GENERADA y los terminales son identicos en los dos canales: si se hubieran copiado en el
    // mapa de H2W, cambiar uno dejaria el otro desincronizado sin que nada avisara.
    for (const estado of ['GENERADA', 'PROCESADA', 'RECHAZADA', 'ANULADA']) {
      expect(siguientePaso(estado, 'H2W')).toEqual(siguientePaso(estado, 'H2H'));
    }
  });

  it('un estado desconocido no rompe la bandeja', () => {
    expect(siguientePaso('LO_QUE_SEA', 'H2W').accion).toBe('—');
    expect(siguientePaso(null).accion).toBe('—');
  });
});

/**
 * Marca de "esto espera a una persona".
 *
 * <p>Una planilla MANUAL en GENERADA parece en curso, pero el ciclo automatico no la va a tocar
 * nunca: sin esta marca es indistinguible de una que el job procesara en tres minutos.</p>
 */
describe('esperaOperador', () => {
  it('marca las manuales y las del portal', () => {
    expect(esperaOperador({ modoProcesamiento: 'MANUAL' })).toBe(true);
    expect(esperaOperador({ modalidadCodigo: 'H2W' })).toBe(true);
    expect(esperaOperador({ modoProcesamiento: 'manual' })).toBe(true);
  });

  it('no marca las que el ciclo si va a procesar', () => {
    expect(esperaOperador({ modoProcesamiento: 'AUTOMATICO', modalidadCodigo: 'H2H' })).toBe(false);
    // Sin datos se asume lo de siempre: automatico. Marcarlas todas haria la señal inutil.
    expect(esperaOperador({})).toBe(false);
  });
});
