import { jsxs as n, jsx as e } from "react/jsx-runtime";
import { createPortal as M } from "react-dom";
import { cn as i } from "../../lib/cn.js";
import { JPanelImpl as t } from "../../atoms/JPanel/JPanelImpl.js";
import { JTextBoxImpl as W } from "../../atoms/JTextBox/JTextBoxImpl.js";
const Q = ({
  selected: l,
  filtered: u,
  query: x,
  open: o,
  disabled: s,
  placeholder: h,
  searchPlaceholder: m,
  emptyText: b,
  maxSelected: d,
  className: g,
  listStyle: f,
  triggerRef: y,
  inputRef: v,
  listRef: w,
  onTriggerClick: N,
  onQueryChange: k,
  onToggle: C,
  onRemove: B,
  onInputKeyDown: j
}) => {
  const p = d !== void 0 && l.length >= d;
  return /* @__PURE__ */ n(t, { variant: "ghost", padding: "none", radius: "none", className: i("relative w-full", g), children: [
    /* @__PURE__ */ n(
      t,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        ref: y,
        role: "combobox",
        "aria-expanded": o,
        "aria-haspopup": "listbox",
        "aria-disabled": s,
        onClick: s ? void 0 : N,
        className: i(
          "flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm transition-colors",
          o && "ring-2 ring-primary-500",
          s ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        ),
        children: [
          l.map((r) => /* @__PURE__ */ n("span", { className: "inline-flex items-center gap-1 rounded bg-primary-100 px-1.5 py-0.5 text-xs font-medium text-primary-700", children: [
            r.label,
            /* @__PURE__ */ e(
              "button",
              {
                type: "button",
                "aria-label": `Quitar ${r.label}`,
                onClick: (a) => {
                  a.stopPropagation(), B(r.value);
                },
                className: "ml-0.5 rounded hover:text-primary-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500",
                children: /* @__PURE__ */ n("svg", { className: "h-3 w-3", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.5, "aria-hidden": "true", children: [
                  /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] })
              }
            )
          ] }, r.value)),
          l.length === 0 && /* @__PURE__ */ e("span", { className: "text-neutral-400", children: h }),
          /* @__PURE__ */ e(
            "svg",
            {
              className: "ml-auto h-4 w-4 shrink-0 text-neutral-400",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              "aria-hidden": "true",
              style: { transform: o ? "rotate(180deg)" : void 0 },
              children: /* @__PURE__ */ e("polyline", { points: "6 9 12 15 18 9" })
            }
          )
        ]
      }
    ),
    o && M(
      /* @__PURE__ */ n(t, { variant: "ghost", padding: "none", radius: "none", ref: w, style: f, className: "z-50 flex max-h-64 max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg", children: [
        /* @__PURE__ */ e(t, { variant: "ghost", padding: "none", radius: "none", className: "border-b border-neutral-100 p-2", children: /* @__PURE__ */ e(
          W,
          {
            ref: v,
            type: "text",
            value: x,
            onChange: k,
            onKeyDown: j,
            placeholder: m,
            "aria-label": m,
            className: "h-8 w-full rounded border border-neutral-200 bg-white px-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
          }
        ) }),
        p && /* @__PURE__ */ n("p", { className: "px-3 py-1.5 text-xs text-neutral-400", children: [
          "Máximo ",
          d,
          " seleccionados"
        ] }),
        /* @__PURE__ */ e(t, { variant: "ghost", padding: "none", radius: "none", role: "listbox", "aria-multiselectable": "true", className: "overflow-y-auto py-1", children: u.length === 0 ? /* @__PURE__ */ e("p", { className: "px-3 py-4 text-center text-sm text-neutral-400", children: b }) : u.map((r) => {
          const a = l.some((J) => J.value === r.value), c = r.disabled || p && !a;
          return /* @__PURE__ */ n(
            "button",
            {
              role: "option",
              type: "button",
              "aria-selected": a,
              "aria-disabled": c,
              disabled: c,
              onClick: () => C(r),
              className: i(
                "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                c ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-neutral-50",
                a && "font-medium text-primary-600"
              ),
              children: [
                /* @__PURE__ */ e("span", { className: i(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                  a ? "border-primary-600 bg-primary-600" : "border-neutral-300 bg-white"
                ), children: a && /* @__PURE__ */ e("svg", { className: "h-3 w-3 text-white", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 3, "aria-hidden": "true", children: /* @__PURE__ */ e("polyline", { points: "20 6 9 17 4 12" }) }) }),
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
  Q as JMultiSelectView
};
//# sourceMappingURL=JMultiSelectView.js.map
