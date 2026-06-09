import { jsx as t } from "react/jsx-runtime";
import { useEffect as a } from "react";
import { JOPTIONPANE_DEFAULTS as c } from "./InterJOptionPane.js";
import { JOptionPaneView as m } from "./JOptionPaneView.js";
const r = (n) => {
  const e = { ...c, ...n };
  return a(() => {
    if (!n.open) return;
    const o = (i) => {
      i.key === "Escape" && n.onCancel();
    };
    return document.addEventListener("keydown", o), () => document.removeEventListener("keydown", o);
  }, [n.open, n.onCancel]), /* @__PURE__ */ t(
    m,
    {
      open: n.open,
      title: n.title,
      description: n.description,
      variant: e.variant,
      confirmLabel: e.confirmLabel,
      cancelLabel: e.cancelLabel,
      isLoading: e.isLoading,
      onConfirm: n.onConfirm,
      onCancel: n.onCancel
    }
  );
};
r.displayName = "JOptionPane";
export {
  r as JOptionPaneImpl
};
//# sourceMappingURL=JOptionPaneImpl.js.map
