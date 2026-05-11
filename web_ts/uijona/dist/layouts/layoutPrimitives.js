const t = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8"
}, s = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
}, n = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
}, r = (e) => typeof e == "number" ? `repeat(${e}, minmax(0, 1fr))` : e, a = (e) => {
  if (e !== void 0)
    return String(e);
};
export {
  s as layoutAlignClasses,
  t as layoutGapClasses,
  n as layoutJustifyClasses,
  r as resolveGridTemplate,
  a as toCssValue
};
//# sourceMappingURL=layoutPrimitives.js.map
