import { jsx as I } from "react/jsx-runtime";
import { useState as s, useRef as w, useEffect as O } from "react";
import { COMBOBOX_MOLECULE_DEFAULTS as R } from "./InterComboboxMolecule.js";
import { ComboboxMoleculeView as T } from "./ComboboxMoleculeView.js";
const V = (t) => {
  const c = { ...R, ...t }, [x, b] = s(void 0), k = t.value ?? x, [l, v] = s(!1), [h, f] = s(""), [m, a] = s(0), [D, M] = s({}), r = w(null), y = w(null), L = w(null), S = t.options.find((e) => e.value === k) ?? null, u = t.options.filter(
    (e) => e.label.toLowerCase().includes(h.toLowerCase())
  ), i = () => {
    if (!r.current) return;
    const e = r.current.getBoundingClientRect();
    M({ position: "fixed", top: e.bottom + 4, left: e.left, width: e.width, zIndex: 50 });
  }, g = () => {
    i(), v(!0), f(""), a(0), setTimeout(() => {
      var e;
      return (e = y.current) == null ? void 0 : e.focus();
    }, 0);
  }, d = () => {
    v(!1), f("");
  }, C = (e) => {
    var n;
    e.disabled || (b(e.value), (n = t.onChange) == null || n.call(t, e.value, e), d());
  }, A = (e) => {
    var n;
    if (!l) {
      (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && (e.preventDefault(), g());
      return;
    }
    e.key === "Escape" ? (d(), (n = r.current) == null || n.focus()) : e.key === "ArrowDown" ? (e.preventDefault(), a((o) => Math.min(o + 1, u.length - 1))) : e.key === "ArrowUp" ? (e.preventDefault(), a((o) => Math.max(o - 1, 0))) : e.key === "Enter" && u[m] && (e.preventDefault(), C(u[m]));
  };
  return O(() => {
    if (!l) return;
    const e = (n) => {
      var o, E;
      !((o = r.current) != null && o.contains(n.target)) && !((E = L.current) != null && E.contains(n.target)) && d();
    };
    return document.addEventListener("mousedown", e), window.addEventListener("resize", i), window.addEventListener("scroll", i, !0), () => {
      document.removeEventListener("mousedown", e), window.removeEventListener("resize", i), window.removeEventListener("scroll", i, !0);
    };
  }, [l]), /* @__PURE__ */ I(
    T,
    {
      selected: S,
      query: h,
      filtered: u,
      open: l,
      disabled: c.disabled,
      placeholder: c.placeholder,
      searchPlaceholder: c.searchPlaceholder,
      emptyText: c.emptyText,
      className: t.className,
      listStyle: D,
      triggerRef: r,
      inputRef: y,
      listRef: L,
      activeIndex: m,
      onTriggerClick: () => l ? d() : g(),
      onQueryChange: (e) => {
        var n;
        f(e), a(0), (n = t.onSearchChange) == null || n.call(t, e);
      },
      onSelect: C,
      onKeyDown: A
    }
  );
};
V.displayName = "ComboboxMolecule";
export {
  V as ComboboxMoleculeImpl
};
//# sourceMappingURL=ComboboxMoleculeImpl.js.map
