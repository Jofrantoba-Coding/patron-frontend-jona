import { jsx as N } from "react/jsx-runtime";
import l from "react";
import { cn as i } from "../../lib/cn.js";
import { PANEL_ATOM_DEFAULTS as a } from "./InterPanelAtom.js";
const V = {
  default: "bg-white border border-neutral-200",
  outlined: "bg-transparent border border-neutral-300",
  elevated: "bg-white shadow-md border-0",
  flat: "bg-neutral-50 border-0",
  ghost: "bg-transparent border-0"
}, h = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
}, K = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, d = {
  none: "gap-0",
  xs: "gap-1",
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8"
}, m = {
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
}, O = {
  row: "flex-row",
  column: "flex-col"
}, c = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  reverse: "flex-wrap-reverse"
}, _ = (e) => typeof e == "string" ? e.trim() ? e : "div" : e ?? "div", b = (e, t) => typeof e == "boolean" ? e ? "wrap" : "nowrap" : e ?? t, g = (e) => typeof e == "number" ? `repeat(${e}, minmax(0, 1fr))` : e, $ = (e, t, o, s, r, n) => {
  if (e !== "none")
    return e === "flow" ? i("flex flex-row", c[b(n, "wrap")], d[o], m[s], u[r]) : e === "box" ? i("flex", O[t], c[b(n, "nowrap")], d[o], m[s], u[r]) : e === "grid" ? i("grid", d[o], m[s], u[r]) : e === "border" ? i("grid min-h-0", d[o], m[s], u[r]) : i("relative", d[o]);
}, D = (e, t, o, s, r) => {
  const n = {};
  return e === "grid" && (n.gridTemplateColumns = s ? `repeat(auto-fit, minmax(${s}, 1fr))` : g(t), n.gridTemplateRows = g(o)), e === "border" && (n.gridTemplateAreas = "'top top top' 'left center right' 'bottom bottom bottom'", n.gridTemplateColumns = g(t) ?? "auto minmax(0, 1fr) auto", n.gridTemplateRows = g(o) ?? "auto minmax(0, 1fr) auto"), Object.keys(n).length > 0 ? { ...n, ...r } : r;
}, U = (e) => {
  const t = e.props["data-panel-card"];
  if (t !== void 0) return String(t);
  if (e.key !== null) return String(e.key);
}, W = (e, t, o) => {
  if (t !== "border" && t !== "card") return e;
  let s = !1;
  return l.Children.map(e, (r) => {
    if (!l.isValidElement(r)) return r;
    if (t === "border") {
      const f = r.props["data-panel-area"];
      return f ? l.cloneElement(r, {
        style: { ...r.props.style, gridArea: f }
      }) : r;
    }
    const n = U(r), p = o === void 0 ? !s : n === String(o);
    return s = s || p, p ? r : l.cloneElement(r, {
      style: { ...r.props.style, display: "none" }
    });
  });
}, q = l.forwardRef(
  ({
    variant: e = a.variant,
    padding: t = a.padding,
    radius: o = a.radius,
    as: s,
    layout: r = a.layout,
    direction: n = a.direction,
    gap: p = a.gap,
    alignItems: f = a.alignItems,
    justifyContent: w = a.justifyContent,
    wrap: y,
    columns: x,
    rows: v,
    autoFitMin: C,
    activeCard: T,
    className: A,
    children: S,
    style: j,
    ...E
  }, L) => {
    const P = _(s), R = W(S, r, T), k = D(r, x, v, C, j);
    return /* @__PURE__ */ N(
      P,
      {
        ref: L,
        className: i(
          V[e],
          h[t],
          K[o],
          $(r, n, p, f, w, y),
          A
        ),
        style: k,
        ...E,
        children: R
      }
    );
  }
);
q.displayName = "PanelAtomView";
export {
  q as PanelAtomView
};
//# sourceMappingURL=PanelAtomView.js.map
