import { jsx as h } from "react/jsx-runtime";
import { useState as p, useRef as g, useEffect as x } from "react";
import { DropdownMoleculeView as L } from "./DropdownMoleculeView.js";
const M = ({
  align: a = "start",
  onOpen: i,
  onClose: t,
  onItemSelect: n,
  ...k
}) => {
  const [f, u] = p(!1), [y, v] = p({}), c = g(null), s = g(null), E = () => {
    if (!c.current) return;
    const r = c.current.getBoundingClientRect();
    v({
      position: "fixed",
      top: r.bottom + 4,
      ...a === "end" ? { right: window.innerWidth - r.right } : { left: r.left },
      minWidth: r.width,
      zIndex: 50
    });
  };
  return x(() => {
    if (!f) return;
    const r = (d) => {
      d.key === "Escape" && (u(!1), t == null || t());
    }, e = (d) => {
      var m, w;
      !((m = c.current) != null && m.contains(d.target)) && !((w = s.current) != null && w.contains(d.target)) && (u(!1), t == null || t());
    };
    return document.addEventListener("keydown", r), document.addEventListener("mousedown", e), () => {
      document.removeEventListener("keydown", r), document.removeEventListener("mousedown", e);
    };
  }, [f, t]), /* @__PURE__ */ h(
    L,
    {
      ...k,
      align: a,
      onOpen: i,
      onClose: t,
      onItemSelect: n,
      open: f,
      menuStyle: y,
      triggerRef: c,
      menuRef: s,
      onTriggerClick: () => {
        E(), u((r) => {
          const e = !r;
          return e ? i == null || i() : t == null || t(), e;
        });
      },
      onItemClick: (r) => {
        var e;
        (e = r.onClick) == null || e.call(r), n == null || n(r.label), u(!1), t == null || t();
      }
    }
  );
};
M.displayName = "DropdownMolecule";
export {
  M as DropdownMoleculeImpl
};
//# sourceMappingURL=DropdownMoleculeImpl.js.map
