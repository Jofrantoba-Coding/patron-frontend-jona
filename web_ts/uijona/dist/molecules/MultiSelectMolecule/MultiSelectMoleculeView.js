import { jsxs as t, jsx as e } from "react/jsx-runtime";
import { createPortal as B } from "react-dom";
import { cn as o } from "../../lib/cn.js";
const K = ({
  selected: a,
  filtered: d,
  query: x,
  open: i,
  disabled: n,
  placeholder: p,
  searchPlaceholder: u,
  emptyText: h,
  maxSelected: s,
  className: b,
  listStyle: f,
  triggerRef: y,
  inputRef: v,
  listRef: g,
  onTriggerClick: w,
  onQueryChange: N,
  onToggle: k,
  onRemove: C,
  onInputKeyDown: M
}) => {
  const m = s !== void 0 && a.length >= s;
  return /* @__PURE__ */ t("div", { className: o("relative w-full", b), children: [
    /* @__PURE__ */ t(
      "div",
      {
        ref: y,
        role: "combobox",
        "aria-expanded": i,
        "aria-haspopup": "listbox",
        "aria-disabled": n,
        onClick: n ? void 0 : w,
        className: o(
          "flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm transition-colors",
          i && "ring-2 ring-primary-500",
          n ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        ),
        children: [
          a.map((r) => /* @__PURE__ */ t("span", { className: "inline-flex items-center gap-1 rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700", children: [
            r.label,
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                "aria-label": `Quitar ${r.label}`,
                onClick: (l) => {
                  l.stopPropagation(), C(r.value);
                },
                className: "ml-0.5 rounded hover:text-primary-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500",
                children: /* @__PURE__ */ t("svg", { className: "h-3 w-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
                  /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] })
              }
            )
          ] }, r.value)),
          a.length === 0 && /* @__PURE__ */ e("span", { className: "text-neutral-400", children: p }),
          /* @__PURE__ */ e(
            "svg",
            {
              className: "ml-auto h-4 w-4 shrink-0 text-neutral-400",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              "aria-hidden": "true",
              style: { transform: i ? "rotate(180deg)" : void 0 },
              children: /* @__PURE__ */ e("polyline", { points: "6 9 12 15 18 9" })
            }
          )
        ]
      }
    ),
    i && B(
      /* @__PURE__ */ t("div", { ref: g, style: f, className: "z-50 flex max-h-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg", children: [
        /* @__PURE__ */ e("div", { className: "border-b border-neutral-100 p-2", children: /* @__PURE__ */ e(
          "input",
          {
            ref: v,
            type: "text",
            value: x,
            onChange: (r) => N(r.target.value),
            onKeyDown: M,
            placeholder: u,
            "aria-label": u,
            className: "h-8 w-full rounded border border-neutral-200 bg-white px-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
          }
        ) }),
        m && /* @__PURE__ */ t("p", { className: "px-3 py-1.5 text-xs text-neutral-400", children: [
          "Máximo ",
          s,
          " seleccionados"
        ] }),
        /* @__PURE__ */ e("div", { role: "listbox", "aria-multiselectable": "true", className: "overflow-y-auto py-1", children: d.length === 0 ? /* @__PURE__ */ e("p", { className: "px-3 py-4 text-center text-sm text-neutral-400", children: h }) : d.map((r) => {
          const l = a.some((j) => j.value === r.value), c = r.disabled || m && !l;
          return /* @__PURE__ */ t(
            "button",
            {
              role: "option",
              type: "button",
              "aria-selected": l,
              "aria-disabled": c,
              disabled: c,
              onClick: () => k(r),
              className: o(
                "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                c ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-neutral-50",
                l && "font-medium text-primary-600"
              ),
              children: [
                /* @__PURE__ */ e("span", { className: o(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                  l ? "border-primary-600 bg-primary-600" : "border-neutral-300 bg-white"
                ), children: l && /* @__PURE__ */ e("svg", { className: "h-3 w-3 text-white", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 3, "aria-hidden": "true", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
                /* @__PURE__ */ e("span", { className: "min-w-0 flex-1 truncate", children: r.label })
              ]
            },
            r.value
          );
        }) })
      ] }),
      document.body
    )
  ] });
};
export {
  K as MultiSelectMoleculeView
};
//# sourceMappingURL=MultiSelectMoleculeView.js.map
