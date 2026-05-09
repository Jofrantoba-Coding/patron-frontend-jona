import { jsxs as s, jsx as o } from "react/jsx-runtime";
import { cn as d } from "../../lib/cn.js";
const c = {
  default: "bg-neutral-100 text-neutral-700 border-neutral-200",
  primary: "bg-primary-50 text-primary-700 border-primary-200",
  success: "bg-green-50 text-success-600 border-green-200",
  warning: "bg-yellow-50 text-warning-600 border-yellow-200",
  danger: "bg-red-50 text-danger-600 border-red-200"
}, m = ({
  variant: e = "default",
  selected: r,
  removable: t,
  onRemove: n,
  className: i,
  children: a,
  ...l
}) => /* @__PURE__ */ s(
  "span",
  {
    "data-selected": r || void 0,
    className: d(
      "inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-xs font-medium",
      "data-[selected=true]:ring-2 data-[selected=true]:ring-primary-500 data-[selected=true]:ring-offset-1",
      c[e],
      i
    ),
    ...l,
    children: [
      a,
      t && /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          "aria-label": "Remove",
          className: "ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          onClick: n,
          children: "×"
        }
      )
    ]
  }
);
export {
  m as ChipAtomView
};
//# sourceMappingURL=ChipAtomView.js.map
