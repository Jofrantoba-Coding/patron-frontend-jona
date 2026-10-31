import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createAuthServiceFake } from '../src/comun/AuthServiceFake.js';
import type { InterAuthService, LoginResult, LoginUser } from '../src/comun/InterAuthService.js';
import { MISSING_DATA_ERROR } from '../src/comun/mensajes.js';
import type { LoginScreen } from '../src/comun/pantalla.js';

/** Lo que recibe cada función de creación: el servicio y a quién avisar al iniciar sesión. */
export interface LoginDeps {
  service: InterAuthService;
  onAuthenticated: (result: LoginResult) => void;
}

/** La función pública con la que cada patrón crea su pantalla de login. */
export type CreateLogin = (deps: LoginDeps) => LoginScreen;

/** Lo que una persona hace y ve; no sabe qué patrón hay detrás de la pantalla. */
export interface Driver {
  typeEmail(email: string): void;
  typePassword(password: string): void;
  submit(): void;
  message(): string;
  busy(): boolean;
  authenticatedUser(): LoginUser | undefined;
}

/** Servicio falso que retiene cada respuesta hasta `answer()`, para observar el estado "ocupado". */
function heldService() {
  const fake = createAuthServiceFake();
  const pending: Array<() => void> = [];
  const calls: string[] = [];
  const service: InterAuthService = {
    async login(email, password) {
      calls.push(email);
      await new Promise<void>((resolve) => pending.push(resolve));
      return fake.login(email, password);
    },
  };
  /** Deja responder al servicio y espera a que la pantalla termine de reaccionar. */
  async function answer(): Promise<void> {
    pending.shift()?.();
    await new Promise<void>((resolve) => setImmediate(resolve));
  }
  return { service, calls, answer };
}

/** Construye el Driver usando solo los controles de la pantalla. */
function setup(create: CreateLogin) {
  const { service, calls, answer } = heldService();
  let authenticated: LoginResult | undefined;
  const screen = create({ service, onAuthenticated: (result) => { authenticated = result; } });
  const driver: Driver = {
    typeEmail: (email) => screen.email.type(email),
    typePassword: (password) => screen.password.type(password),
    submit: () => screen.submit.click(),
    message: () => screen.message.text,
    busy: () => !screen.submit.enabled,
    authenticatedUser: () => authenticated?.user,
  };
  return { driver, calls, answer };
}

/** La misma suite de comportamiento para los cinco patrones. */
export function describeLoginBehavior(pattern: string, create: CreateLogin): void {
  describe(`${pattern}: comportamiento del login`, () => {
    it('con credenciales válidas avisa a onAuthenticated con el usuario', async () => {
      const { driver, answer } = setup(create);
      driver.typeEmail('ana@ejemplo.com');
      driver.typePassword('secreta123');
      driver.submit();
      await answer();
      assert.deepEqual(driver.authenticatedUser(), { id: 1, usuario: 'ana@ejemplo.com', nombre: 'Ana Torres' });
      assert.equal(driver.message(), '');
      assert.equal(driver.busy(), false);
    });

    it('con credenciales inválidas muestra "Correo o contraseña incorrectos."', async () => {
      const { driver, answer } = setup(create);
      driver.typeEmail('ana@ejemplo.com');
      driver.typePassword('otra-clave');
      driver.submit();
      await answer();
      assert.equal(driver.message(), 'Correo o contraseña incorrectos.');
      assert.equal(driver.authenticatedUser(), undefined);
      assert.equal(driver.busy(), false);
    });

    it('con un usuario bloqueado muestra su mensaje', async () => {
      const { driver, answer } = setup(create);
      driver.typeEmail('bloqueado@ejemplo.com');
      driver.typePassword('secreta123');
      driver.submit();
      await answer();
      assert.equal(driver.message(), 'Su usuario está bloqueado. Contacte al administrador.');
      assert.equal(driver.authenticatedUser(), undefined);
    });

    it('sin datos muestra MISSING_DATA_ERROR y no llama al servicio', async () => {
      const { driver, calls, answer } = setup(create);
      driver.typeEmail('ana@ejemplo.com');
      driver.submit();
      await answer();
      assert.equal(driver.message(), MISSING_DATA_ERROR);
      assert.equal(calls.length, 0);
      assert.equal(driver.busy(), false);
    });

    it('mientras espera está ocupada y no envía dos veces', async () => {
      const { driver, calls, answer } = setup(create);
      driver.typeEmail('ana@ejemplo.com');
      driver.typePassword('secreta123');
      driver.submit();
      assert.equal(driver.busy(), true);
      driver.submit();
      await answer();
      assert.equal(calls.length, 1);
      assert.equal(driver.busy(), false);
      assert.equal(driver.authenticatedUser()?.usuario, 'ana@ejemplo.com');
    });

    it('un nuevo intento limpia el error anterior', async () => {
      const { driver, answer } = setup(create);
      driver.typeEmail('ana@ejemplo.com');
      driver.typePassword('otra-clave');
      driver.submit();
      await answer();
      assert.equal(driver.message(), 'Correo o contraseña incorrectos.');
      driver.typePassword('secreta123');
      driver.submit();
      assert.equal(driver.message(), '');
      await answer();
      assert.equal(driver.authenticatedUser()?.nombre, 'Ana Torres');
    });
  });
}
