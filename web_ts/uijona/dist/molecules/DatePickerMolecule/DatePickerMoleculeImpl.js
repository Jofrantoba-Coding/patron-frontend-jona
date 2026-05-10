import { jsx as ne } from "react/jsx-runtime";
import { useState as v, useEffect as Y, useMemo as te, useRef as L } from "react";
import { DATE_PICKER_MOLECULE_DEFAULTS as oe } from "./InterDatePickerMolecule.js";
import { DatePickerMoleculeView as ie } from "./DatePickerMoleculeView.js";
const Z = {
  yyyy: { pattern: "(\\d{4})", length: 4 },
  MM: { pattern: "(\\d{2})", length: 2 },
  dd: { pattern: "(\\d{2})", length: 2 },
  HH: { pattern: "(\\d{2})", length: 2 },
  mm: { pattern: "(\\d{2})", length: 2 },
  ss: { pattern: "(\\d{2})", length: 2 },
  XXX: { pattern: "([+-]\\d{2}:?\\d{2}|Z)" },
  z: { pattern: "(.+)" }
}, re = ["yyyy", "XXX", "MM", "dd", "HH", "mm", "ss", "z"];
function b(e) {
  const t = [];
  let n = 0;
  for (; n < e.length; ) {
    const o = re.find((m) => e.startsWith(m, n));
    if (o) {
      t.push({ type: "token", value: o }), n += o.length;
      continue;
    }
    t.push({ type: "literal", value: e[n] }), n += 1;
  }
  return t;
}
function ue(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function H(e, t, n) {
  if (!e) return null;
  const o = [], m = b(t).map((r) => r.type === "literal" ? ue(r.value) : (o.push(r.value), Z[r.value].pattern)).join(""), y = new RegExp(`^${m}$`).exec(e.trim());
  if (!y) return ce(e, n);
  const c = {
    year: 0,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timezone: n
  };
  return o.forEach((r, h) => {
    const d = y[h + 1];
    r === "yyyy" && (c.year = Number(d)), r === "MM" && (c.month = Number(d)), r === "dd" && (c.day = Number(d)), r === "HH" && (c.hour = Number(d)), r === "mm" && (c.minute = Number(d)), r === "ss" && (c.second = Number(d)), (r === "z" || r === "XXX") && (c.timezone = d);
  }), K(c) ? c : null;
}
function ce(e, t) {
  const n = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?(?:\s*(Z|[+-]\d{2}:?\d{2}|[A-Za-z][\w/+-]+))?$/.exec(e.trim());
  if (!n) return null;
  const o = {
    year: Number(n[1]),
    month: Number(n[2]),
    day: Number(n[3]),
    hour: Number(n[4] ?? 0),
    minute: Number(n[5] ?? 0),
    second: Number(n[6] ?? 0),
    timezone: n[7] ?? t
  };
  return K(o) ? o : null;
}
function K(e) {
  if (e.month < 1 || e.month > 12 || e.day < 1 || e.day > 31 || e.hour < 0 || e.hour > 23 || e.minute < 0 || e.minute > 59 || e.second < 0 || e.second > 59) return !1;
  const t = new Date(e.year, e.month - 1, e.day);
  return t.getFullYear() === e.year && t.getMonth() === e.month - 1 && t.getDate() === e.day;
}
function R(e) {
  return e ? new Date(e.year, e.month - 1, e.day) : null;
}
function C(e, t, n) {
  return {
    year: e.getFullYear(),
    month: e.getMonth() + 1,
    day: e.getDate(),
    hour: (t == null ? void 0 : t.hour) ?? 0,
    minute: (t == null ? void 0 : t.minute) ?? 0,
    second: (t == null ? void 0 : t.second) ?? 0,
    timezone: (t == null ? void 0 : t.timezone) ?? n
  };
}
function f(e, t = 2) {
  return String(e).padStart(t, "0");
}
function le(e, t) {
  return b(t).map((n) => n.type === "literal" ? n.value : n.value === "yyyy" ? f(e.year, 4) : n.value === "MM" ? f(e.month) : n.value === "dd" ? f(e.day) : n.value === "HH" ? f(e.hour) : n.value === "mm" ? f(e.minute) : n.value === "ss" ? f(e.second) : e.timezone ?? "").join("").trim();
}
function ae(e, t, n) {
  const o = `${f(e.year, 4)}-${f(e.month)}-${f(e.day)}`;
  if (!t) return o;
  const m = `${f(e.hour)}:${f(e.minute)}${n ? `:${f(e.second)}` : ""}`, y = e.timezone && /^(Z|[+-]\d{2}:?\d{2})$/.test(e.timezone) ? e.timezone : "";
  return `${o}T${m}${y}`;
}
function se(e, t, n, o, m) {
  return n === "iso" ? ae(e, o, m) : le(e, t);
}
function me(e, t) {
  var d, D;
  const n = b(t), o = n.findIndex((l) => l.type === "token" && (l.value === "z" || l.value === "XXX")), m = o >= 0 ? n.slice(0, o) : n, y = m.reduce((l, a) => a.type !== "token" ? l : l + (Z[a.value].length ?? 0), 0), c = e.replace(/\D/g, "").slice(0, y);
  let r = 0, h = "";
  for (const l of m) {
    if (l.type === "literal") {
      r > 0 && r < c.length && (h += l.value);
      continue;
    }
    const a = Z[l.value].length;
    if (!a) continue;
    const g = c.slice(r, r + a);
    if (!g || (h += g, r += g.length, g.length < a)) break;
  }
  if (o >= 0 && c.length >= y && e.length > h.length) {
    const l = (d = /[A-Za-z].*$/.exec(e)) == null ? void 0 : d[0], a = (D = /(?:^|[\sT])([+-]\d{0,2}:?\d{0,2}|Z)$/.exec(e)) == null ? void 0 : D[1], g = (l ?? a ?? e.slice(h.length).replace(/^[^A-Za-zZ+-]+/, "")).trim();
    if (g) return `${h} ${g}`;
  }
  return h;
}
function de(e, t, n) {
  const o = Number(e);
  return Number.isNaN(o) ? t : Math.min(n, Math.max(t, o));
}
const fe = (e) => {
  var W;
  const t = { ...oe, ...e }, n = /* @__PURE__ */ new Date();
  n.setHours(0, 0, 0, 0);
  const o = t.mask, m = /HH|mm|ss/.test(o), y = o.includes("ss"), c = /XXX|z/.test(o), r = t.showTime || m, h = t.showSeconds || y, d = c || !!((W = e.timezoneOptions) != null && W.length), [D, l] = v(""), a = e.value ?? D, [g, I] = v(a);
  Y(() => {
    I(a);
  }, [a]);
  const w = te(
    () => H(a, o, e.timezone),
    [a, o, e.timezone]
  ), M = R(w), F = M ?? n, [E, O] = v(!1), [_, S] = v(F.getFullYear()), [X, x] = v(F.getMonth()), [j, U] = v({}), T = L(null), A = L(null), P = L(null), q = R(H(e.min, o, e.timezone)), B = R(H(e.max, o, e.timezone)), V = (i) => {
    var s;
    const u = se(i, o, t.valueFormat, r, h);
    l(u), I(u), (s = e.onChange) == null || s.call(e, u);
  }, N = () => {
    if (!T.current) return;
    const i = T.current.getBoundingClientRect(), u = window.innerWidth, z = Math.min(i.left, u - 320 - 8);
    U({ position: "fixed", top: i.bottom + 4, left: Math.max(8, z), zIndex: 50 });
  }, G = () => {
    N();
    const i = M ?? n;
    S(i.getFullYear()), x(i.getMonth()), O(!0);
  }, $ = () => O(!1), J = (i) => {
    var s;
    const u = t.autoApplyMask ? me(i, o) : i;
    l(u), I(u), (s = e.onChange) == null || s.call(e, u);
  }, Q = (i) => {
    var u;
    V(C(i, w, e.timezone)), $(), (u = P.current) == null || u.focus();
  }, p = (i, u) => {
    const z = w ?? C(M ?? n, null, e.timezone), k = i === "hour" ? 23 : 59;
    V({ ...z, [i]: de(u, 0, k) });
  }, ee = (i) => {
    const s = w ?? C(M ?? n, null, e.timezone);
    V({ ...s, timezone: i });
  };
  return Y(() => {
    if (!E) return;
    const i = (s) => {
      var z;
      s.key === "Escape" && ($(), (z = P.current) == null || z.focus());
    }, u = (s) => {
      var z, k;
      !((z = T.current) != null && z.contains(s.target)) && !((k = A.current) != null && k.contains(s.target)) && $();
    };
    return document.addEventListener("keydown", i), document.addEventListener("mousedown", u), window.addEventListener("resize", N), window.addEventListener("scroll", N, !0), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("mousedown", u), window.removeEventListener("resize", N), window.removeEventListener("scroll", N, !0);
    };
  }, [E]), /* @__PURE__ */ ne(
    ie,
    {
      inputValue: g,
      open: E,
      viewYear: _,
      viewMonth: X,
      selectedDate: M,
      today: n,
      min: q ?? void 0,
      max: B ?? void 0,
      disabled: t.disabled,
      placeholder: t.placeholder,
      mask: o,
      showTime: r,
      showSeconds: h,
      showTimezone: d,
      timezoneOptions: e.timezoneOptions,
      timeParts: w ?? C(M ?? n, null, e.timezone),
      className: e.className,
      panelStyle: j,
      triggerRef: T,
      panelRef: A,
      inputRef: P,
      onInputChange: J,
      onTriggerClick: () => E ? $() : G(),
      onPrevMonth: () => {
        X === 0 ? (x(11), S((i) => i - 1)) : x((i) => i - 1);
      },
      onNextMonth: () => {
        X === 11 ? (x(0), S((i) => i + 1)) : x((i) => i + 1);
      },
      onSelectDay: Q,
      onTimeChange: p,
      onTimezoneChange: ee
    }
  );
};
fe.displayName = "DatePickerMolecule";
export {
  fe as DatePickerMoleculeImpl
};
//# sourceMappingURL=DatePickerMoleculeImpl.js.map
