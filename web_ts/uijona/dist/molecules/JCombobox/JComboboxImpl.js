import { jsx as O } from "react/jsx-runtime";
import { useState as s, useRef as w, useEffect as R } from "react";
import { JCOMBOBOX_MOLECULE_DEFAULTS as T } from "./InterJCombobox.js";
import { JComboboxView as J } from "./JComboboxView.js";
const M = (t) => {
  const c = { ...T, ...t }, [x, b] = s(void 0), k = t.value ?? x, [r, v] = s(!1), [h, f] = s(""), [m, a] = s(0), [D, S] = s({}), l = w(null), y = w(null), L = w(null), A = t.options.find((e) => e.value === k) ?? null, u = t.options.filter(
    (e) => e.label.toLowerCase().includes(h.toLowerCase())
  ), i = () => {
    if (!l.current) return;
    const e = l.current.getBoundingClientRect();
    S({ position: "fixed", top: e.bottom + 4, left: e.left, width: e.width, zIndex: 50 });
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
  }, I = (e) => {
    var n;
    if (!r) {
      (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") && (e.preventDefault(), g());
      return;
    }
    e.key === "Escape" ? (d(), (n = l.current) == null || n.focus()) : e.key === "ArrowDown" ? (e.preventDefault(), a((o) => Math.min(o + 1, u.length - 1))) : e.key === "ArrowUp" ? (e.preventDefault(), a((o) => Math.max(o - 1, 0))) : e.key === "Enter" && u[m] && (e.preventDefault(), C(u[m]));
  };
  return R(() => {
    if (!r) return;
    const e = (n) => {
      var o, E;
      !((o = l.current) != null && o.contains(n.target)) && !((E = L.current) != null && E.contains(n.target)) && d();
    };
    return document.addEventListener("mousedown", e), window.addEventListener("resize", i), window.addEventListener("scroll", i, !0), () => {
      document.removeEventListener("mousedown", e), window.removeEventListener("resize", i), window.removeEventListener("scroll", i, !0);
    };
  }, [r]), /* @__PURE__ */ O(
    J,
    {
      selected: A,
      query: h,
      filtered: u,
      open: r,
      disabled: c.disabled,
      placeholder: c.placeholder,
      searchPlaceholder: c.searchPlaceholder,
      emptyText: c.emptyText,
      className: t.className,
      listStyle: D,
      triggerRef: l,
      inputRef: y,
      listRef: L,
      activeIndex: m,
      onTriggerClick: () => r ? d() : g(),
      onQueryChange: (e) => {
        var n;
        f(e), a(0), (n = t.onSearchChange) == null || n.call(t, e);
      },
      onSelect: C,
      onKeyDown: I
    }
  );
};
M.displayName = "JCombobox";
export {
  M as JComboboxImpl
};
//# sourceMappingURL=JComboboxImpl.js.map
