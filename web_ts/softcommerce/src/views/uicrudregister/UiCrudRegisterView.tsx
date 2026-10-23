// Layer: View. Pure render of props already resolved by the Impl; no state, effects or services.
import { JAlert, JButton, JComboBox, JDialog } from 'jona-ui';
import { CascadeSelect } from '../../shared/ui/CascadeSelect';
import { UppercaseTextField } from '../../shared/ui/UppercaseTextField';
import { GuardedOptionPane } from '../uishell/DialogStackProvider';
import { UICRUDREGISTER_DEFAULTS, type InterUiCrudRegister } from './InterUiCrudRegister';

type UiCrudRegisterViewProps = InterUiCrudRegister & typeof UICRUDREGISTER_DEFAULTS;

export function UiCrudRegisterView(props: UiCrudRegisterViewProps) {
  const { mode, modeLabels, status, confirm } = props;
  const title = `${modeLabels[mode]}: ${props.title}`;
  const footer = (
    <>
      <JButton variant="outline" className="min-h-11 sm:min-h-9" onClick={props.onClose}>
        {props.cancelLabel}
      </JButton>
      {mode !== 'DETAIL' && (
        <JButton className="min-h-11 sm:min-h-9" disabled={!props.canSubmit} onClick={props.onSubmit}>
          {props.submitLabel}
        </JButton>
      )}
    </>
  );
  return (
    <>
      <JDialog open title={title} onClose={props.onClose} footer={footer}>
        <div style={{ display: 'grid', gap: 12 }}>
          {status === 'loading' && <p>{props.loadingLabel}</p>}
          {status === 'failed' && <JAlert variant="danger" role="alert">{props.loadError}</JAlert>}
          {props.submitError && (
            <JAlert variant="danger" role="alert">
              {props.submitError}
              {props.submitTraceId ? <small> Código de seguimiento: {props.submitTraceId}</small> : null}
            </JAlert>
          )}
          {status === 'ready' &&
            props.fields.map((field) =>
              field.kind === 'code' ? (
                // The server issues the code: shown read-only once the record exists, never in INSERT or CLONE.
                mode !== 'INSERT' && mode !== 'CLONE' && (
                  <label key={field.name} style={{ display: 'grid', gap: 4 }}>
                    <span>{field.label}</span>
                    <UppercaseTextField value={props.values[field.name]} readOnly onChange={() => undefined} />
                  </label>
                )
              ) : field.kind === 'text' ? (
                <div key={field.name}>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>{field.label}</span>
                    <UppercaseTextField
                      ref={props.registerField(field.name)}
                      value={props.values[field.name]}
                      maxLength={field.maxLength}
                      uppercase={field.uppercase}
                      readOnly={props.readOnly}
                      hasError={Boolean(props.errors[field.name])}
                      onEnterPress={props.readOnly ? undefined : () => props.onSubmit()}
                      onChange={(value) => props.onFieldChange(field.name, value)}
                    />
                  </label>
                  {props.errors[field.name] && <small role="alert">{props.errors[field.name]}</small>}
                </div>
              ) : field.kind === 'select' ? (
                <div key={field.name}>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>{field.label}</span>
                    <JComboBox
                      ref={props.registerField(field.name)}
                      placeholder={props.selectPlaceholder}
                      value={props.values[field.name]}
                      options={(props.selectOptions[field.name] ?? []).map((o) => ({ value: o.id, label: o.name }))}
                      disabled={props.readOnly}
                      hasError={Boolean(props.errors[field.name])}
                      onChange={(value) => props.onFieldChange(field.name, value)}
                    />
                  </label>
                  {props.errors[field.name] && <small role="alert">{props.errors[field.name]}</small>}
                </div>
              ) : (
                <CascadeSelect
                  key={field.name}
                  levels={field.levels}
                  values={props.values}
                  loadChildren={props.loadChildren}
                  readOnly={props.readOnly}
                  errors={props.errors}
                  registerField={props.registerField}
                  onChange={props.onFieldChange}
                />
              ),
            )}
        </div>
      </JDialog>
      <GuardedOptionPane
        open={confirm !== undefined}
        variant={mode === 'DELETE' ? 'danger' : 'info'}
        title={confirm === 'discard' ? props.discardTitle : title}
        description={confirm === 'discard' ? props.discardMessage : props.confirmMessage}
        confirmLabel={props.confirmLabel}
        cancelLabel={props.declineLabel}
        isLoading={props.submitting}
        onConfirm={props.onConfirm}
        onClose={props.onConfirmCancel}
      />
    </>
  );
}
