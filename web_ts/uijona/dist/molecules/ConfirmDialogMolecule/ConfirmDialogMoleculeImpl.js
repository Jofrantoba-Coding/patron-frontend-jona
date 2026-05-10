import { jsx as t } from "react/jsx-runtime";
import { useEffect as a } from "react";
import { CONFIRM_DIALOG_MOLECULE_DEFAULTS as l } from "./InterConfirmDialogMolecule.js";
import { ConfirmDialogMoleculeView as c } from "./ConfirmDialogMoleculeView.js";
const m = (e) => {
  const n = { ...l, ...e };
  return a(() => {
    if (!e.open) return;
    const o = (i) => {
      i.key === "Escape" && e.onCancel();
    };
    return document.addEventListener("keydown", o), () => document.removeEventListener("keydown", o);
  }, [e.open, e.onCancel]), /* @__PURE__ */ t(
    c,
    {
      open: e.open,
      title: e.title,
      description: e.description,
      variant: n.variant,
      confirmLabel: n.confirmLabel,
      cancelLabel: n.cancelLabel,
      isLoading: n.isLoading,
      onConfirm: e.onConfirm,
      onCancel: e.onCancel
    }
  );
};
m.displayName = "ConfirmDialogMolecule";
export {
  m as ConfirmDialogMoleculeImpl
};
//# sourceMappingURL=ConfirmDialogMoleculeImpl.js.map
