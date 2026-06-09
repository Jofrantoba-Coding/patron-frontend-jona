import { jsx as r } from "react/jsx-runtime";
import { useEffect as i } from "react";
import { JDRAWER_DEFAULTS as l } from "./InterJDrawer.js";
import { JDrawerView as s } from "./JDrawerView.js";
const d = (e) => {
  const o = { ...l, ...e };
  return i(() => {
    if (!o.open) return;
    const n = (t) => {
      t.key === "Escape" && e.onClose();
    };
    return document.addEventListener("keydown", n), document.body.style.overflow = "hidden", () => {
      document.removeEventListener("keydown", n), document.body.style.overflow = "";
    };
  }, [o.open, e.onClose]), /* @__PURE__ */ r(
    s,
    {
      open: o.open,
      side: o.side,
      size: o.size,
      showCloseButton: o.showCloseButton,
      title: e.title,
      description: e.description,
      className: e.className,
      footer: e.footer,
      onClose: e.onClose,
      onOverlayClick: e.onClose,
      children: e.children
    }
  );
};
d.displayName = "JDrawer";
export {
  d as JDrawerImpl
};
//# sourceMappingURL=JDrawerImpl.js.map
