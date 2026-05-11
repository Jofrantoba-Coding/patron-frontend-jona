import { jsx as R } from "react/jsx-runtime";
import m from "react";
import { cn as l } from "../../lib/cn.js";
import { PANEL_ATOM_DEFAULTS as s } from "./InterPanelAtom.js";
const k = {
  default: "bg-white border border-neutral-200",
  outlined: "bg-transparent border border-neutral-300",
  elevated: "bg-white shadow-md border-0",
  flat: "bg-neutral-50 border-0",
  ghost: "bg-transparent border-0"
}, N = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
}, V = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, i = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8"
}, u = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
}, p = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
}, W = {
  row: "flex-row",
  column: "flex-col"
}, w = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  reverse: "flex-wrap-reverse"
}, K = (e) => typeof e == "string" ? e.trim() ? e : "div" : e ?? "div", c = (e, t) => typeof e == "boolean" ? e ? "wrap" : "nowrap" : e ?? t, g = (e) => typeof e == "number" ? `repeat(${e}, minmax(0, 1fr))` : e, O = (e, t, n, o, r, a) => {
  if (e !== "none")
    return e === "flow" ? l(
      "flex min-w-0 w-full max-w-full flex-row",
      w[c(a, "wrap")],
      i[n],
      u[o],
      p[r]
    ) : e === "box" ? l(
      "flex min-w-0 w-full max-w-full",
      W[t],
      w[c(a, t === "column" ? "nowrap" : "wrap")],
      i[n],
      u[o],
      p[r]
    ) : e === "grid" ? l("grid min-w-0 w-full max-w-full", i[n], u[o], p[r]) : e === "border" ? l(
      "grid min-h-0 min-w-0 w-full max-w-full",
      "[grid-template-areas:'top'_'left'_'center'_'right'_'bottom']",
      "[grid-template-columns:minmax(0,1fr)]",
      "[grid-template-rows:auto_auto_minmax(0,1fr)_auto_auto]",
      "md:[grid-template-areas:'top_top_top'_'left_center_right'_'bottom_bottom_bottom']",
      "md:[grid-template-columns:auto_minmax(0,1fr)_auto]",
      "md:[grid-template-rows:auto_minmax(0,1fr)_auto]",
      i[n],
      u[o],
      p[r]
    ) : e === "card" ? l("relative min-w-0 w-full max-w-full", i[n]) : l("relative min-w-0", i[n]);
}, $ = (e, t, n, o, r) => {
  const a = {};
  return e === "grid" && (a.gridTemplateColumns = o ? `repeat(auto-fit, minmax(${o}, 1fr))` : g(t) ?? "repeat(auto-fit, minmax(12rem, 1fr))", a.gridTemplateRows = g(n)), e === "border" && (a.gridTemplateColumns = g(t), a.gridTemplateRows = g(n)), Object.keys(a).length > 0 ? { ...a, ...r } : r;
}, D = (e) => {
  const t = e.props["data-panel-card"];
  if (t !== void 0) return String(t);
  if (e.key !== null) return String(e.key);
}, U = (e, t, n) => {
  if (t !== "border" && t !== "card") return e;
  let o = !1;
  return m.Children.map(e, (r) => {
    if (!m.isValidElement(r)) return r;
    if (t === "border") {
      const f = r.props["data-panel-area"];
      return f ? m.cloneElement(r, {
        style: { ...r.props.style, gridArea: f }
      }) : r;
    }
    const a = D(r), d = n === void 0 ? !o : a === String(n);
    return o = o || d, d ? m.cloneElement(r, {
      style: {
        ...r.props.style,
        minWidth: 0,
        width: "100%",
        maxWidth: "100%"
      }
    }) : m.cloneElement(r, {
      style: { ...r.props.style, display: "none" }
    });
  });
}, q = m.forwardRef(
  ({
    variant: e = s.variant,
    padding: t = s.padding,
    radius: n = s.radius,
    as: o,
    layout: r = s.layout,
    direction: a = s.direction,
    gap: d = s.gap,
    alignItems: f = s.alignItems,
    justifyContent: x = s.justifyContent,
    wrap: b,
    columns: y,
    rows: _,
    autoFitMin: v,
    activeCard: C,
    className: T,
    children: S,
    style: j,
    ...A
  }, E) => {
    const h = K(o), L = U(S, r, C), P = $(r, y, _, v, j);
    return /* @__PURE__ */ R(
      h,
      {
        ref: E,
        className: l(
          k[e],
          N[t],
          V[n],
          O(r, a, d, f, x, b),
          T
        ),
        style: P,
        ...A,
        children: L
      }
    );
  }
);
q.displayName = "PanelAtomView";
export {
  q as PanelAtomView
};
//# sourceMappingURL=PanelAtomView.js.map
