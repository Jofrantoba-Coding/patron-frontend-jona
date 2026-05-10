import { jsxs as i, jsx as l } from "react/jsx-runtime";
import { createPortal as k } from "react-dom";
import { cn as o } from "../../lib/cn.js";
const W = ({
  selected: r,
  query: d,
  filtered: t,
  open: a,
  disabled: m,
  placeholder: b,
  searchPlaceholder: n,
  emptyText: c,
  className: f,
  listStyle: x,
  triggerRef: h,
  inputRef: p,
  listRef: v,
  activeIndex: s,
  onTriggerClick: g,
  onQueryChange: w,
  onSelect: y,
  onKeyDown: N
}) => /* @__PURE__ */ i("div", { className: o("relative inline-block w-full", f), children: [
  /* @__PURE__ */ i(
    "button",
    {
      ref: h,
      type: "button",
      role: "combobox",
      "aria-expanded": a,
      "aria-haspopup": "listbox",
      "aria-autocomplete": "list",
      disabled: m,
      onClick: g,
      onKeyDown: N,
      className: o(
        "flex h-9 w-full items-center justify-between rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        a && "ring-2 ring-primary-500 ring-offset-0"
      ),
      children: [
        /* @__PURE__ */ l("span", { className: o("min-w-0 flex-1 truncate text-left", !r && "text-neutral-400"), children: r ? r.label : b }),
        /* @__PURE__ */ l(
          "svg",
          {
            className: "ml-2 h-4 w-4 shrink-0 text-neutral-400 transition-transform",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            "aria-hidden": "true",
            style: { transform: a ? "rotate(180deg)" : void 0 },
            children: /* @__PURE__ */ l("polyline", { points: "6 9 12 15 18 9" })
          }
        )
      ]
    }
  ),
  a && k(
    /* @__PURE__ */ i("div", { ref: v, style: x, className: "z-50 flex max-h-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg", children: [
      /* @__PURE__ */ l("div", { className: "border-b border-neutral-100 p-2", children: /* @__PURE__ */ l(
        "input",
        {
          ref: p,
          type: "text",
          value: d,
          onChange: (e) => w(e.target.value),
          placeholder: n,
          "aria-label": n,
          className: "h-8 w-full rounded border border-neutral-200 bg-white px-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
        }
      ) }),
      /* @__PURE__ */ l("div", { role: "listbox", className: "overflow-y-auto py-1", children: t.length === 0 ? /* @__PURE__ */ l("p", { className: "px-3 py-4 text-center text-sm text-neutral-400", children: c }) : t.map((e, u) => /* @__PURE__ */ i(
        "button",
        {
          role: "option",
          type: "button",
          "aria-selected": (r == null ? void 0 : r.value) === e.value,
          "aria-disabled": e.disabled,
          disabled: e.disabled,
          onClick: () => y(e),
          className: o(
            "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
            "focus-visible:outline-none",
            e.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
            u === s && "bg-neutral-100",
            (r == null ? void 0 : r.value) === e.value ? "font-medium text-primary-600" : "text-neutral-700",
            !e.disabled && u !== s && "hover:bg-neutral-50"
          ),
          children: [
            /* @__PURE__ */ l("span", { className: "min-w-0 flex-1 truncate", children: e.label }),
            (r == null ? void 0 : r.value) === e.value && /* @__PURE__ */ l("svg", { className: "h-4 w-4 shrink-0 text-primary-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: /* @__PURE__ */ l("polyline", { points: "20 6 9 17 4 12" }) })
          ]
        },
        e.value
      )) })
    ] }),
    document.body
  )
] });
export {
  W as ComboboxMoleculeView
};
//# sourceMappingURL=ComboboxMoleculeView.js.map
