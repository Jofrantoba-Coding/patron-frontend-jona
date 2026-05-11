import { jsx as W } from "react/jsx-runtime";
import d from "react";
import { cn as g } from "../../lib/cn.js";
import { PANEL_ATOM_DEFAULTS as u } from "./InterPanelAtom.js";
const K = {
  default: "bg-white border border-neutral-200",
  outlined: "bg-transparent border border-neutral-300",
  elevated: "bg-white shadow-md border-0",
  flat: "bg-neutral-50 border-0",
  ghost: "bg-transparent border-0"
}, O = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
}, q = {
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
}, m = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline"
}, f = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly"
}, U = {
  row: "flex-row",
  column: "flex-col"
}, j = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  reverse: "flex-wrap-reverse"
}, $ = /* @__PURE__ */ new Set(["grid", "gridbag", "group", "spring"]), z = (r) => typeof r == "string" ? r.trim() ? r : "div" : r ?? "div", c = (r, t) => typeof r == "boolean" ? r ? "wrap" : "nowrap" : r ?? t, b = (r) => typeof r == "number" ? `repeat(${r}, minmax(0, 1fr))` : r, i = (r) => {
  if (r !== void 0)
    return String(r);
}, H = (r, t) => $.has(r) ? t ?? "responsive" : void 0, J = (r, t, a, o, e, s, n) => {
  if (r !== "none")
    return r === "flow" ? g(
      "flex min-w-0 w-full max-w-full flex-row",
      j[c(s, "wrap")],
      l[a],
      m[o],
      f[e]
    ) : r === "box" ? g(
      "flex min-w-0 w-full max-w-full",
      U[t],
      j[c(s, t === "column" ? "nowrap" : "wrap")],
      l[a],
      m[o],
      f[e]
    ) : r === "grid" ? g(
      "grid jona-layout-mobile-grid min-w-0 w-full max-w-full",
      l[a],
      m[o],
      f[e]
    ) : r === "gridbag" ? g(
      "jona-layout-mobile-grid jona-gridbag",
      l[a],
      m[o],
      f[e]
    ) : r === "group" ? g(
      "jona-layout-mobile-grid jona-group-layout",
      n === "parallel" && "justify-items-stretch",
      l[a],
      m[o],
      f[e]
    ) : r === "spring" ? g(
      "jona-spring-layout",
      l[a],
      m[o],
      f[e]
    ) : r === "border" ? g(
      "grid min-h-0 min-w-0 w-full max-w-full",
      "[grid-template-areas:'top'_'left'_'center'_'right'_'bottom']",
      "[grid-template-columns:minmax(0,1fr)]",
      "[grid-template-rows:auto_auto_auto_auto_auto]",
      "md:[grid-template-areas:'top_top_top'_'left_center_right'_'bottom_bottom_bottom']",
      "md:[grid-template-columns:auto_minmax(0,1fr)_auto]",
      "md:[grid-template-rows:auto_minmax(0,1fr)_auto]",
      l[a],
      m[o],
      f[e]
    ) : r === "card" ? g("relative min-w-0 w-full max-w-full", l[a]) : g("relative min-w-0", l[a]);
}, Q = (r, t, a, o, e, s) => {
  const n = {};
  return r === "grid" && (n["--jona-layout-min"] = o ?? "12rem", n["--jona-layout-columns"] = b(t), n["--jona-layout-rows"] = b(a)), r === "border" && (n.gridTemplateColumns = b(t), n.gridTemplateRows = b(a)), r === "gridbag" && (n["--jona-layout-min"] = o ?? "12rem", n["--jona-layout-columns"] = b(t), n["--jona-layout-rows"] = b(a)), r === "group" && (n["--jona-layout-min"] = o ?? "12rem", n["--jona-layout-columns"] = b(t)), r === "spring" && (n["--jona-layout-min"] = o ?? "12rem", n["--jona-spring-min-height"] = e ?? "16rem"), Object.keys(n).length > 0 ? { ...n, ...s } : s;
}, X = (r) => {
  const t = r.props["data-panel-card"];
  if (t !== void 0) return String(t);
  if (r.key !== null) return String(r.key);
}, Y = (r) => i(r["data-gridbag-column"] ?? r["data-gridbag-col"]), Z = (r) => i(r["data-gridbag-column-span"] ?? r["data-gridbag-colspan"]), F = (r) => i(r["data-gridbag-row-span"] ?? r["data-gridbag-rowspan"]), M = (r, t, a) => {
  if (!["border", "card", "gridbag", "group", "spring"].includes(t)) return r;
  let o = !1;
  return d.Children.map(r, (e) => {
    if (!d.isValidElement(e)) return e;
    if (t === "border") {
      const p = e.props["data-panel-area"];
      return p ? d.cloneElement(e, {
        style: { ...e.props.style, gridArea: p }
      }) : e;
    }
    if (t === "gridbag") {
      const p = {
        ...e.props.style,
        "--jona-gridbag-column": Y(e.props),
        "--jona-gridbag-row": i(e.props["data-gridbag-row"]),
        "--jona-gridbag-column-span": Z(e.props),
        "--jona-gridbag-row-span": F(e.props),
        "--jona-gridbag-align": e.props["data-gridbag-align"],
        "--jona-gridbag-justify": e.props["data-gridbag-justify"]
      };
      return d.cloneElement(e, {
        "data-jona-gridbag-item": "",
        style: p
      });
    }
    if (t === "group") {
      const p = {
        ...e.props.style,
        "--jona-group-span": i(e.props["data-group-span"]),
        "--jona-group-align": e.props["data-group-align"],
        "--jona-group-justify": e.props["data-group-justify"]
      };
      return d.cloneElement(e, {
        "data-jona-group-item": "",
        style: p
      });
    }
    if (t === "spring") {
      const p = {
        ...e.props.style,
        "--jona-spring-left": i(e.props["data-spring-left"]),
        "--jona-spring-right": i(e.props["data-spring-right"]),
        "--jona-spring-top": i(e.props["data-spring-top"]),
        "--jona-spring-bottom": i(e.props["data-spring-bottom"]),
        "--jona-spring-width": i(e.props["data-spring-width"]),
        "--jona-spring-height": i(e.props["data-spring-height"])
      };
      return d.cloneElement(e, {
        "data-jona-spring-item": "",
        style: p
      });
    }
    const s = X(e), n = a === void 0 ? !o : s === String(a);
    return o = o || n, n ? d.cloneElement(e, {
      style: {
        ...e.props.style,
        minWidth: 0,
        width: "100%",
        maxWidth: "100%"
      }
    }) : d.cloneElement(e, {
      style: { ...e.props.style, display: "none" }
    });
  });
}, h = (r, t, a, o) => {
  const e = {}, s = H(r, t);
  return s && (e["data-jona-layout-placement"] = s), r === "gridbag" && (e["data-jona-layout-dense"] = a === !1 ? "false" : "true"), r === "group" && (e["data-jona-layout-mode"] = o ?? "sequential"), e;
}, I = d.forwardRef(
  ({
    variant: r = u.variant,
    padding: t = u.padding,
    radius: a = u.radius,
    as: o,
    layout: e = u.layout,
    direction: s = u.direction,
    gap: n = u.gap,
    alignItems: p = u.alignItems,
    justifyContent: y = u.justifyContent,
    wrap: x,
    columns: v,
    rows: _,
    autoFitMin: C,
    placement: S,
    dense: A,
    mode: w,
    minHeight: E,
    activeCard: L,
    className: T,
    children: P,
    style: R,
    ...V
  }, k) => {
    const B = z(o), D = M(P, e, L), G = Q(e, v, _, C, E, R), N = h(e, S, A, w);
    return /* @__PURE__ */ W(
      B,
      {
        ref: k,
        className: g(
          K[r],
          O[t],
          q[a],
          J(e, s, n, p, y, x, w),
          T
        ),
        style: G,
        ...V,
        ...N,
        children: D
      }
    );
  }
);
I.displayName = "PanelAtomView";
export {
  I as PanelAtomView
};
//# sourceMappingURL=PanelAtomView.js.map
