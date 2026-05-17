const o = {
  variant: "default",
  size: "md",
  iconPosition: "left",
  loading: !1,
  fullWidth: !1,
  type: "button"
}, e = {
  default: "Filled. Color primario, acción principal.",
  outline: "Borde y texto, sin relleno. Acción secundaria.",
  ghost: "Sin borde ni relleno. Acción terciaria.",
  destructive: "Rojo. Acciones destructivas.",
  secondary: "Neutral. Acciones complementarias.",
  link: "Solo texto subrayado. Navegación inline."
}, t = {
  xs: "24px min-height. Espacios muy comprimidos.",
  sm: "28px min-height. Dentro de tablas o listas.",
  md: "36px min-height. Tamaño por defecto.",
  default: "36px min-height. Alias de md para compat.",
  lg: "44px min-height. Acciones destacadas.",
  xl: "56px min-height. Hero o calls to action.",
  icon: "36×36 cuadrado. Solo icono, sin texto."
}, i = {
  left: "Icono antes del texto (default). flex-direction: row.",
  right: "Icono después del texto. flex-direction: row-reverse.",
  top: "Icono sobre el texto. flex-direction: column.",
  bottom: "Icono bajo el texto. flex-direction: column-reverse."
};
export {
  o as JBUTTON_DEFAULTS,
  i as JBUTTON_ICON_POSITIONS,
  t as JBUTTON_SIZES,
  e as JBUTTON_VARIANTS
};
//# sourceMappingURL=InterJButton.js.map
