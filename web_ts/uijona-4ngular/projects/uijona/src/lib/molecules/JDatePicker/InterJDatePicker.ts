/** Contrato publico de JDatePicker (valor ISO `yyyy-MM-dd`[`THH:mm[:ss]`]). */
export interface InterJDatePicker {
  value?: string;
  min?: string;
  max?: string;
  placeholder?: string;
  disabled?: boolean;
  showTime?: boolean;
  showSeconds?: boolean;
}
