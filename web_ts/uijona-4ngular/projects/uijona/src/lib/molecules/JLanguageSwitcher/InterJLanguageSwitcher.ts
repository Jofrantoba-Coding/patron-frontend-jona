export interface JLanguageOption {
  code: string;
  label: string;
}

/** Contrato publico de JLanguageSwitcher. */
export interface InterJLanguageSwitcher {
  languages: JLanguageOption[];
  value: string;
  ariaLabel?: string;
}
