import { jsx as u } from "react/jsx-runtime";
import m from "react";
import { cn as l } from "../../lib/cn.js";
const d = {
  default: "text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500",
  muted: "text-neutral-600 underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:ring-neutral-400",
  button: "inline-flex h-9 items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus-visible:ring-primary-500",
  danger: "text-danger-500 underline-offset-4 hover:underline focus-visible:ring-danger-500"
}, p = m.forwardRef(
  ({ variant: t = "default", disabled: e, className: n, onClick: r, children: o, tabIndex: s, ...f }, a) => /* @__PURE__ */ u(
    "a",
    {
      ref: a,
      "aria-disabled": e || void 0,
      tabIndex: e ? -1 : s,
      onClick: (i) => {
        if (e) {
          i.preventDefault();
          return;
        }
        r == null || r(i);
      },
      className: l(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        e && "pointer-events-none opacity-50",
        d[t],
        n
      ),
      ...f,
      children: o
    }
  )
);
p.displayName = "LinkAtomView";
export {
  p as LinkAtomView
};
//# sourceMappingURL=LinkAtomView.js.map
