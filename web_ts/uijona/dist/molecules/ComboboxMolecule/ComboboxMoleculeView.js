import { jsxs as o, jsx as a } from "react/jsx-runtime";
import { createPortal as C } from "react-dom";
import { cn as i } from "../../lib/cn.js";
import { PanelAtomImpl as l } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { InputAtomImpl as j } from "../../atoms/InputAtom/InputAtomImpl.js";
const M = ({
  selected: r,
  query: m,
  filtered: t,
  open: n,
  disabled: b,
  placeholder: c,
  searchPlaceholder: s,
  emptyText: f,
  className: p,
  listStyle: x,
  triggerRef: h,
  inputRef: g,
  listRef: v,
  activeIndex: u,
  onTriggerClick: w,
  onQueryChange: y,
  onSelect: N,
  onKeyDown: k
}) => /* @__PURE__ */ o(l, { variant: "ghost", padding: "none", radius: "none", className: i("relative inline-block w-full", p), children: [
  /* @__PURE__ */ o(
    "button",
    {
      ref: h,
      type: "button",
      role: "combobox",
      "aria-expanded": n,
      "aria-haspopup": "listbox",
      "aria-autocomplete": "list",
      disabled: b,
      onClick: w,
      onKeyDown: k,
      className: i(
        "flex h-9 w-full items-center justify-between rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        n && "ring-2 ring-primary-500 ring-offset-0"
      ),
      children: [
        /* @__PURE__ */ a("span", { className: i("min-w-0 flex-1 truncate text-left", !r && "text-neutral-400"), children: r ? r.label : c }),
        /* @__PURE__ */ a(
          "svg",
          {
            className: "ml-2 h-4 w-4 shrink-0 text-neutral-400 transition-transform",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            style: { transform: n ? "rotate(180deg)" : void 0 },
            children: /* @__PURE__ */ a("polyline", { points: "6 9 12 15 18 9" })
          }
        )
      ]
    }
  ),
  n && C(
    /* @__PURE__ */ o(l, { variant: "ghost", padding: "none", radius: "none", ref: v, style: x, className: "z-50 flex max-h-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg", children: [
      /* @__PURE__ */ a(l, { variant: "ghost", padding: "none", radius: "none", className: "border-b border-neutral-100 p-2", children: /* @__PURE__ */ a(
        j,
        {
          ref: g,
          type: "text",
          value: m,
          onChange: y,
          placeholder: s,
          "aria-label": s,
          className: "h-8 w-full rounded border border-neutral-200 bg-white px-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
        }
      ) }),
      /* @__PURE__ */ a(l, { variant: "ghost", padding: "none", radius: "none", role: "listbox", className: "overflow-y-auto py-1", children: t.length === 0 ? /* @__PURE__ */ a("p", { className: "px-3 py-4 text-center text-sm text-neutral-400", children: f }) : t.map((e, d) => /* @__PURE__ */ o(
        "button",
        {
          role: "option",
          type: "button",
          "aria-selected": (r == null ? void 0 : r.value) === e.value,
          "aria-disabled": e.disabled,
          disabled: e.disabled,
          onClick: () => N(e),
          className: i(
            "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
            "focus-visible:outline-none",
            e.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
            d === u && "bg-neutral-100",
            (r == null ? void 0 : r.value) === e.value ? "font-medium text-primary-600" : "text-neutral-700",
            !e.disabled && d !== u && "hover:bg-neutral-50"
          ),
          children: [
            /* @__PURE__ */ a("span", { className: "min-w-0 flex-1 truncate", children: e.label }),
            (r == null ? void 0 : r.value) === e.value && /* @__PURE__ */ a("svg", { className: "h-4 w-4 shrink-0 text-primary-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: /* @__PURE__ */ a("polyline", { points: "20 6 9 17 4 12" }) })
          ]
        },
        e.value
      )) })
    ] }),
    document.body
  )
] });
export {
  M as ComboboxMoleculeView
};
//# sourceMappingURL=ComboboxMoleculeView.js.map
