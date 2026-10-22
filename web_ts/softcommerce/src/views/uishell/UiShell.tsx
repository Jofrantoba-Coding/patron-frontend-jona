// Layer: public entry. Wires the Impl hook to the pure View and provides the dialog stack to every tab.
import type { InterShellService } from '../../services/InterShellService';
import { DialogStackProvider } from './DialogStackProvider';
import { findForm, formRegistry, type FormRegistry } from './formRegistry';
import { FormHost } from './FormHost';
import { UISHELL_DEFAULTS } from './InterUiShell';
import { useUiShellImpl } from './UiShellImpl';
import { UiShellView } from './UiShellView';

export function UiShell({ service, registry = formRegistry }: { service: InterShellService; registry?: FormRegistry }) {
  const impl = useUiShellImpl(service, registry);
  const renderForm = (formId: string) => {
    const Form = findForm(registry, formId);
    return Form ? (
      <FormHost formId={formId} service={service}>
        {(permissions) => <Form permissions={permissions} />}
      </FormHost>
    ) : null;
  };
  return (
    <DialogStackProvider>
      <UiShellView {...UISHELL_DEFAULTS} {...impl} renderForm={renderForm} />
    </DialogStackProvider>
  );
}
