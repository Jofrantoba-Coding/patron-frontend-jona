// InterJLanguageSwitcher.ts — JONA Interface

export interface JLanguageOption {
  code: string;
  label: string;
}

export interface InterJLanguageSwitcher {
  languages: JLanguageOption[];
  value: string;
  onChange: (code: string) => void;
  className?: string;
  'aria-label'?: string;
}

export const JLANGUAGE_SWITCHER_DEFAULTS: Partial<InterJLanguageSwitcher> = {
  'aria-label': 'Cambiar idioma',
};
