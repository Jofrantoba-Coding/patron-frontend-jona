import { jsx as l } from "react/jsx-runtime";
import { useEffect as r } from "react";
import { DRAWER_MOLECULE_DEFAULTS as i } from "./InterDrawerMolecule.js";
import { DrawerMoleculeView as s } from "./DrawerMoleculeView.js";
const d = (e) => {
  const o = { ...i, ...e };
  return r(() => {
    if (!o.open) return;
    const n = (t) => {
      t.key === "Escape" && e.onClose();
    };
    return document.addEventListener("keydown", n), document.body.style.overflow = "hidden", () => {
      document.removeEventListener("keydown", n), document.body.style.overflow = "";
    };
  }, [o.open, e.onClose]), /* @__PURE__ */ l(
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
d.displayName = "DrawerMolecule";
export {
  d as DrawerMoleculeImpl
};
//# sourceMappingURL=DrawerMoleculeImpl.js.map
