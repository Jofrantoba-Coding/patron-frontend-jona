import { jsx as R } from "react/jsx-runtime";
import { useState as m, useRef as M, useEffect as Y } from "react";
import { DATE_PICKER_MOLECULE_DEFAULTS as F } from "./InterDatePickerMolecule.js";
import { DatePickerMoleculeView as O } from "./DatePickerMoleculeView.js";
function h(t) {
  if (!t) return null;
  const [i, n, s] = t.split("-").map(Number);
  return new Date(i, n - 1, s);
}
function z(t) {
  const i = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), s = String(t.getDate()).padStart(2, "0");
  return `${i}-${n}-${s}`;
}
function T(t) {
  return t.toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}
const W = (t) => {
  const i = { ...F, ...t }, n = /* @__PURE__ */ new Date();
  n.setHours(0, 0, 0, 0);
  const [s, L] = m(void 0), p = t.value ?? s, c = h(p), y = c ?? n, [f, E] = m(!1), [x, w] = m(y.getFullYear()), [g, l] = m(y.getMonth()), [k, C] = m({}), d = M(null), D = M(null), P = h(t.min), V = h(t.max), I = c ? T(c) : "", u = () => {
    if (!d.current) return;
    const e = d.current.getBoundingClientRect(), r = window.innerWidth, a = Math.min(e.left, r - 288 - 8);
    C({ position: "fixed", top: e.bottom + 4, left: Math.max(8, a), zIndex: 50 });
  }, b = () => {
    u();
    const e = c ?? n;
    w(e.getFullYear()), l(e.getMonth()), E(!0);
  }, v = () => E(!1), N = (e) => {
    var o;
    const r = z(e);
    L(r), (o = t.onChange) == null || o.call(t, r), v();
  };
  return Y(() => {
    if (!f) return;
    const e = (o) => {
      var a;
      o.key === "Escape" && (v(), (a = d.current) == null || a.focus());
    }, r = (o) => {
      var a, S;
      !((a = d.current) != null && a.contains(o.target)) && !((S = D.current) != null && S.contains(o.target)) && v();
    };
    return document.addEventListener("keydown", e), document.addEventListener("mousedown", r), window.addEventListener("resize", u), window.addEventListener("scroll", u, !0), () => {
      document.removeEventListener("keydown", e), document.removeEventListener("mousedown", r), window.removeEventListener("resize", u), window.removeEventListener("scroll", u, !0);
    };
  }, [f]), /* @__PURE__ */ R(
    O,
    {
      displayValue: I,
      open: f,
      viewYear: x,
      viewMonth: g,
      selectedDate: c,
      today: n,
      min: P ?? void 0,
      max: V ?? void 0,
      disabled: i.disabled,
      placeholder: i.placeholder,
      className: t.className,
      panelStyle: k,
      triggerRef: d,
      panelRef: D,
      onTriggerClick: () => f ? v() : b(),
      onPrevMonth: () => {
        g === 0 ? (l(11), w((e) => e - 1)) : l((e) => e - 1);
      },
      onNextMonth: () => {
        g === 11 ? (l(0), w((e) => e + 1)) : l((e) => e + 1);
      },
      onSelectDay: N
    }
  );
};
W.displayName = "DatePickerMolecule";
export {
  W as DatePickerMoleculeImpl
};
//# sourceMappingURL=DatePickerMoleculeImpl.js.map
