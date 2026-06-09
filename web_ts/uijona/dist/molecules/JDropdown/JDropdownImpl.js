import { jsx as x } from "react/jsx-runtime";
import { useState as v, useRef as p, useEffect as k } from "react";
import { JDROPDOWN_DEFAULTS as y } from "./InterJDropdown.js";
import { JDropdownView as D } from "./JDropdownView.js";
const M = ({
  align: m = y.align,
  onOpen: c,
  onClose: t,
  onItemSelect: a,
  ...E
}) => {
  const [w, u] = v(!1), [L, g] = v({}), s = p(null), o = p(null), d = () => {
    if (!s.current) return;
    const e = s.current.getBoundingClientRect(), r = 8, n = window.innerWidth, i = Math.min(Math.max(e.width, 160), n - r * 2), f = m === "end" ? e.right - i : e.left, h = Math.min(Math.max(f, r), n - i - r);
    g({
      position: "fixed",
      top: e.bottom + 4,
      left: h,
      width: i,
      maxWidth: `calc(100vw - ${r * 2}px)`,
      zIndex: 50
    });
  };
  return k(() => {
    if (!w) return;
    const e = (n) => {
      n.key === "Escape" && (u(!1), t == null || t());
    }, r = (n) => {
      var i, f;
      !((i = s.current) != null && i.contains(n.target)) && !((f = o.current) != null && f.contains(n.target)) && (u(!1), t == null || t());
    };
    return document.addEventListener("keydown", e), document.addEventListener("mousedown", r), window.addEventListener("resize", d), window.addEventListener("scroll", d, !0), () => {
      document.removeEventListener("keydown", e), document.removeEventListener("mousedown", r), window.removeEventListener("resize", d), window.removeEventListener("scroll", d, !0);
    };
  }, [w, t]), /* @__PURE__ */ x(
    D,
    {
      ...E,
      align: m,
      onOpen: c,
      onClose: t,
      onItemSelect: a,
      open: w,
      menuStyle: L,
      triggerRef: s,
      menuRef: o,
      onTriggerClick: () => {
        d(), u((e) => {
          const r = !e;
          return r ? c == null || c() : t == null || t(), r;
        });
      },
      onItemClick: (e) => {
        var r;
        (r = e.onClick) == null || r.call(e), a == null || a(e.label), u(!1), t == null || t();
      }
    }
  );
};
M.displayName = "JDropdown";
export {
  M as JDropdownImpl
};
//# sourceMappingURL=JDropdownImpl.js.map
