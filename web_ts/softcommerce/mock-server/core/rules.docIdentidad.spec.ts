import { describe, expect, it } from 'vitest';
import { docIdentidad } from './rules.js';

/**
 * The named rule `docIdentidad` (R-REF-8, D9): four pure hooks over the form values. The DNI id is `01` and the RUC id `05`
 * (`FormImportarAnexo`: 8 digits -> `01`, else `05`; `RegisterSocio`: `getId_tipo_doc().equals("05")`).
 */
const DNI = '01';
const RUC = '05';
const OTHER = '04';
const NAMES = { ap_paterno: 'PEREZ', ap_materno: 'LOPEZ', nombres: 'ANA' };
const ENTRY = {
  entity: 'un Chofer', messages: { style: 'M1' },
  fields: [
    { name: 'ap_paterno', label: 'Apellido Paterno' },
    { name: 'ap_materno', label: 'Apellido Materno' },
    { name: 'nombres', label: 'Nombres', msgLabel: 'su Nombre' },
  ],
};
const ctx = (mode = 'INSERT') => ({ entry: ENTRY, mode });
const values = (tipo: string, numero_doc = '', extra: Record<string, string> = {}) => ({ id_tipo_doc_iden: tipo, numero_doc, ap_paterno: '', ap_materno: '', nombres: '', descripcion: '', ...extra });
const params = { sexo: 'sexo' };

describe('docIdentidad.state (S-REF-25, S-REF-26)', () => {
  it('DNI: numero_doc max 8, names required, razon social hidden, sexo shown', () => {
    expect(docIdentidad.state(values(DNI), params)).toEqual({
      numero_doc: { max: 8 },
      ap_paterno: { required: true }, ap_materno: { required: true }, nombres: { required: true },
      descripcion: { hidden: true },
      sexo: {},
    });
  });

  it('RUC with no digit yet: max 11, razon social enabled and required, names disabled, sexo hidden', () => {
    expect(docIdentidad.state(values(RUC), params)).toEqual({
      numero_doc: { max: 11 },
      ap_paterno: { disabled: true }, ap_materno: { disabled: true }, nombres: { disabled: true },
      descripcion: { required: true },
      sexo: { hidden: true },
    });
  });

  it('RUC starting with 1 (natural person): names required, razon social hidden, sexo shown', () => {
    const state = docIdentidad.state(values(RUC, '10123456789'), params);
    expect(state.numero_doc).toEqual({ max: 11 });
    expect([state.ap_paterno, state.descripcion, state.sexo]).toEqual([{ required: true }, { hidden: true }, {}]);
  });

  it('RUC starting with 2 (juridical person): razon social required, names disabled', () => {
    const state = docIdentidad.state(values(RUC, '20123456789'), params);
    expect([state.ap_paterno, state.nombres, state.descripcion, state.sexo]).toEqual([{ disabled: true }, { disabled: true }, { required: true }, { hidden: true }]);
  });

  it('any other tipo: max 11 with no minimum, razon social required, names disabled', () => {
    const state = docIdentidad.state(values(OTHER), params);
    expect(state.numero_doc).toEqual({ max: 11 });
    expect([state.ap_paterno, state.descripcion, state.sexo]).toEqual([{ disabled: true }, { required: true }, { hidden: true }]);
  });

  it('no tipo yet: every document field is disabled until one is chosen', () => {
    const state = docIdentidad.state(values(''), params);
    expect(state.numero_doc).toEqual({ max: 11, disabled: true });
    expect([state.ap_paterno, state.descripcion]).toEqual([{ disabled: true }, { disabled: true }]);
  });

  it('a form with no sexo field gets no sexo state', () => {
    expect(docIdentidad.state(values(DNI))).not.toHaveProperty('sexo');
  });
});

describe('docIdentidad.validate (S-REF-25, S-REF-26)', () => {
  const DNI_TEXT = 'El número de DNI que has especificado no es válida. Compruébala e inténtalo de nuevo.';
  const RUC_TEXT = 'El número de RUC que has especificado no es válida. Compruébala e inténtalo de nuevo.';
  const first = (v: Record<string, string>, mode = 'INSERT') => docIdentidad.validate(v, undefined, ctx(mode)).map((d: any) => [d.field, d.message]);

  it('DNI with 7 digits gives the DNI sentence on numero_doc', () => {
    expect(first(values(DNI, '1234567', NAMES))).toEqual([['numero_doc', DNI_TEXT]]);
  });

  it('a blank DNI number gives the same sentence', () => {
    expect(first(values(DNI))).toEqual([['numero_doc', DNI_TEXT]]);
  });

  it.each([
    ['ap_paterno', 'su Apellido Paterno', { ap_materno: 'LOPEZ', nombres: 'ANA' }],
    ['ap_materno', 'su Apellido Materno', { ap_paterno: 'PEREZ', nombres: 'ANA' }],
    ['nombres', 'su Nombre', { ap_paterno: 'PEREZ', ap_materno: 'LOPEZ' }],
  ])('DNI with 8 digits and a blank %s says %s (M1, entity un Chofer)', (field, label, names) => {
    expect(first(values(DNI, '12345678', names))).toEqual([[field, `Para agregar un Chofer, debes especificar ${label}.`]]);
  });

  it('the names are checked in the desktop order: paterno, materno, nombres', () => {
    expect(first(values(DNI, '12345678'))).toEqual([['ap_paterno', 'Para agregar un Chofer, debes especificar su Apellido Paterno.']]);
  });

  it('UPDATE words the names sentence with modificar', () => {
    expect(first(values(DNI, '12345678', { ap_paterno: 'X', ap_materno: ' ' }), 'UPDATE')).toEqual([['ap_materno', 'Para modificar un Chofer, debes especificar su Apellido Materno.']]);
  });

  it('a complete DNI passes', () => {
    expect(first(values(DNI, '12345678', NAMES))).toEqual([]);
  });

  it('RUC with 10 digits gives the RUC sentence', () => {
    expect(first(values(RUC, '1012345678'))).toEqual([['numero_doc', RUC_TEXT]]);
  });

  it('RUC 1 needs the three names', () => {
    expect(first(values(RUC, '10123456789', { ap_paterno: 'X' }))).toEqual([['ap_materno', 'Para agregar un Chofer, debes especificar su Apellido Materno.']]);
  });

  it('RUC 2 asks nothing of the names (the razon social is a field step)', () => {
    expect(first(values(RUC, '20123456789'))).toEqual([]);
  });

  it('RUC with a first digit other than 1 or 2 cannot be stored: the alert text on numero_doc', () => {
    expect(first(values(RUC, '30123456789'))).toEqual([['numero_doc', 'EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2']]);
  });

  it('any other tipo has no minimum and no name requirement', () => {
    expect(first(values(OTHER, '1'))).toEqual([]);
    expect(first(values(OTHER))).toEqual([]);
  });

  it('reports the failure with the code the generic rules use', () => {
    expect(docIdentidad.validate(values(DNI, '1'), undefined, ctx())[0]).toMatchObject({ code: 'MIN_LENGTH' });
    expect(docIdentidad.validate(values(DNI, '12345678'), undefined, ctx())[0]).toMatchObject({ code: 'REQUIRED' });
  });
});

describe('docIdentidad.effect (S-REF-26)', () => {
  const alert = 'EL DOCUMENTO RUC EMPIEZA CON 1 Ó 2';

  it('a RUC first digit 3 alerts and clears numero_doc', () => {
    expect(docIdentidad.effect(values(RUC, '3'), 'numero_doc')).toEqual({ patch: { numero_doc: '' }, alert });
  });

  it('a pasted 11-digit RUC starting with 9 alerts too', () => {
    expect(docIdentidad.effect(values(RUC, '90123456789'), 'numero_doc')).toEqual({ patch: { numero_doc: '' }, alert });
  });

  it.each(['1', '2', '10123456789', '20123456789', ''])('RUC %j raises nothing', (numero) => {
    expect(docIdentidad.effect(values(RUC, numero), 'numero_doc')).toEqual({});
  });

  it('a DNI or other tipo never alerts, whatever the first digit', () => {
    expect(docIdentidad.effect(values(DNI, '3'), 'numero_doc')).toEqual({});
    expect(docIdentidad.effect(values(OTHER, '3'), 'numero_doc')).toEqual({});
  });

  it('only an edit of numero_doc triggers it', () => {
    expect(docIdentidad.effect(values(RUC, '3'), 'ap_paterno')).toEqual({});
  });
});

describe('docIdentidad.derive (S-REF-25, S-REF-28)', () => {
  it('DNI composes the razon social as paterno materno nombres', () => {
    expect(docIdentidad.derive(values(DNI, '12345678', NAMES))).toEqual({ descripcion: 'PEREZ LOPEZ ANA' });
  });

  it('a partial name leaves no stray spaces', () => {
    expect(docIdentidad.derive(values(DNI, '1', { ap_paterno: 'PEREZ', nombres: 'ANA' }))).toEqual({ descripcion: 'PEREZ ANA' });
    expect(docIdentidad.derive(values(DNI))).toEqual({ descripcion: '' });
  });

  it('RUC 1 composes too; RUC 2 and any other tipo leave the razon social to the user', () => {
    expect(docIdentidad.derive(values(RUC, '10123456789', NAMES))).toEqual({ descripcion: 'PEREZ LOPEZ ANA' });
    expect(docIdentidad.derive(values(RUC, '20123456789', NAMES))).toEqual({});
    expect(docIdentidad.derive(values(OTHER, '1', NAMES))).toEqual({});
  });

  describe('flag_tipo_persona (a rule with a persona column)', () => {
    const persona = { persona: 'flag_tipo_persona' };
    it('RUC starting with 2 is J', () => {
      expect(docIdentidad.derive(values(RUC, '20123456789'), persona)).toEqual({ flag_tipo_persona: 'J' });
    });
    it.each([[RUC, '10123456789'], [DNI, '12345678'], [OTHER, '20123456789'], [RUC, '']])('tipo %s %j is N', (tipo, numero) => {
      expect(docIdentidad.derive(values(tipo, numero, NAMES), persona)).toMatchObject({ flag_tipo_persona: 'N' });
    });
    it('a names tipo also composes the razon social', () => {
      expect(docIdentidad.derive(values(DNI, '12345678', NAMES), persona)).toEqual({ descripcion: 'PEREZ LOPEZ ANA', flag_tipo_persona: 'N' });
    });
  });
});

describe('docIdentidad params', () => {
  it('a rule can name other fields and tipo ids', () => {
    const custom = { tipo: 't', numero: 'n', paterno: 'p', materno: 'm', nombres: 'o', razon: 'r', dni: 'D', ruc: 'R' };
    expect(docIdentidad.state({ t: 'D', n: '' }, custom).n).toEqual({ max: 8 });
    expect(docIdentidad.derive({ t: 'D', n: '1', p: 'A', m: 'B', o: 'C' }, custom)).toEqual({ r: 'A B C' });
  });
});
