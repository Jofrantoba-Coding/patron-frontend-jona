// Layer: Implementation. State, validation, service calls and navigation of login step 1.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InterAuthService } from '../../services/InterAuthService';
import { useSession } from '../../session/SessionProvider';
import { toFailure, type Failure } from '../../shared/toFailure';
import type { InterUiLogin } from './InterUiLogin';

export interface LoginForm {
  tenantId: string;
  usuario: string;
  clave: string;
}

type LoginFieldErrors = Pick<InterUiLogin, 'tenantError' | 'usuarioError' | 'claveError'>;

/** R-AUTH-3: tenant, user and password are required. Pure. */
export function validateLoginForm({ tenantId, usuario, clave }: LoginForm): LoginFieldErrors {
  return {
    tenantError: tenantId ? undefined : 'Seleccione una empresa.',
    usuarioError: usuario.trim() ? undefined : 'El usuario es obligatorio.',
    claveError: clave ? undefined : 'La contraseña es obligatoria.',
  };
}

const hasErrors = (errors: LoginFieldErrors) => Object.values(errors).some(Boolean);

export function useUiLoginImpl(service: InterAuthService): InterUiLogin {
  const { startLogin } = useSession();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ tenantId: '', usuario: '', clave: '' });
  const [tenantOptions, setTenantOptions] = useState<InterUiLogin['tenantOptions']>([]);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [failure, setFailure] = useState<Failure | undefined>();
  const [isLoadingTenants, setIsLoadingTenants] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    service
      .sessionOptions()
      .then((tenants) => active && setTenantOptions(tenants.map((t) => ({ value: t.id, label: t.name }))))
      .catch((error: unknown) => active && setFailure(toFailure(error)))
      .finally(() => active && setIsLoadingTenants(false));
    return () => {
      active = false;
    };
  }, [service]);

  const change = (field: keyof LoginForm, errorField: keyof LoginFieldErrors) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [errorField]: undefined }));
  };

  function onSubmit(): void {
    if (isSubmitting) return;
    const errors = validateLoginForm(form);
    setFieldErrors(errors);
    if (hasErrors(errors)) return;

    setFailure(undefined);
    setIsSubmitting(true);
    service
      .login(form.tenantId, { usuario: form.usuario, clave: form.clave })
      .then((result) => {
        startLogin({ tenantId: form.tenantId, result });
        navigate('/contexto');
      })
      .catch((error: unknown) => {
        setFailure(toFailure(error));
        setIsSubmitting(false);
      });
  }

  return {
    ...form,
    ...fieldErrors,
    tenantOptions,
    submitError: failure?.message,
    submitErrorTraceId: failure?.traceId,
    isLoadingTenants,
    isSubmitting,
    onTenantChange: change('tenantId', 'tenantError'),
    onUsuarioChange: change('usuario', 'usuarioError'),
    onClaveChange: change('clave', 'claveError'),
    onSubmit,
  };
}
