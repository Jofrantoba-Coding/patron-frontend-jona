import { jsx as ga } from "react/jsx-runtime";
import d from "react";
import { cn as ia } from "../../lib/cn.js";
import { JPANEL_DEFAULTS as f } from "./InterJPanel.js";
const la = {
  default: "bg-white border border-neutral-200",
  outlined: "bg-transparent border border-neutral-300",
  elevated: "bg-white shadow-md border-0",
  flat: "bg-neutral-50 border-0",
  ghost: "bg-transparent border-0"
}, da = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
}, ua = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, ma = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem"
}, fa = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline"
}, ja = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly"
}, ba = {
  row: "row",
  column: "column"
}, ca = {
  nowrap: "nowrap",
  wrap: "wrap",
  reverse: "wrap-reverse"
}, wa = /* @__PURE__ */ new Set(["grid", "gridbag", "group", "spring"]), ya = (t) => typeof t == "string" ? t.trim() ? t : "div" : t ?? "div", Ca = (t, a) => typeof t == "boolean" ? t ? "wrap" : "nowrap" : t ?? a, F = (t) => typeof t == "number" ? `repeat(${t}, minmax(0, 1fr))` : t, p = (t) => t === void 0 ? void 0 : String(t), w = (t, a) => wa.has(t) ? a ?? "responsive" : a, H = (t, a) => ({
  layout: (a == null ? void 0 : a.layout) ?? t.layout,
  direction: (a == null ? void 0 : a.direction) ?? t.direction,
  gap: (a == null ? void 0 : a.gap) ?? t.gap,
  alignItems: (a == null ? void 0 : a.alignItems) ?? t.alignItems,
  justifyContent: (a == null ? void 0 : a.justifyContent) ?? t.justifyContent,
  wrap: (a == null ? void 0 : a.wrap) ?? t.wrap,
  columns: (a == null ? void 0 : a.columns) ?? t.columns,
  rows: (a == null ? void 0 : a.rows) ?? t.rows,
  autoFitMin: (a == null ? void 0 : a.autoFitMin) ?? t.autoFitMin,
  placement: (a == null ? void 0 : a.placement) ?? t.placement,
  dense: (a == null ? void 0 : a.dense) ?? t.dense,
  mode: (a == null ? void 0 : a.mode) ?? t.mode,
  minHeight: (a == null ? void 0 : a.minHeight) ?? t.minHeight
}), y = (t, a, i) => {
  const u = i ? `--jpanel-${i}` : "--jpanel", s = (r, l) => {
    t[`${u}-${r}`] = l;
  }, n = a.layout === "flow" ? "wrap" : a.direction === "column" ? "nowrap" : "wrap", g = w(a.layout, a.placement);
  s("gap", ma[a.gap]), s("direction", ba[a.direction]), s("wrap", ca[Ca(a.wrap, n)]), s("align-items", fa[a.alignItems]), s("justify-content", ja[a.justifyContent]), s("columns", F(a.columns)), s("rows", F(a.rows)), s("auto-fit-min", a.autoFitMin ?? "12rem"), s("spring-min-height", a.minHeight ?? "16rem"), s("placement", g);
}, I = (t) => {
  const a = t.props.card ?? t.props["data-panel-card"];
  if (a !== void 0) return String(a);
  if (t.key !== null) return String(t.key);
}, Sa = (t) => t.props.area ?? t.props["data-panel-area"], Va = (t) => [
  t.props.springLeft,
  t.props.springRight,
  t.props.springTop,
  t.props.springBottom,
  t.props.springWidth,
  t.props.springHeight,
  t.props["data-spring-left"],
  t.props["data-spring-right"],
  t.props["data-spring-top"],
  t.props["data-spring-bottom"],
  t.props["data-spring-width"],
  t.props["data-spring-height"]
].some((a) => a !== void 0), j = (t, a) => t.has(a), xa = (t, a, i) => {
  const u = [];
  if (j(a, "border") && d.Children.forEach(t, (s, n) => {
    d.isValidElement(s) && !Sa(s) && u.push(
      `[JPanel] layout="border" necesita que el hijo #${n + 1} defina area="top|right|bottom|left|center" o data-panel-area.`
    );
  }), j(a, "card") && i !== void 0) {
    let s = !1;
    d.Children.forEach(t, (n) => {
      d.isValidElement(n) && I(n) === String(i) && (s = !0);
    }), s || u.push(
      `[JPanel] layout="card" recibio activeCard="${String(i)}", pero ningun hijo define card, data-panel-card o key con ese valor.`
    );
  }
  return j(a, "spring") && d.Children.forEach(t, (s, n) => {
    d.isValidElement(s) && !Va(s) && u.push(
      `[JPanel] layout="spring" necesita que el hijo #${n + 1} defina al menos una constraint springLeft/right/top/bottom/width/height o data-spring-*.`
    );
  }), u;
}, Ea = (t) => {
  t.length === 0 || typeof console > "u" || typeof console.log != "function" || t.forEach((a) => console.log(a));
}, Pa = (t, a, i) => {
  if (!["border", "card", "gridbag", "group", "spring"].some((n) => a.has(n))) return t;
  let s = !1;
  return d.Children.map(t, (n) => {
    if (!d.isValidElement(n)) return n;
    const g = {}, r = { ...n.props.style };
    if (j(a, "border")) {
      const l = n.props.area ?? n.props["data-panel-area"];
      l && (g["data-panel-area"] = l, r.gridArea = l);
    }
    if (j(a, "gridbag") && (g["data-jpanel-gridbag-item"] = "", g["data-jona-gridbag-item"] = "", r["--jpanel-gridbag-column"] = p(n.props.gridBagColumn ?? n.props["data-gridbag-column"] ?? n.props["data-gridbag-col"]), r["--jpanel-gridbag-row"] = p(n.props.gridBagRow ?? n.props["data-gridbag-row"]), r["--jpanel-gridbag-column-span"] = p(n.props.gridBagColumnSpan ?? n.props["data-gridbag-column-span"] ?? n.props["data-gridbag-colspan"]), r["--jpanel-gridbag-row-span"] = p(n.props.gridBagRowSpan ?? n.props["data-gridbag-row-span"] ?? n.props["data-gridbag-rowspan"]), r["--jpanel-gridbag-align"] = n.props.gridBagAlign ?? n.props["data-gridbag-align"], r["--jpanel-gridbag-justify"] = n.props.gridBagJustify ?? n.props["data-gridbag-justify"]), j(a, "group") && (g["data-jpanel-group-item"] = "", g["data-jona-group-item"] = "", r["--jpanel-group-span"] = p(n.props.groupSpan ?? n.props["data-group-span"]), r["--jpanel-group-align"] = n.props.groupAlign ?? n.props["data-group-align"], r["--jpanel-group-justify"] = n.props.groupJustify ?? n.props["data-group-justify"]), j(a, "spring") && (g["data-jpanel-spring-item"] = "", g["data-jona-spring-item"] = "", r["--jpanel-spring-left"] = p(n.props.springLeft ?? n.props["data-spring-left"]), r["--jpanel-spring-right"] = p(n.props.springRight ?? n.props["data-spring-right"]), r["--jpanel-spring-top"] = p(n.props.springTop ?? n.props["data-spring-top"]), r["--jpanel-spring-bottom"] = p(n.props.springBottom ?? n.props["data-spring-bottom"]), r["--jpanel-spring-width"] = p(n.props.springWidth ?? n.props["data-spring-width"]), r["--jpanel-spring-height"] = p(n.props.springHeight ?? n.props["data-spring-height"])), j(a, "card")) {
      const l = I(n), c = i === void 0 ? !s : l === String(i);
      s = s || c, g["data-jpanel-card-state"] = c ? "active" : "hidden", l !== void 0 && (g["data-panel-card"] = l);
    }
    return d.cloneElement(n, {
      ...g,
      style: r
    });
  });
}, Ja = d.forwardRef(
  ({
    variant: t = f.variant,
    padding: a = f.padding,
    radius: i = f.radius,
    as: u,
    layout: s = f.layout,
    direction: n = f.direction,
    gap: g = f.gap,
    alignItems: r = f.alignItems,
    justifyContent: l = f.justifyContent,
    wrap: c,
    columns: M,
    rows: T,
    autoFitMin: q,
    placement: C,
    dense: S,
    mode: V,
    minHeight: B,
    activeCard: x,
    tablet: R,
    desktop: D,
    area: K,
    card: N,
    gridBagColumn: E,
    gridBagRow: P,
    gridBagColumnSpan: J,
    gridBagRowSpan: k,
    gridBagAlign: W,
    gridBagJustify: U,
    groupSpan: _,
    groupAlign: z,
    groupJustify: G,
    springLeft: O,
    springRight: Q,
    springTop: X,
    springBottom: Y,
    springWidth: Z,
    springHeight: v,
    className: aa,
    children: h,
    style: ta,
    ...e
  }, na) => {
    const sa = ya(u), A = {
      layout: s,
      direction: n,
      gap: g,
      alignItems: r,
      justifyContent: l,
      wrap: c,
      columns: M,
      rows: T,
      autoFitMin: q,
      placement: C,
      dense: S,
      mode: V,
      minHeight: B
    }, m = H(A, R), b = H(m, D), L = /* @__PURE__ */ new Set([s, m.layout, b.layout]), o = { ...ta };
    y(o, A, ""), y(o, m, "tablet"), y(o, b, "desktop");
    const $ = xa(h, L, x), ea = $.join(`
`);
    d.useEffect(() => {
      Ea($);
    }, [ea]);
    const pa = K ?? e["data-panel-area"], ra = N ?? e["data-panel-card"];
    (E ?? e["data-gridbag-column"] ?? e["data-gridbag-col"]) && (o["--jpanel-gridbag-column"] = p(E ?? e["data-gridbag-column"] ?? e["data-gridbag-col"])), (P ?? e["data-gridbag-row"]) && (o["--jpanel-gridbag-row"] = p(P ?? e["data-gridbag-row"])), (J ?? e["data-gridbag-column-span"] ?? e["data-gridbag-colspan"]) && (o["--jpanel-gridbag-column-span"] = p(J ?? e["data-gridbag-column-span"] ?? e["data-gridbag-colspan"])), (k ?? e["data-gridbag-row-span"] ?? e["data-gridbag-rowspan"]) && (o["--jpanel-gridbag-row-span"] = p(k ?? e["data-gridbag-row-span"] ?? e["data-gridbag-rowspan"])), o["--jpanel-gridbag-align"] = W ?? e["data-gridbag-align"], o["--jpanel-gridbag-justify"] = U ?? e["data-gridbag-justify"], o["--jpanel-group-span"] = p(_ ?? e["data-group-span"]), o["--jpanel-group-align"] = z ?? e["data-group-align"], o["--jpanel-group-justify"] = G ?? e["data-group-justify"], o["--jpanel-spring-left"] = p(O ?? e["data-spring-left"]), o["--jpanel-spring-right"] = p(Q ?? e["data-spring-right"]), o["--jpanel-spring-top"] = p(X ?? e["data-spring-top"]), o["--jpanel-spring-bottom"] = p(Y ?? e["data-spring-bottom"]), o["--jpanel-spring-width"] = p(Z ?? e["data-spring-width"]), o["--jpanel-spring-height"] = p(v ?? e["data-spring-height"]);
    const oa = Pa(h, L, x);
    return /* @__PURE__ */ ga(
      sa,
      {
        ref: na,
        className: ia(
          "jpanel",
          la[t],
          da[a],
          ua[i],
          aa
        ),
        style: o,
        "data-jpanel-layout": s,
        "data-jpanel-tablet-layout": m.layout,
        "data-jpanel-desktop-layout": b.layout,
        "data-jpanel-placement": w(s, C),
        "data-jpanel-tablet-placement": w(m.layout, m.placement),
        "data-jpanel-desktop-placement": w(b.layout, b.placement),
        "data-jpanel-dense": S === !1 ? "false" : "true",
        "data-jpanel-tablet-dense": m.dense === !1 ? "false" : "true",
        "data-jpanel-desktop-dense": b.dense === !1 ? "false" : "true",
        "data-jpanel-mode": V ?? "sequential",
        "data-jpanel-tablet-mode": m.mode ?? "sequential",
        "data-jpanel-desktop-mode": b.mode ?? "sequential",
        "data-panel-area": pa,
        "data-panel-card": ra,
        ...e,
        children: oa
      }
    );
  }
);
Ja.displayName = "JPanelView";
export {
  Ja as JPanelView
};
//# sourceMappingURL=JPanelView.js.map
