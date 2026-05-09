import { jsx as L } from "react/jsx-runtime";
import { useState as v, useRef as p, useEffect as M } from "react";
import { DropdownMoleculeView as k } from "./DropdownMoleculeView.js";
const y = ({
  align: o = "start",
  onOpen: c,
  onClose: t,
  onItemSelect: u,
  ...h
}) => {
  const [f, a] = v(!1), [E, g] = v({}), s = p(null), m = p(null), d = () => {
    if (!s.current) return;
    const e = s.current.getBoundingClientRect(), r = 8, n = window.innerWidth, i = Math.min(Math.max(e.width, 160), n - r * 2), w = o === "end" ? e.right - i : e.left, x = Math.min(Math.max(w, r), n - i - r);
    g({
      position: "fixed",
      top: e.bottom + 4,
      left: x,
      width: i,
      maxWidth: `calc(100vw - ${r * 2}px)`,
      zIndex: 50
    });
  };
  return M(() => {
    if (!f) return;
    const e = (n) => {
      n.key === "Escape" && (a(!1), t == null || t());
    }, r = (n) => {
      var i, w;
      !((i = s.current) != null && i.contains(n.target)) && !((w = m.current) != null && w.contains(n.target)) && (a(!1), t == null || t());
    };
    return document.addEventListener("keydown", e), document.addEventListener("mousedown", r), window.addEventListener("resize", d), window.addEventListener("scroll", d, !0), () => {
      document.removeEventListener("keydown", e), document.removeEventListener("mousedown", r), window.removeEventListener("resize", d), window.removeEventListener("scroll", d, !0);
    };
  }, [f, t]), /* @__PURE__ */ L(
    k,
    {
      ...h,
      align: o,
      onOpen: c,
      onClose: t,
      onItemSelect: u,
      open: f,
      menuStyle: E,
      triggerRef: s,
      menuRef: m,
      onTriggerClick: () => {
        d(), a((e) => {
          const r = !e;
          return r ? c == null || c() : t == null || t(), r;
        });
      },
      onItemClick: (e) => {
        var r;
        (r = e.onClick) == null || r.call(e), u == null || u(e.label), a(!1), t == null || t();
      }
    }
  );
};
y.displayName = "DropdownMolecule";
export {
  y as DropdownMoleculeImpl
};
//# sourceMappingURL=DropdownMoleculeImpl.js.map
