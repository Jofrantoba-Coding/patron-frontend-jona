import { jsx as E } from "react/jsx-runtime";
import { useRef as m, useEffect as a } from "react";
import { DIALOG_MOLECULE_DEFAULTS as s } from "./InterDialogMolecule.js";
import { DialogMoleculeView as L } from "./DialogMoleculeView.js";
const k = ({
  open: t,
  onClose: r,
  onOpened: i,
  onClosed: c,
  onCancel: f,
  ...y
}) => {
  const v = { ...s, ...y }, l = m(null), d = m(null), u = m(!1);
  return a(() => {
    if (!t) return;
    const e = (w) => {
      w.key === "Escape" && (r == null || r());
    };
    return document.addEventListener("keydown", e), () => document.removeEventListener("keydown", e);
  }, [t, r]), a(() => {
    if (t)
      return document.body.style.overflow = "hidden", u.current || i == null || i(), u.current = !0, () => {
        document.body.style.overflow = "";
      };
    if (document.body.style.overflow = "", !!u.current && (u.current = !1, c)) {
      const e = requestAnimationFrame(() => c());
      return () => cancelAnimationFrame(e);
    }
  }, [t, i, c]), a(() => {
    var e;
    t && ((e = d.current) == null || e.focus());
  }, [t]), /* @__PURE__ */ E(
    L,
    {
      ...v,
      open: t,
      onClose: r,
      overlayRef: l,
      dialogRef: d,
      onOverlayClick: () => r == null ? void 0 : r(),
      onCloseClick: () => {
        f == null || f(), r == null || r();
      }
    }
  );
};
k.displayName = "DialogMolecule";
export {
  k as DialogMoleculeImpl
};
//# sourceMappingURL=DialogMoleculeImpl.js.map
