import { jsx as O } from "react/jsx-runtime";
import { useState as d, useRef as v, useEffect as V } from "react";
import { MULTI_SELECT_MOLECULE_DEFAULTS as k } from "./InterMultiSelectMolecule.js";
import { MultiSelectMoleculeView as z } from "./MultiSelectMoleculeView.js";
const D = (t) => {
  const i = { ...k, ...t }, [x, w] = d(i.value), c = t.value ?? x, [u, g] = d(!1), [L, f] = d(""), [y, C] = d({}), a = v(null), h = v(null), E = v(null), S = t.options.filter((e) => c.includes(e.value)), T = t.options.filter((e) => e.label.toLowerCase().includes(L.toLowerCase())), r = () => {
    if (!a.current) return;
    const e = a.current.getBoundingClientRect();
    C({ position: "fixed", top: e.bottom + 4, left: e.left, width: e.width, zIndex: 50 });
  }, M = () => {
    r(), g(!0), f(""), setTimeout(() => {
      var e;
      return (e = h.current) == null ? void 0 : e.focus();
    }, 0);
  }, m = () => {
    g(!1), f("");
  }, R = (e) => {
    var l;
    if (e.disabled) return;
    const n = c.includes(e.value) ? c.filter((o) => o !== e.value) : [...c, e.value], s = t.options.filter((o) => n.includes(o.value));
    w(n), (l = t.onChange) == null || l.call(t, n, s);
  }, I = (e) => {
    var l;
    const n = c.filter((o) => o !== e), s = t.options.filter((o) => n.includes(o.value));
    w(n), (l = t.onChange) == null || l.call(t, n, s);
  }, b = (e) => {
    e.key === "Escape" && m();
  };
  return V(() => {
    if (!u) return;
    const e = (n) => {
      var s, l;
      !((s = a.current) != null && s.contains(n.target)) && !((l = E.current) != null && l.contains(n.target)) && m();
    };
    return document.addEventListener("mousedown", e), window.addEventListener("resize", r), window.addEventListener("scroll", r, !0), () => {
      document.removeEventListener("mousedown", e), window.removeEventListener("resize", r), window.removeEventListener("scroll", r, !0);
    };
  }, [u]), /* @__PURE__ */ O(
    z,
    {
      selected: S,
      filtered: T,
      query: L,
      open: u,
      disabled: i.disabled,
      placeholder: i.placeholder,
      searchPlaceholder: i.searchPlaceholder,
      emptyText: i.emptyText,
      maxSelected: t.maxSelected,
      className: t.className,
      listStyle: y,
      triggerRef: a,
      inputRef: h,
      listRef: E,
      onTriggerClick: () => u ? m() : M(),
      onQueryChange: f,
      onToggle: R,
      onRemove: I,
      onInputKeyDown: b
    }
  );
};
D.displayName = "MultiSelectMolecule";
export {
  D as MultiSelectMoleculeImpl
};
//# sourceMappingURL=MultiSelectMoleculeImpl.js.map
