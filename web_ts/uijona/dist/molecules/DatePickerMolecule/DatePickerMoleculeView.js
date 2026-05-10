import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { createPortal as P } from "react-dom";
import { cn as m } from "../../lib/cn.js";
const B = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"], F = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
function J(r, t) {
  const l = new Date(r, t, 1), o = new Date(r, t + 1, 0), c = l.getDay(), s = Array(c).fill(null);
  for (let n = 1; n <= o.getDate(); n++) s.push(new Date(r, t, n));
  for (; s.length % 7 !== 0; ) s.push(null);
  return s;
}
function h(r, t) {
  return r.getFullYear() === t.getFullYear() && r.getMonth() === t.getMonth() && r.getDate() === t.getDate();
}
const O = ({
  displayValue: r,
  open: t,
  viewYear: l,
  viewMonth: o,
  selectedDate: c,
  today: s,
  min: n,
  max: u,
  disabled: y,
  placeholder: g,
  className: p,
  panelStyle: x,
  triggerRef: v,
  panelRef: w,
  onTriggerClick: D,
  onPrevMonth: N,
  onNextMonth: k,
  onSelectDay: C
}) => {
  const j = J(l, o), M = !n || new Date(l, o, 0) >= n, S = !u || new Date(l, o + 1, 1) <= u;
  return /* @__PURE__ */ a("div", { className: m("relative inline-block w-full", p), children: [
    /* @__PURE__ */ a(
      "button",
      {
        ref: v,
        type: "button",
        disabled: y,
        onClick: D,
        "aria-label": r || g,
        "aria-haspopup": "dialog",
        "aria-expanded": t,
        className: m(
          "flex h-9 w-full items-center justify-between rounded-md border border-neutral-300 bg-neutral-50 px-3 py-1 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          t && "ring-2 ring-primary-500",
          !r && "text-neutral-400"
        ),
        children: [
          /* @__PURE__ */ e("span", { children: r || g }),
          /* @__PURE__ */ a("svg", { className: "h-4 w-4 shrink-0 text-neutral-400", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: [
            /* @__PURE__ */ e("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
            /* @__PURE__ */ e("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
            /* @__PURE__ */ e("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
            /* @__PURE__ */ e("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
          ] })
        ]
      }
    ),
    t && P(
      /* @__PURE__ */ a(
        "div",
        {
          ref: w,
          role: "dialog",
          "aria-label": "Calendario",
          style: x,
          className: "z-50 w-72 rounded-lg border border-neutral-200 bg-white p-3 shadow-xl",
          children: [
            /* @__PURE__ */ a("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: N,
                  disabled: !M,
                  "aria-label": "Mes anterior",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ e("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("polyline", { points: "15 18 9 12 15 6" }) })
                }
              ),
              /* @__PURE__ */ a("span", { className: "text-sm font-semibold text-neutral-900", children: [
                F[o],
                " ",
                l
              ] }),
              /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: k,
                  disabled: !S,
                  "aria-label": "Mes siguiente",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ e("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ e("polyline", { points: "9 18 15 12 9 6" }) })
                }
              )
            ] }),
            /* @__PURE__ */ e("div", { className: "mb-1 grid grid-cols-7 text-center", children: B.map((i) => /* @__PURE__ */ e("span", { className: "text-xs font-medium text-neutral-400", children: i }, i)) }),
            /* @__PURE__ */ e("div", { className: "grid grid-cols-7 gap-y-0.5", children: j.map((i, f) => {
              if (!i) return /* @__PURE__ */ e("span", {}, f);
              const d = c ? h(i, c) : !1, A = h(i, s), b = n && i < n || u && i > u;
              return /* @__PURE__ */ e(
                "button",
                {
                  type: "button",
                  onClick: () => !b && C(i),
                  disabled: !!b,
                  "aria-label": i.toLocaleDateString("es", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
                  "aria-pressed": d,
                  className: m(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors mx-auto",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    b ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:bg-neutral-100",
                    d && "bg-primary-600 font-semibold text-white hover:bg-primary-700",
                    A && !d && "border border-primary-400 font-medium text-primary-600"
                  ),
                  children: i.getDate()
                },
                f
              );
            }) })
          ]
        }
      ),
      document.body
    )
  ] });
};
export {
  O as DatePickerMoleculeView
};
//# sourceMappingURL=DatePickerMoleculeView.js.map
