/** Contrato de la vista pasiva: lo único que el presentador sabe de ella. */
export interface InterLoginView {
  getEmail(): string;
  getPassword(): string;
  showMessage(message: string): void;
  setBusy(busy: boolean): void;
}
