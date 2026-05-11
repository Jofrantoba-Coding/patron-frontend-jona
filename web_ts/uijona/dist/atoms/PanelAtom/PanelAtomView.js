import { jsx as R } from "react/jsx-runtime";
import m from "react";
import { cn as i } from "../../lib/cn.js";
import { PANEL_ATOM_DEFAULTS as a } from "./InterPanelAtom.js";
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
}, l = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8"
}, f = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
}, u = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
}, W = {
  row: "flex-row",
  column: "flex-col"
}, c = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  reverse: "flex-wrap-reverse"
}, K = (e) => typeof e == "string" ? e.trim() ? e : "div" : e ?? "div", w = (e, t) => typeof e == "boolean" ? e ? "wrap" : "nowrap" : e ?? t, g = (e) => typeof e == "number" ? `repeat(${e}, minmax(0, 1fr))` : e, O = (e, t, n, o, r, s) => {
  if (e !== "none")
    return e === "flow" ? i(
      "flex min-w-0 flex-row",
      c[w(s, "wrap")],
      l[n],
      f[o],
      u[r]
    ) : e === "box" ? i(
      "flex min-w-0",
      W[t],
      c[w(s, t === "column" ? "nowrap" : "wrap")],
      l[n],
      f[o],
      u[r]
    ) : e === "grid" ? i("grid min-w-0", l[n], f[o], u[r]) : e === "border" ? i(
      "grid min-h-0 min-w-0",
      "[grid-template-areas:'top'_'left'_'center'_'right'_'bottom']",
      "[grid-template-columns:minmax(0,1fr)]",
      "[grid-template-rows:auto_auto_minmax(0,1fr)_auto_auto]",
      "md:[grid-template-areas:'top_top_top'_'left_center_right'_'bottom_bottom_bottom']",
      "md:[grid-template-columns:auto_minmax(0,1fr)_auto]",
      "md:[grid-template-rows:auto_minmax(0,1fr)_auto]",
      l[n],
      f[o],
      u[r]
    ) : e === "card" ? i("relative min-w-0 w-full max-w-full", l[n]) : i("relative min-w-0", l[n]);
}, $ = (e, t, n, o, r) => {
  const s = {};
  return e === "grid" && (s.gridTemplateColumns = o ? `repeat(auto-fit, minmax(${o}, 1fr))` : g(t), s.gridTemplateRows = g(n)), e === "border" && (s.gridTemplateColumns = g(t), s.gridTemplateRows = g(n)), Object.keys(s).length > 0 ? { ...s, ...r } : r;
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
      const p = r.props["data-panel-area"];
      return p ? m.cloneElement(r, {
        style: { ...r.props.style, gridArea: p }
      }) : r;
    }
    const s = D(r), d = n === void 0 ? !o : s === String(n);
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
    variant: e = a.variant,
    padding: t = a.padding,
    radius: n = a.radius,
    as: o,
    layout: r = a.layout,
    direction: s = a.direction,
    gap: d = a.gap,
    alignItems: p = a.alignItems,
    justifyContent: b = a.justifyContent,
    wrap: x,
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
        className: i(
          k[e],
          N[t],
          V[n],
          O(r, s, d, p, b, x),
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
