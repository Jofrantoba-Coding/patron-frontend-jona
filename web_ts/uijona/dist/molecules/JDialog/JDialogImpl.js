import { jsx as k } from "react/jsx-runtime";
import { useRef as m, useEffect as a } from "react";
import { JDIALOG_DEFAULTS as D } from "./InterJDialog.js";
import { JDialogView as E } from "./JDialogView.js";
const g = ({
  open: t,
  onClose: r,
  onOpened: u,
  onClosed: f,
  onCancel: c,
  ...y
}) => {
  const v = { ...D, ...y }, w = m(null), d = m(null), e = m(!1);
  return a(() => {
    if (!t) return;
    const i = (s) => {
      s.key === "Escape" && (r == null || r());
    };
    return document.addEventListener("keydown", i), () => document.removeEventListener("keydown", i);
  }, [t, r]), a(() => {
    if (t)
      return document.body.style.overflow = "hidden", e.current || u == null || u(), e.current = !0, () => {
        document.body.style.overflow = "";
      };
    if (document.body.style.overflow = "", !!e.current && (e.current = !1, f)) {
      const i = requestAnimationFrame(() => f());
      return () => cancelAnimationFrame(i);
    }
  }, [t, u, f]), a(() => {
    var i;
    t && ((i = d.current) == null || i.focus());
  }, [t]), /* @__PURE__ */ k(
    E,
    {
      ...v,
      open: t,
      onClose: r,
      overlayRef: w,
      dialogRef: d,
      onOverlayClick: () => r == null ? void 0 : r(),
      onCloseClick: () => {
        c == null || c(), r == null || r();
      }
    }
  );
};
g.displayName = "JDialog";
export {
  g as JDialogImpl
};
//# sourceMappingURL=JDialogImpl.js.map
