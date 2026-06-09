import { jsx as La } from "react/jsx-runtime";
import d, { useEffect as $a } from "react";
import { cn as Fa } from "../../lib/cn.js";
import { JPANEL_DEFAULTS as c } from "./InterJPanel.js";
const Ha = {
  default: "bg-white border border-neutral-200",
  outlined: "bg-transparent border border-neutral-300",
  elevated: "bg-white shadow-md border-0",
  flat: "bg-neutral-50 border-0",
  ghost: "bg-transparent border-0"
}, Ma = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
}, Ta = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, Ba = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem"
}, Ia = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline"
}, Ka = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly"
}, Na = {
  row: "row",
  column: "column"
}, Wa = {
  nowrap: "nowrap",
  wrap: "wrap",
  reverse: "wrap-reverse"
}, Da = /* @__PURE__ */ new Set(["grid", "gridbag", "group", "spring"]), Ua = (t) => typeof t == "string" && t.trim() === "" ? "div" : t ?? "div", _a = (t, a) => typeof t == "boolean" ? t ? "wrap" : "nowrap" : t ?? a, T = (t) => typeof t == "number" ? `repeat(${t}, minmax(0, 1fr))` : t, p = (t) => t === void 0 ? void 0 : String(t), y = (t, a) => Da.has(t) ? a ?? "responsive" : a, w = (t, a) => {
  const r = (a == null ? void 0 : a.layout) ?? t.layout;
  return {
    layout: r,
    direction: (a == null ? void 0 : a.direction) ?? t.direction,
    gap: (a == null ? void 0 : a.gap) ?? t.gap,
    alignItems: (a == null ? void 0 : a.alignItems) ?? t.alignItems,
    justifyContent: (a == null ? void 0 : a.justifyContent) ?? t.justifyContent,
    wrap: (a == null ? void 0 : a.wrap) ?? t.wrap,
    columns: (a == null ? void 0 : a.columns) ?? t.columns,
    rows: (a == null ? void 0 : a.rows) ?? t.rows,
    autoFitMin: (a == null ? void 0 : a.autoFitMin) ?? t.autoFitMin,
    placement: (a == null ? void 0 : a.placement) ?? t.placement,
    dense: (a == null ? void 0 : a.dense) ?? t.dense ?? (r === "gridbag" ? !0 : void 0),
    mode: (a == null ? void 0 : a.mode) ?? t.mode,
    minHeight: (a == null ? void 0 : a.minHeight) ?? t.minHeight
  };
}, C = (t, a, r) => {
  const u = r ? `--jpanel-${r}` : "--jpanel", e = (s, i) => {
    t[`${u}-${s}`] = i;
  }, n = a.layout === "flow" ? "wrap" : a.direction === "column" ? "nowrap" : "wrap", l = y(a.layout, a.placement);
  e("gap", Ba[a.gap]), e("direction", Na[a.direction]), e("wrap", Wa[_a(a.wrap, n)]), e("align-items", Ia[a.alignItems]), e("justify-content", Ka[a.justifyContent]), e("columns", T(a.columns)), e("rows", T(a.rows)), e("auto-fit-min", a.autoFitMin ?? "12rem"), e("spring-min-height", a.minHeight ?? "16rem"), e("placement", l);
}, B = (t) => {
  const a = t.props.card ?? t.props["data-panel-card"];
  if (a !== void 0) return String(a);
  if (t.key !== null) return String(t.key);
}, za = (t) => t.props.area ?? t.props["data-panel-area"], Oa = (t) => [
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
].some((a) => a !== void 0), Qa = (t, a, r) => {
  const u = [];
  if (a.has("border") && d.Children.forEach(t, (e, n) => {
    d.isValidElement(e) && !za(e) && u.push(
      `[JPanel] layout="border" necesita que el hijo #${n + 1} defina area="top|right|bottom|left|center" o data-panel-area.`
    );
  }), a.has("card") && r !== void 0) {
    let e = !1;
    d.Children.forEach(t, (n) => {
      d.isValidElement(n) && B(n) === String(r) && (e = !0);
    }), e || u.push(
      `[JPanel] layout="card" recibio activeCard="${String(r)}", pero ningun hijo define card, data-panel-card o key con ese valor.`
    );
  }
  return a.has("spring") && d.Children.forEach(t, (e, n) => {
    d.isValidElement(e) && !Oa(e) && u.push(
      `[JPanel] layout="spring" necesita que el hijo #${n + 1} defina al menos una constraint springLeft/right/top/bottom/width/height o data-spring-*.`
    );
  }), u;
}, Ra = (t, a, r) => {
  if (!["border", "card", "gridbag", "group", "spring"].some((n) => a.has(n))) return t;
  let e = !1;
  return d.Children.map(t, (n) => {
    if (!d.isValidElement(n)) return n;
    const l = {}, s = { ...n.props.style };
    if (a.has("border")) {
      const i = n.props.area ?? n.props["data-panel-area"];
      i && (l["data-panel-area"] = i, s.gridArea = i);
    }
    if (a.has("gridbag") && (l["data-jpanel-gridbag-item"] = "", l["data-jona-gridbag-item"] = "", s["--jpanel-gridbag-column"] = p(n.props.gridBagColumn ?? n.props["data-gridbag-column"] ?? n.props["data-gridbag-col"]), s["--jpanel-gridbag-row"] = p(n.props.gridBagRow ?? n.props["data-gridbag-row"]), s["--jpanel-gridbag-column-span"] = p(n.props.gridBagColumnSpan ?? n.props["data-gridbag-column-span"] ?? n.props["data-gridbag-colspan"]), s["--jpanel-gridbag-row-span"] = p(n.props.gridBagRowSpan ?? n.props["data-gridbag-row-span"] ?? n.props["data-gridbag-rowspan"]), s["--jpanel-gridbag-align"] = n.props.gridBagAlign ?? n.props["data-gridbag-align"], s["--jpanel-gridbag-justify"] = n.props.gridBagJustify ?? n.props["data-gridbag-justify"]), a.has("group") && (l["data-jpanel-group-item"] = "", l["data-jona-group-item"] = "", s["--jpanel-group-span"] = p(n.props.groupSpan ?? n.props["data-group-span"]), s["--jpanel-group-align"] = n.props.groupAlign ?? n.props["data-group-align"], s["--jpanel-group-justify"] = n.props.groupJustify ?? n.props["data-group-justify"]), a.has("spring") && (l["data-jpanel-spring-item"] = "", l["data-jona-spring-item"] = "", s["--jpanel-spring-left"] = p(n.props.springLeft ?? n.props["data-spring-left"]), s["--jpanel-spring-right"] = p(n.props.springRight ?? n.props["data-spring-right"]), s["--jpanel-spring-top"] = p(n.props.springTop ?? n.props["data-spring-top"]), s["--jpanel-spring-bottom"] = p(n.props.springBottom ?? n.props["data-spring-bottom"]), s["--jpanel-spring-width"] = p(n.props.springWidth ?? n.props["data-spring-width"]), s["--jpanel-spring-height"] = p(n.props.springHeight ?? n.props["data-spring-height"])), a.has("card")) {
      const i = B(n), V = r === void 0 ? !e : i === String(r);
      e = e || V, l["data-jpanel-card-state"] = V ? "active" : "hidden", i !== void 0 && (l["data-panel-card"] = i);
    }
    return d.cloneElement(n, { ...l, style: s });
  });
}, Xa = ({
  variant: t = c.variant,
  padding: a = c.padding,
  radius: r = c.radius,
  as: u,
  layout: e = c.layout,
  direction: n = c.direction,
  gap: l = c.gap,
  alignItems: s = c.alignItems,
  justifyContent: i = c.justifyContent,
  wrap: V,
  columns: I,
  rows: K,
  autoFitMin: N,
  placement: W,
  dense: D,
  mode: U,
  minHeight: _,
  activeCard: h,
  mobileSmall: z,
  mobileLarge: O,
  tablet: Q,
  desktop: R,
  tv: X,
  area: Y,
  card: Z,
  gridBagColumn: x,
  gridBagRow: S,
  gridBagColumnSpan: E,
  gridBagRowSpan: P,
  gridBagAlign: G,
  gridBagJustify: v,
  groupSpan: aa,
  groupAlign: ta,
  groupJustify: na,
  springLeft: ea,
  springRight: pa,
  springTop: sa,
  springBottom: oa,
  springWidth: ra,
  springHeight: la,
  "data-panel-area": ga,
  "data-panel-card": ia,
  "data-gridbag-column": k,
  "data-gridbag-col": J,
  "data-gridbag-row": A,
  "data-gridbag-column-span": q,
  "data-gridbag-colspan": L,
  "data-gridbag-row-span": $,
  "data-gridbag-rowspan": F,
  "data-gridbag-align": ua,
  "data-gridbag-justify": da,
  "data-group-span": ma,
  "data-group-align": fa,
  "data-group-justify": ja,
  "data-spring-left": ca,
  "data-spring-right": ba,
  "data-spring-top": ya,
  "data-spring-bottom": wa,
  "data-spring-width": Ca,
  "data-spring-height": Va,
  className: ha,
  children: H,
  style: xa,
  forwardedRef: Sa,
  ...Ea
}) => {
  const Pa = Ua(u), g = w({
    layout: e,
    direction: n,
    gap: l,
    alignItems: s,
    justifyContent: i,
    wrap: V,
    columns: I,
    rows: K,
    autoFitMin: N,
    placement: W,
    dense: D,
    mode: U,
    minHeight: _
  }, z), m = w(g, O), f = w(m, Q), j = w(f, R), b = w(j, X), M = /* @__PURE__ */ new Set([
    g.layout,
    m.layout,
    f.layout,
    j.layout,
    b.layout
  ]), o = { ...xa };
  C(o, g, ""), C(o, m, "mobile-large"), C(o, f, "tablet"), C(o, j, "desktop"), C(o, b, "tv");
  const ka = Y ?? ga, Ja = Z ?? ia;
  (x ?? k ?? J) && (o["--jpanel-gridbag-column"] = p(x ?? k ?? J)), (S ?? A) && (o["--jpanel-gridbag-row"] = p(S ?? A)), (E ?? q ?? L) && (o["--jpanel-gridbag-column-span"] = p(E ?? q ?? L)), (P ?? $ ?? F) && (o["--jpanel-gridbag-row-span"] = p(P ?? $ ?? F)), o["--jpanel-gridbag-align"] = G ?? ua, o["--jpanel-gridbag-justify"] = v ?? da, o["--jpanel-group-span"] = p(aa ?? ma), o["--jpanel-group-align"] = ta ?? fa, o["--jpanel-group-justify"] = na ?? ja, o["--jpanel-spring-left"] = p(ea ?? ca), o["--jpanel-spring-right"] = p(pa ?? ba), o["--jpanel-spring-top"] = p(sa ?? ya), o["--jpanel-spring-bottom"] = p(oa ?? wa), o["--jpanel-spring-width"] = p(ra ?? Ca), o["--jpanel-spring-height"] = p(la ?? Va);
  const Aa = Qa(H, M, h).join(`
`);
  $a(() => {
  }, [Aa]);
  const qa = Ra(H, M, h);
  return /* @__PURE__ */ La(
    Pa,
    {
      ref: Sa,
      ...Ea,
      className: Fa(
        "jpanel",
        Ha[t],
        Ma[a],
        Ta[r],
        ha
      ),
      style: o,
      "data-jpanel-layout": g.layout,
      "data-jpanel-mobile-small-layout": g.layout,
      "data-jpanel-mobile-large-layout": m.layout,
      "data-jpanel-tablet-layout": f.layout,
      "data-jpanel-desktop-layout": j.layout,
      "data-jpanel-tv-layout": b.layout,
      "data-jpanel-placement": y(g.layout, g.placement),
      "data-jpanel-mobile-small-placement": y(g.layout, g.placement),
      "data-jpanel-mobile-large-placement": y(m.layout, m.placement),
      "data-jpanel-tablet-placement": y(f.layout, f.placement),
      "data-jpanel-desktop-placement": y(j.layout, j.placement),
      "data-jpanel-tv-placement": y(b.layout, b.placement),
      "data-jpanel-dense": g.dense ? "true" : "false",
      "data-jpanel-mobile-small-dense": g.dense ? "true" : "false",
      "data-jpanel-mobile-large-dense": m.dense ? "true" : "false",
      "data-jpanel-tablet-dense": f.dense ? "true" : "false",
      "data-jpanel-desktop-dense": j.dense ? "true" : "false",
      "data-jpanel-tv-dense": b.dense ? "true" : "false",
      "data-jpanel-mode": g.mode ?? "sequential",
      "data-jpanel-mobile-small-mode": g.mode ?? "sequential",
      "data-jpanel-mobile-large-mode": m.mode ?? "sequential",
      "data-jpanel-tablet-mode": f.mode ?? "sequential",
      "data-jpanel-desktop-mode": j.mode ?? "sequential",
      "data-jpanel-tv-mode": b.mode ?? "sequential",
      "data-panel-area": ka,
      "data-panel-card": Ja,
      children: qa
    }
  );
};
Xa.displayName = "JPanelView";
export {
  Xa as JPanelView
};
//# sourceMappingURL=JPanelView.js.map
