import { jsx as w } from "react/jsx-runtime";
import { useRef as a, useEffect as f } from "react";
import { DIALOG_MOLECULE_DEFAULTS as L } from "./InterDialogMolecule.js";
import { DialogMoleculeView as k } from "./DialogMoleculeView.js";
const l = ({
  open: t,
  onClose: r,
  onOpened: u,
  onClosed: m,
  onCancel: c,
  ...y
}) => {
  const v = { ...L, ...y }, d = a(null), e = a(null);
  return f(() => {
    if (!t) return;
    const i = (E) => {
      E.key === "Escape" && (r == null || r());
    };
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, [t, r]), f(() => {
    if (t)
      document.body.style.overflow = "hidden", u == null || u();
    else if (document.body.style.overflow = "", m) {
      const i = requestAnimationFrame(() => m == null ? void 0 : m());
      return () => cancelAnimationFrame(i);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [t, u, m]), f(() => {
    var i;
    t && ((i = e.current) == null || i.focus());
  }, [t]), /* @__PURE__ */ w(
    k,
    {
      ...v,
      open: t,
      onClose: r,
      overlayRef: d,
      dialogRef: e,
      onOverlayClick: () => r == null ? void 0 : r(),
      onCloseClick: () => {
        c == null || c(), r == null || r();
      }
    }
  );
};
l.displayName = "DialogMolecule";
export {
  l as DialogMoleculeImpl
};
//# sourceMappingURL=DialogMoleculeImpl.js.map
