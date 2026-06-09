import { jsx as ne } from "react/jsx-runtime";
import { useState as w, useEffect as J, useMemo as oe, useRef as H } from "react";
import { JDATEPICKER_DEFAULTS as ie } from "./InterJDatePicker.js";
import { JDatePickerView as re } from "./JDatePickerView.js";
function ue() {
  try {
    return Intl.supportedValuesOf("timeZone");
  } catch {
    return [];
  }
}
const ce = ue(), O = {
  yyyy: { pattern: "(\\d{4})", length: 4 },
  MM: { pattern: "(\\d{2})", length: 2 },
  dd: { pattern: "(\\d{2})", length: 2 },
  HH: { pattern: "(\\d{2})", length: 2 },
  mm: { pattern: "(\\d{2})", length: 2 },
  ss: { pattern: "(\\d{2})", length: 2 },
  XXX: { pattern: "([+-]\\d{2}:?\\d{2}|Z)" },
  z: { pattern: "(.+)" }
}, ae = ["yyyy", "XXX", "MM", "dd", "HH", "mm", "ss", "z"];
function A(e) {
  const n = [];
  let t = 0;
  for (; t < e.length; ) {
    const o = ae.find((m) => e.startsWith(m, t));
    if (o) {
      n.push({ type: "token", value: o }), t += o.length;
      continue;
    }
    n.push({ type: "literal", value: e[t] }), t += 1;
  }
  return n;
}
function se(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function P(e, n, t) {
  if (!e) return null;
  const o = [], m = A(n).map((r) => r.type === "literal" ? se(r.value) : (o.push(r.value), O[r.value].pattern)).join(""), g = new RegExp(`^${m}$`).exec(e.trim());
  if (!g) return le(e, t);
  const c = { year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0, timezone: t };
  return o.forEach((r, f) => {
    const l = g[f + 1];
    r === "yyyy" && (c.year = Number(l)), r === "MM" && (c.month = Number(l)), r === "dd" && (c.day = Number(l)), r === "HH" && (c.hour = Number(l)), r === "mm" && (c.minute = Number(l)), r === "ss" && (c.second = Number(l)), (r === "z" || r === "XXX") && (c.timezone = l);
  }), K(c) ? c : null;
}
function le(e, n) {
  const t = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?(?:\s*(Z|[+-]\d{2}:?\d{2}|[A-Za-z][\w/+-]+))?$/.exec(e.trim());
  if (!t) return null;
  const o = {
    year: Number(t[1]),
    month: Number(t[2]),
    day: Number(t[3]),
    hour: Number(t[4] ?? 0),
    minute: Number(t[5] ?? 0),
    second: Number(t[6] ?? 0),
    timezone: t[7] ?? n
  };
  return K(o) ? o : null;
}
function K(e) {
  if (e.month < 1 || e.month > 12 || e.day < 1 || e.day > 31 || e.hour < 0 || e.hour > 23 || e.minute < 0 || e.minute > 59 || e.second < 0 || e.second > 59) return !1;
  const n = new Date(e.year, e.month - 1, e.day);
  return n.getFullYear() === e.year && n.getMonth() === e.month - 1 && n.getDate() === e.day;
}
function Z(e) {
  return e ? new Date(e.year, e.month - 1, e.day) : null;
}
function I(e, n, t) {
  return {
    year: e.getFullYear(),
    month: e.getMonth() + 1,
    day: e.getDate(),
    hour: (n == null ? void 0 : n.hour) ?? 0,
    minute: (n == null ? void 0 : n.minute) ?? 0,
    second: (n == null ? void 0 : n.second) ?? 0,
    timezone: (n == null ? void 0 : n.timezone) ?? t
  };
}
function d(e, n = 2) {
  return String(e).padStart(n, "0");
}
function me(e, n) {
  return A(n).map((t) => t.type === "literal" ? t.value : t.value === "yyyy" ? d(e.year, 4) : t.value === "MM" ? d(e.month) : t.value === "dd" ? d(e.day) : t.value === "HH" ? d(e.hour) : t.value === "mm" ? d(e.minute) : t.value === "ss" ? d(e.second) : e.timezone ?? "").join("").trim();
}
function de(e, n, t) {
  const o = `${d(e.year, 4)}-${d(e.month)}-${d(e.day)}`;
  if (!n) return o;
  const m = `${d(e.hour)}:${d(e.minute)}${t ? `:${d(e.second)}` : ""}`, g = e.timezone && /^(Z|[+-]\d{2}:?\d{2})$/.test(e.timezone) ? e.timezone : "";
  return `${o}T${m}${g}`;
}
function fe(e, n, t, o, m) {
  return t === "iso" ? de(e, o, m) : me(e, n);
}
function he(e, n) {
  var l, T;
  const t = A(n), o = t.findIndex((s) => s.type === "token" && (s.value === "z" || s.value === "XXX")), m = o >= 0 ? t.slice(0, o) : t, g = m.reduce((s, h) => h.type !== "token" ? s : s + (O[h.value].length ?? 0), 0), c = e.replace(/\D/g, "").slice(0, g);
  let r = 0, f = "";
  for (const s of m) {
    if (s.type === "literal") {
      r > 0 && r < c.length && (f += s.value);
      continue;
    }
    const h = O[s.value].length;
    if (!h) continue;
    const y = c.slice(r, r + h);
    if (!y || (f += y, r += y.length, y.length < h)) break;
  }
  if (o >= 0 && c.length >= g && e.length > f.length) {
    const s = (l = /[A-Za-z].*$/.exec(e)) == null ? void 0 : l[0], h = (T = /(?:^|[\sT])([+-]\d{0,2}:?\d{0,2}|Z)$/.exec(e)) == null ? void 0 : T[1], y = (s ?? h ?? e.slice(f.length).replace(/^[^A-Za-zZ+-]+/, "")).trim();
    if (y) return `${f} ${y}`;
  }
  return f;
}
function ye(e, n, t) {
  const o = Number(e);
  return Number.isNaN(o) ? n : Math.min(t, Math.max(n, o));
}
const ge = (e) => {
  var Y;
  const n = { ...ie, ...e }, t = /* @__PURE__ */ new Date();
  t.setHours(0, 0, 0, 0);
  const o = n.mask, m = /HH|mm|ss/.test(o), g = o.includes("ss"), c = /XXX|z/.test(o), r = n.showTime || m, f = n.showSeconds || g, l = c || !!((Y = e.timezoneOptions) != null && Y.length), T = e.timezoneOptions ?? (l ? ce : void 0), [s, h] = w(""), y = e.value ?? s, [S, k] = w(y);
  J(() => {
    k(y);
  }, [y]);
  const M = oe(
    () => P(S, o, e.timezone),
    [S, o, e.timezone]
  ), v = Z(M), R = v ?? t, [E, F] = w(!1), [j, C] = w(R.getFullYear()), [X, N] = w(R.getMonth()), [_, q] = w({}), $ = H(null), W = H(null), L = H(null), B = Z(P(e.min, o, e.timezone)), U = Z(P(e.max, o, e.timezone)), V = (i) => {
    var a;
    const u = fe(i, o, n.valueFormat, r, f);
    h(u), k(u), (a = e.onChange) == null || a.call(e, u);
  }, x = () => {
    if (!$.current) return;
    const i = $.current.getBoundingClientRect(), a = Math.min(i.left, window.innerWidth - 320 - 8);
    q({ position: "fixed", top: i.bottom + 4, left: Math.max(8, a), zIndex: 50 });
  }, G = () => {
    x();
    const i = v ?? t;
    C(i.getFullYear()), N(i.getMonth()), F(!0);
  }, D = () => F(!1), Q = (i) => {
    var a;
    const u = n.autoApplyMask ? he(i, o) : i;
    h(u), k(u), (a = e.onChange) == null || a.call(e, u);
  }, p = (i) => {
    var u;
    V(I(i, M, e.timezone)), D(), (u = L.current) == null || u.focus();
  }, ee = (i, u) => {
    const z = M ?? I(v ?? t, null, e.timezone);
    V({ ...z, [i]: ye(u, 0, i === "hour" ? 23 : 59) });
  }, te = (i) => {
    const a = M ?? I(v ?? t, null, e.timezone);
    V({ ...a, timezone: i });
  };
  return J(() => {
    if (!E) return;
    const i = (a) => {
      var z;
      a.key === "Escape" && (D(), (z = L.current) == null || z.focus());
    }, u = (a) => {
      var z, b;
      !((z = $.current) != null && z.contains(a.target)) && !((b = W.current) != null && b.contains(a.target)) && D();
    };
    return document.addEventListener("keydown", i), document.addEventListener("mousedown", u), window.addEventListener("resize", x), window.addEventListener("scroll", x, !0), () => {
      document.removeEventListener("keydown", i), document.removeEventListener("mousedown", u), window.removeEventListener("resize", x), window.removeEventListener("scroll", x, !0);
    };
  }, [E]), /* @__PURE__ */ ne(
    re,
    {
      inputValue: S,
      open: E,
      viewYear: j,
      viewMonth: X,
      selectedDate: v,
      today: t,
      min: B ?? void 0,
      max: U ?? void 0,
      disabled: n.disabled,
      placeholder: n.placeholder,
      mask: o,
      showTime: r,
      showSeconds: f,
      showTimezone: l,
      timezoneOptions: T,
      timeParts: M ?? I(v ?? t, null, e.timezone),
      className: e.className,
      panelStyle: _,
      triggerRef: $,
      panelRef: W,
      inputRef: L,
      onInputChange: Q,
      onTriggerClick: () => E ? D() : G(),
      onPrevMonth: () => {
        X === 0 ? (N(11), C((i) => i - 1)) : N((i) => i - 1);
      },
      onNextMonth: () => {
        X === 11 ? (N(0), C((i) => i + 1)) : N((i) => i + 1);
      },
      onSelectDay: p,
      onTimeChange: ee,
      onTimezoneChange: te
    }
  );
};
ge.displayName = "JDatePicker";
export {
  ge as JDatePickerImpl
};
//# sourceMappingURL=JDatePickerImpl.js.map
