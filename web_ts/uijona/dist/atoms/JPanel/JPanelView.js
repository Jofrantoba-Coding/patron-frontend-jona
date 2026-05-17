import { jsx as da } from "react/jsx-runtime";
import u from "react";
import { cn as ua } from "../../lib/cn.js";
import { JPANEL_DEFAULTS as c } from "./InterJPanel.js";
const ma = {
  default: "bg-white border border-neutral-200",
  outlined: "bg-transparent border border-neutral-300",
  elevated: "bg-white shadow-md border-0",
  flat: "bg-neutral-50 border-0",
  ghost: "bg-transparent border-0"
}, ja = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
}, fa = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, ba = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem"
}, ca = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline"
}, ya = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly"
}, wa = {
  row: "row",
  column: "column"
}, Ca = {
  nowrap: "nowrap",
  wrap: "wrap",
  reverse: "wrap-reverse"
}, Sa = /* @__PURE__ */ new Set(["grid", "gridbag", "group", "spring"]), Va = (t) => t ?? "div", ha = (t, a) => typeof t == "boolean" ? t ? "wrap" : "nowrap" : t ?? a, q = (t) => typeof t == "number" ? `repeat(${t}, minmax(0, 1fr))` : t, p = (t) => t === void 0 ? void 0 : String(t), w = (t, a) => Sa.has(t) ? a ?? "responsive" : a, C = (t, a) => ({
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
}), S = (t, a, i) => {
  const m = i ? `--jpanel-${i}` : "--jpanel", s = (o, d) => {
    t[`${m}-${o}`] = d;
  }, n = a.layout === "flow" ? "wrap" : a.direction === "column" ? "nowrap" : "wrap", g = w(a.layout, a.placement);
  s("gap", ba[a.gap]), s("direction", wa[a.direction]), s("wrap", Ca[ha(a.wrap, n)]), s("align-items", ca[a.alignItems]), s("justify-content", ya[a.justifyContent]), s("columns", q(a.columns)), s("rows", q(a.rows)), s("auto-fit-min", a.autoFitMin ?? "12rem"), s("spring-min-height", a.minHeight ?? "16rem"), s("placement", g);
}, L = (t) => {
  const a = t.props.card ?? t.props["data-panel-card"];
  if (a !== void 0) return String(a);
  if (t.key !== null) return String(t.key);
}, xa = (t) => t.props.area ?? t.props["data-panel-area"], Ea = (t) => [
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
].some((a) => a !== void 0), Pa = (t, a, i) => {
  const m = [];
  if (a.has("border") && u.Children.forEach(t, (s, n) => {
    u.isValidElement(s) && !xa(s) && m.push(
      `[JPanel] layout="border" necesita que el hijo #${n + 1} defina area="top|right|bottom|left|center" o data-panel-area.`
    );
  }), a.has("card") && i !== void 0) {
    let s = !1;
    u.Children.forEach(t, (n) => {
      u.isValidElement(n) && L(n) === String(i) && (s = !0);
    }), s || m.push(
      `[JPanel] layout="card" recibio activeCard="${String(i)}", pero ningun hijo define card, data-panel-card o key con ese valor.`
    );
  }
  return a.has("spring") && u.Children.forEach(t, (s, n) => {
    u.isValidElement(s) && !Ea(s) && m.push(
      `[JPanel] layout="spring" necesita que el hijo #${n + 1} defina al menos una constraint springLeft/right/top/bottom/width/height o data-spring-*.`
    );
  }), m;
}, ka = (t, a, i) => {
  if (!["border", "card", "gridbag", "group", "spring"].some((n) => a.has(n))) return t;
  let s = !1;
  return u.Children.map(t, (n) => {
    if (!u.isValidElement(n)) return n;
    const g = {}, o = { ...n.props.style };
    if (a.has("border")) {
      const d = n.props.area ?? n.props["data-panel-area"];
      d && (g["data-panel-area"] = d, o.gridArea = d);
    }
    if (a.has("gridbag") && (g["data-jpanel-gridbag-item"] = "", g["data-jona-gridbag-item"] = "", o["--jpanel-gridbag-column"] = p(n.props.gridBagColumn ?? n.props["data-gridbag-column"] ?? n.props["data-gridbag-col"]), o["--jpanel-gridbag-row"] = p(n.props.gridBagRow ?? n.props["data-gridbag-row"]), o["--jpanel-gridbag-column-span"] = p(n.props.gridBagColumnSpan ?? n.props["data-gridbag-column-span"] ?? n.props["data-gridbag-colspan"]), o["--jpanel-gridbag-row-span"] = p(n.props.gridBagRowSpan ?? n.props["data-gridbag-row-span"] ?? n.props["data-gridbag-rowspan"]), o["--jpanel-gridbag-align"] = n.props.gridBagAlign ?? n.props["data-gridbag-align"], o["--jpanel-gridbag-justify"] = n.props.gridBagJustify ?? n.props["data-gridbag-justify"]), a.has("group") && (g["data-jpanel-group-item"] = "", g["data-jona-group-item"] = "", o["--jpanel-group-span"] = p(n.props.groupSpan ?? n.props["data-group-span"]), o["--jpanel-group-align"] = n.props.groupAlign ?? n.props["data-group-align"], o["--jpanel-group-justify"] = n.props.groupJustify ?? n.props["data-group-justify"]), a.has("spring") && (g["data-jpanel-spring-item"] = "", g["data-jona-spring-item"] = "", o["--jpanel-spring-left"] = p(n.props.springLeft ?? n.props["data-spring-left"]), o["--jpanel-spring-right"] = p(n.props.springRight ?? n.props["data-spring-right"]), o["--jpanel-spring-top"] = p(n.props.springTop ?? n.props["data-spring-top"]), o["--jpanel-spring-bottom"] = p(n.props.springBottom ?? n.props["data-spring-bottom"]), o["--jpanel-spring-width"] = p(n.props.springWidth ?? n.props["data-spring-width"]), o["--jpanel-spring-height"] = p(n.props.springHeight ?? n.props["data-spring-height"])), a.has("card")) {
      const d = L(n), V = i === void 0 ? !s : d === String(i);
      s = s || V, g["data-jpanel-card-state"] = V ? "active" : "hidden", d !== void 0 && (g["data-panel-card"] = d);
    }
    return u.cloneElement(n, {
      ...g,
      style: o
    });
  });
}, Ja = u.forwardRef(
  ({
    variant: t = c.variant,
    padding: a = c.padding,
    radius: i = c.radius,
    as: m,
    layout: s = c.layout,
    direction: n = c.direction,
    gap: g = c.gap,
    alignItems: o = c.alignItems,
    justifyContent: d = c.justifyContent,
    wrap: V,
    columns: $,
    rows: F,
    autoFitMin: H,
    placement: M,
    dense: T,
    mode: B,
    minHeight: I,
    activeCard: h,
    mobileSmall: R,
    mobileLarge: K,
    tablet: N,
    desktop: W,
    tv: D,
    area: U,
    card: _,
    gridBagColumn: x,
    gridBagRow: E,
    gridBagColumnSpan: P,
    gridBagRowSpan: k,
    gridBagAlign: z,
    gridBagJustify: G,
    groupSpan: O,
    groupAlign: Q,
    groupJustify: X,
    springLeft: Y,
    springRight: Z,
    springTop: v,
    springBottom: aa,
    springWidth: ta,
    springHeight: na,
    className: ea,
    children: J,
    style: sa,
    ...e
  }, pa) => {
    const oa = Va(m), l = C({
      layout: s,
      direction: n,
      gap: g,
      alignItems: o,
      justifyContent: d,
      wrap: V,
      columns: $,
      rows: F,
      autoFitMin: H,
      placement: M,
      dense: T,
      mode: B,
      minHeight: I
    }, R), j = C(l, K), f = C(j, N), b = C(f, W), y = C(b, D), A = /* @__PURE__ */ new Set([
      l.layout,
      j.layout,
      f.layout,
      b.layout,
      y.layout
    ]), r = { ...sa };
    S(r, l, ""), S(r, j, "mobile-large"), S(r, f, "tablet"), S(r, b, "desktop"), S(r, y, "tv");
    const ra = Pa(J, A, h).join(`
`);
    u.useEffect(() => {
    }, [ra]);
    const ga = U ?? e["data-panel-area"], la = _ ?? e["data-panel-card"];
    (x ?? e["data-gridbag-column"] ?? e["data-gridbag-col"]) && (r["--jpanel-gridbag-column"] = p(x ?? e["data-gridbag-column"] ?? e["data-gridbag-col"])), (E ?? e["data-gridbag-row"]) && (r["--jpanel-gridbag-row"] = p(E ?? e["data-gridbag-row"])), (P ?? e["data-gridbag-column-span"] ?? e["data-gridbag-colspan"]) && (r["--jpanel-gridbag-column-span"] = p(P ?? e["data-gridbag-column-span"] ?? e["data-gridbag-colspan"])), (k ?? e["data-gridbag-row-span"] ?? e["data-gridbag-rowspan"]) && (r["--jpanel-gridbag-row-span"] = p(k ?? e["data-gridbag-row-span"] ?? e["data-gridbag-rowspan"])), r["--jpanel-gridbag-align"] = z ?? e["data-gridbag-align"], r["--jpanel-gridbag-justify"] = G ?? e["data-gridbag-justify"], r["--jpanel-group-span"] = p(O ?? e["data-group-span"]), r["--jpanel-group-align"] = Q ?? e["data-group-align"], r["--jpanel-group-justify"] = X ?? e["data-group-justify"], r["--jpanel-spring-left"] = p(Y ?? e["data-spring-left"]), r["--jpanel-spring-right"] = p(Z ?? e["data-spring-right"]), r["--jpanel-spring-top"] = p(v ?? e["data-spring-top"]), r["--jpanel-spring-bottom"] = p(aa ?? e["data-spring-bottom"]), r["--jpanel-spring-width"] = p(ta ?? e["data-spring-width"]), r["--jpanel-spring-height"] = p(na ?? e["data-spring-height"]);
    const ia = ka(J, A, h);
    return /* @__PURE__ */ da(
      oa,
      {
        ref: pa,
        className: ua(
          "jpanel",
          ma[t],
          ja[a],
          fa[i],
          ea
        ),
        style: r,
        "data-jpanel-layout": l.layout,
        "data-jpanel-mobile-small-layout": l.layout,
        "data-jpanel-mobile-large-layout": j.layout,
        "data-jpanel-tablet-layout": f.layout,
        "data-jpanel-desktop-layout": b.layout,
        "data-jpanel-tv-layout": y.layout,
        "data-jpanel-placement": w(l.layout, l.placement),
        "data-jpanel-mobile-small-placement": w(l.layout, l.placement),
        "data-jpanel-mobile-large-placement": w(j.layout, j.placement),
        "data-jpanel-tablet-placement": w(f.layout, f.placement),
        "data-jpanel-desktop-placement": w(b.layout, b.placement),
        "data-jpanel-tv-placement": w(y.layout, y.placement),
        "data-jpanel-dense": l.dense ? "true" : "false",
        "data-jpanel-mobile-small-dense": l.dense ? "true" : "false",
        "data-jpanel-mobile-large-dense": j.dense ? "true" : "false",
        "data-jpanel-tablet-dense": f.dense ? "true" : "false",
        "data-jpanel-desktop-dense": b.dense ? "true" : "false",
        "data-jpanel-tv-dense": y.dense ? "true" : "false",
        "data-jpanel-mode": l.mode ?? "sequential",
        "data-jpanel-mobile-small-mode": l.mode ?? "sequential",
        "data-jpanel-mobile-large-mode": j.mode ?? "sequential",
        "data-jpanel-tablet-mode": f.mode ?? "sequential",
        "data-jpanel-desktop-mode": b.mode ?? "sequential",
        "data-jpanel-tv-mode": y.mode ?? "sequential",
        "data-panel-area": ga,
        "data-panel-card": la,
        ...e,
        children: ia
      }
    );
  }
);
Ja.displayName = "JPanelView";
export {
  Ja as JPanelView
};
//# sourceMappingURL=JPanelView.js.map
