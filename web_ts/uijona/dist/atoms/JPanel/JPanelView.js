import { jsx as ma } from "react/jsx-runtime";
import u from "react";
import { cn as fa } from "../../lib/cn.js";
import { JPANEL_DEFAULTS as c } from "./InterJPanel.js";
const ja = {
  default: "bg-white border border-neutral-200",
  outlined: "bg-transparent border border-neutral-300",
  elevated: "bg-white shadow-md border-0",
  flat: "bg-neutral-50 border-0",
  ghost: "bg-transparent border-0"
}, ba = {
  none: "p-0",
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
}, ca = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
}, ya = {
  none: "0",
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem"
}, wa = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline"
}, Ca = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly"
}, Sa = {
  row: "row",
  column: "column"
}, Va = {
  nowrap: "nowrap",
  wrap: "wrap",
  reverse: "wrap-reverse"
}, xa = /* @__PURE__ */ new Set(["grid", "gridbag", "group", "spring"]), Ea = (t) => typeof t == "string" ? t.trim() ? t : "div" : t ?? "div", Pa = (t, a) => typeof t == "boolean" ? t ? "wrap" : "nowrap" : t ?? a, $ = (t) => typeof t == "number" ? `repeat(${t}, minmax(0, 1fr))` : t, p = (t) => t === void 0 ? void 0 : String(t), C = (t, a) => xa.has(t) ? a ?? "responsive" : a, S = (t, a) => ({
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
}), V = (t, a, i) => {
  const m = i ? `--jpanel-${i}` : "--jpanel", s = (o, d) => {
    t[`${m}-${o}`] = d;
  }, n = a.layout === "flow" ? "wrap" : a.direction === "column" ? "nowrap" : "wrap", l = C(a.layout, a.placement);
  s("gap", ya[a.gap]), s("direction", Sa[a.direction]), s("wrap", Va[Pa(a.wrap, n)]), s("align-items", wa[a.alignItems]), s("justify-content", Ca[a.justifyContent]), s("columns", $(a.columns)), s("rows", $(a.rows)), s("auto-fit-min", a.autoFitMin ?? "12rem"), s("spring-min-height", a.minHeight ?? "16rem"), s("placement", l);
}, F = (t) => {
  const a = t.props.card ?? t.props["data-panel-card"];
  if (a !== void 0) return String(a);
  if (t.key !== null) return String(t.key);
}, Ja = (t) => t.props.area ?? t.props["data-panel-area"], ka = (t) => [
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
].some((a) => a !== void 0), y = (t, a) => t.has(a), ha = (t, a, i) => {
  const m = [];
  if (y(a, "border") && u.Children.forEach(t, (s, n) => {
    u.isValidElement(s) && !Ja(s) && m.push(
      `[JPanel] layout="border" necesita que el hijo #${n + 1} defina area="top|right|bottom|left|center" o data-panel-area.`
    );
  }), y(a, "card") && i !== void 0) {
    let s = !1;
    u.Children.forEach(t, (n) => {
      u.isValidElement(n) && F(n) === String(i) && (s = !0);
    }), s || m.push(
      `[JPanel] layout="card" recibio activeCard="${String(i)}", pero ningun hijo define card, data-panel-card o key con ese valor.`
    );
  }
  return y(a, "spring") && u.Children.forEach(t, (s, n) => {
    u.isValidElement(s) && !ka(s) && m.push(
      `[JPanel] layout="spring" necesita que el hijo #${n + 1} defina al menos una constraint springLeft/right/top/bottom/width/height o data-spring-*.`
    );
  }), m;
}, Aa = (t) => {
  t.length === 0 || typeof console > "u" || typeof console.log != "function" || t.forEach((a) => console.log(a));
}, qa = (t, a, i) => {
  if (!["border", "card", "gridbag", "group", "spring"].some((n) => a.has(n))) return t;
  let s = !1;
  return u.Children.map(t, (n) => {
    if (!u.isValidElement(n)) return n;
    const l = {}, o = { ...n.props.style };
    if (y(a, "border")) {
      const d = n.props.area ?? n.props["data-panel-area"];
      d && (l["data-panel-area"] = d, o.gridArea = d);
    }
    if (y(a, "gridbag") && (l["data-jpanel-gridbag-item"] = "", l["data-jona-gridbag-item"] = "", o["--jpanel-gridbag-column"] = p(n.props.gridBagColumn ?? n.props["data-gridbag-column"] ?? n.props["data-gridbag-col"]), o["--jpanel-gridbag-row"] = p(n.props.gridBagRow ?? n.props["data-gridbag-row"]), o["--jpanel-gridbag-column-span"] = p(n.props.gridBagColumnSpan ?? n.props["data-gridbag-column-span"] ?? n.props["data-gridbag-colspan"]), o["--jpanel-gridbag-row-span"] = p(n.props.gridBagRowSpan ?? n.props["data-gridbag-row-span"] ?? n.props["data-gridbag-rowspan"]), o["--jpanel-gridbag-align"] = n.props.gridBagAlign ?? n.props["data-gridbag-align"], o["--jpanel-gridbag-justify"] = n.props.gridBagJustify ?? n.props["data-gridbag-justify"]), y(a, "group") && (l["data-jpanel-group-item"] = "", l["data-jona-group-item"] = "", o["--jpanel-group-span"] = p(n.props.groupSpan ?? n.props["data-group-span"]), o["--jpanel-group-align"] = n.props.groupAlign ?? n.props["data-group-align"], o["--jpanel-group-justify"] = n.props.groupJustify ?? n.props["data-group-justify"]), y(a, "spring") && (l["data-jpanel-spring-item"] = "", l["data-jona-spring-item"] = "", o["--jpanel-spring-left"] = p(n.props.springLeft ?? n.props["data-spring-left"]), o["--jpanel-spring-right"] = p(n.props.springRight ?? n.props["data-spring-right"]), o["--jpanel-spring-top"] = p(n.props.springTop ?? n.props["data-spring-top"]), o["--jpanel-spring-bottom"] = p(n.props.springBottom ?? n.props["data-spring-bottom"]), o["--jpanel-spring-width"] = p(n.props.springWidth ?? n.props["data-spring-width"]), o["--jpanel-spring-height"] = p(n.props.springHeight ?? n.props["data-spring-height"])), y(a, "card")) {
      const d = F(n), x = i === void 0 ? !s : d === String(i);
      s = s || x, l["data-jpanel-card-state"] = x ? "active" : "hidden", d !== void 0 && (l["data-panel-card"] = d);
    }
    return u.cloneElement(n, {
      ...l,
      style: o
    });
  });
}, La = u.forwardRef(
  ({
    variant: t = c.variant,
    padding: a = c.padding,
    radius: i = c.radius,
    as: m,
    layout: s = c.layout,
    direction: n = c.direction,
    gap: l = c.gap,
    alignItems: o = c.alignItems,
    justifyContent: d = c.justifyContent,
    wrap: x,
    columns: H,
    rows: I,
    autoFitMin: M,
    placement: T,
    dense: B,
    mode: R,
    minHeight: D,
    activeCard: E,
    mobileSmall: K,
    mobileLarge: N,
    tablet: W,
    desktop: U,
    tv: _,
    area: z,
    card: G,
    gridBagColumn: P,
    gridBagRow: J,
    gridBagColumnSpan: k,
    gridBagRowSpan: h,
    gridBagAlign: O,
    gridBagJustify: Q,
    groupSpan: X,
    groupAlign: Y,
    groupJustify: Z,
    springLeft: v,
    springRight: aa,
    springTop: ta,
    springBottom: na,
    springWidth: ea,
    springHeight: sa,
    className: pa,
    children: A,
    style: oa,
    ...e
  }, ra) => {
    const la = Ea(m), g = S({
      layout: s,
      direction: n,
      gap: l,
      alignItems: o,
      justifyContent: d,
      wrap: x,
      columns: H,
      rows: I,
      autoFitMin: M,
      placement: T,
      dense: B,
      mode: R,
      minHeight: D
    }, K), f = S(g, N), j = S(f, W), b = S(j, U), w = S(b, _), q = /* @__PURE__ */ new Set([
      g.layout,
      f.layout,
      j.layout,
      b.layout,
      w.layout
    ]), r = { ...oa };
    V(r, g, ""), V(r, f, "mobile-large"), V(r, j, "tablet"), V(r, b, "desktop"), V(r, w, "tv");
    const L = ha(A, q, E), ga = L.join(`
`);
    u.useEffect(() => {
      Aa(L);
    }, [ga]);
    const ia = z ?? e["data-panel-area"], da = G ?? e["data-panel-card"];
    (P ?? e["data-gridbag-column"] ?? e["data-gridbag-col"]) && (r["--jpanel-gridbag-column"] = p(P ?? e["data-gridbag-column"] ?? e["data-gridbag-col"])), (J ?? e["data-gridbag-row"]) && (r["--jpanel-gridbag-row"] = p(J ?? e["data-gridbag-row"])), (k ?? e["data-gridbag-column-span"] ?? e["data-gridbag-colspan"]) && (r["--jpanel-gridbag-column-span"] = p(k ?? e["data-gridbag-column-span"] ?? e["data-gridbag-colspan"])), (h ?? e["data-gridbag-row-span"] ?? e["data-gridbag-rowspan"]) && (r["--jpanel-gridbag-row-span"] = p(h ?? e["data-gridbag-row-span"] ?? e["data-gridbag-rowspan"])), r["--jpanel-gridbag-align"] = O ?? e["data-gridbag-align"], r["--jpanel-gridbag-justify"] = Q ?? e["data-gridbag-justify"], r["--jpanel-group-span"] = p(X ?? e["data-group-span"]), r["--jpanel-group-align"] = Y ?? e["data-group-align"], r["--jpanel-group-justify"] = Z ?? e["data-group-justify"], r["--jpanel-spring-left"] = p(v ?? e["data-spring-left"]), r["--jpanel-spring-right"] = p(aa ?? e["data-spring-right"]), r["--jpanel-spring-top"] = p(ta ?? e["data-spring-top"]), r["--jpanel-spring-bottom"] = p(na ?? e["data-spring-bottom"]), r["--jpanel-spring-width"] = p(ea ?? e["data-spring-width"]), r["--jpanel-spring-height"] = p(sa ?? e["data-spring-height"]);
    const ua = qa(A, q, E);
    return /* @__PURE__ */ ma(
      la,
      {
        ref: ra,
        className: fa(
          "jpanel",
          ja[t],
          ba[a],
          ca[i],
          pa
        ),
        style: r,
        "data-jpanel-layout": g.layout,
        "data-jpanel-mobile-small-layout": g.layout,
        "data-jpanel-mobile-large-layout": f.layout,
        "data-jpanel-tablet-layout": j.layout,
        "data-jpanel-desktop-layout": b.layout,
        "data-jpanel-tv-layout": w.layout,
        "data-jpanel-placement": C(g.layout, g.placement),
        "data-jpanel-mobile-small-placement": C(g.layout, g.placement),
        "data-jpanel-mobile-large-placement": C(f.layout, f.placement),
        "data-jpanel-tablet-placement": C(j.layout, j.placement),
        "data-jpanel-desktop-placement": C(b.layout, b.placement),
        "data-jpanel-tv-placement": C(w.layout, w.placement),
        "data-jpanel-dense": g.dense === !1 ? "false" : "true",
        "data-jpanel-mobile-small-dense": g.dense === !1 ? "false" : "true",
        "data-jpanel-mobile-large-dense": f.dense === !1 ? "false" : "true",
        "data-jpanel-tablet-dense": j.dense === !1 ? "false" : "true",
        "data-jpanel-desktop-dense": b.dense === !1 ? "false" : "true",
        "data-jpanel-tv-dense": w.dense === !1 ? "false" : "true",
        "data-jpanel-mode": g.mode ?? "sequential",
        "data-jpanel-mobile-small-mode": g.mode ?? "sequential",
        "data-jpanel-mobile-large-mode": f.mode ?? "sequential",
        "data-jpanel-tablet-mode": j.mode ?? "sequential",
        "data-jpanel-desktop-mode": b.mode ?? "sequential",
        "data-jpanel-tv-mode": w.mode ?? "sequential",
        "data-panel-area": ia,
        "data-panel-card": da,
        ...e,
        children: ua
      }
    );
  }
);
La.displayName = "JPanelView";
export {
  La as JPanelView
};
//# sourceMappingURL=JPanelView.js.map
