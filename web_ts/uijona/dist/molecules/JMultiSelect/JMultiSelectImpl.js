import { jsx as M } from "react/jsx-runtime";
import { useState as d, useRef as v, useEffect as V } from "react";
import { JMULTI_SELECT_DEFAULTS as k } from "./InterJMultiSelect.js";
import { JMultiSelectView as z } from "./JMultiSelectView.js";
const D = (t) => {
  const i = { ...k, ...t }, [y, w] = d(i.value), c = t.value ?? y, [u, g] = d(!1), [h, f] = d(""), [E, S] = d({}), a = v(null), L = v(null), x = v(null), C = t.options.filter((e) => c.includes(e.value)), T = t.options.filter((e) => e.label.toLowerCase().includes(h.toLowerCase())), r = () => {
    if (!a.current) return;
    const e = a.current.getBoundingClientRect();
    S({ position: "fixed", top: e.bottom + 4, left: e.left, width: e.width, zIndex: 50 });
  }, R = () => {
    r(), g(!0), f(""), setTimeout(() => {
      var e;
      return (e = L.current) == null ? void 0 : e.focus();
    }, 0);
  }, m = () => {
    g(!1), f("");
  }, I = (e) => {
    var l;
    if (e.disabled) return;
    const n = c.includes(e.value) ? c.filter((o) => o !== e.value) : [...c, e.value], s = t.options.filter((o) => n.includes(o.value));
    w(n), (l = t.onChange) == null || l.call(t, n, s);
  }, b = (e) => {
    var l;
    const n = c.filter((o) => o !== e), s = t.options.filter((o) => n.includes(o.value));
    w(n), (l = t.onChange) == null || l.call(t, n, s);
  }, J = (e) => {
    e.key === "Escape" && m();
  };
  return V(() => {
    if (!u) return;
    const e = (n) => {
      var s, l;
      !((s = a.current) != null && s.contains(n.target)) && !((l = x.current) != null && l.contains(n.target)) && m();
    };
    return document.addEventListener("mousedown", e), window.addEventListener("resize", r), window.addEventListener("scroll", r, !0), () => {
      document.removeEventListener("mousedown", e), window.removeEventListener("resize", r), window.removeEventListener("scroll", r, !0);
    };
  }, [u]), /* @__PURE__ */ M(
    z,
    {
      selected: C,
      filtered: T,
      query: h,
      open: u,
      disabled: i.disabled,
      placeholder: i.placeholder,
      searchPlaceholder: i.searchPlaceholder,
      emptyText: i.emptyText,
      maxSelected: t.maxSelected,
      className: t.className,
      listStyle: E,
      triggerRef: a,
      inputRef: L,
      listRef: x,
      onTriggerClick: () => u ? m() : R(),
      onQueryChange: f,
      onToggle: I,
      onRemove: b,
      onInputKeyDown: J
    }
  );
};
D.displayName = "JMultiSelect";
export {
  D as JMultiSelectImpl
};
//# sourceMappingURL=JMultiSelectImpl.js.map
