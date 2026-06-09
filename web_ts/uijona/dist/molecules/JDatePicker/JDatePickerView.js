import { jsxs as l, jsx as r } from "react/jsx-runtime";
import { createPortal as Q } from "react-dom";
import { cn as u } from "../../lib/cn.js";
import { JTextBoxImpl as d } from "../../atoms/JTextBox/JTextBoxImpl.js";
const R = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"], U = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];
function X(t, n) {
  const a = new Date(t, n, 1), o = new Date(t, n + 1, 0), i = Array(a.getDay()).fill(null);
  for (let c = 1; c <= o.getDate(); c++) i.push(new Date(t, n, c));
  for (; i.length % 7 !== 0; ) i.push(null);
  return i;
}
function S(t, n) {
  return t.getFullYear() === n.getFullYear() && t.getMonth() === n.getMonth() && t.getDate() === n.getDate();
}
function v(t) {
  return String(t).padStart(2, "0");
}
const m = "h-8 w-full rounded-md border border-neutral-300 bg-white px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500", T = ({
  inputValue: t,
  open: n,
  viewYear: a,
  viewMonth: o,
  selectedDate: i,
  today: c,
  min: b,
  max: f,
  disabled: g,
  placeholder: w,
  showTime: N,
  showSeconds: j,
  showTimezone: D,
  timezoneOptions: x,
  timeParts: s,
  className: A,
  panelStyle: M,
  triggerRef: J,
  panelRef: B,
  inputRef: F,
  onInputChange: H,
  onTriggerClick: L,
  onPrevMonth: W,
  onNextMonth: V,
  onSelectDay: E,
  onTimeChange: h,
  onTimezoneChange: k
}) => {
  const I = X(a, o), q = !b || new Date(a, o, 0) >= b, G = !f || new Date(a, o + 1, 1) <= f;
  return /* @__PURE__ */ l("div", { className: u("relative w-full", A), children: [
    /* @__PURE__ */ l(
      "div",
      {
        ref: J,
        className: u(
          "flex h-9 w-full flex-row items-center rounded-md border border-neutral-300 bg-neutral-50 text-sm transition-colors",
          "focus-within:ring-2 focus-within:ring-primary-500",
          g && "cursor-not-allowed opacity-50",
          n && "ring-2 ring-primary-500"
        ),
        children: [
          /* @__PURE__ */ r(
            d,
            {
              ref: F,
              type: "text",
              disabled: g,
              value: t,
              onChange: H,
              placeholder: w,
              "aria-label": w || "Fecha",
              className: u(
                "min-w-0 flex-1 rounded-l-md rounded-r-none border-0 bg-transparent px-3 py-1 text-sm text-neutral-900",
                "placeholder:text-neutral-400 focus-visible:ring-0 disabled:cursor-not-allowed"
              )
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: g,
              onClick: L,
              "aria-label": "Abrir calendario",
              "aria-haspopup": "dialog",
              "aria-expanded": n,
              className: u(
                "flex h-full w-9 shrink-0 items-center justify-center rounded-r-md text-neutral-500 transition-colors",
                "hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                "disabled:cursor-not-allowed disabled:opacity-50"
              ),
              children: /* @__PURE__ */ l("svg", { className: "h-4 w-4 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: [
                /* @__PURE__ */ r("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                /* @__PURE__ */ r("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                /* @__PURE__ */ r("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                /* @__PURE__ */ r("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
              ] })
            }
          )
        ]
      }
    ),
    n && Q(
      /* @__PURE__ */ l(
        "div",
        {
          ref: B,
          role: "dialog",
          "aria-label": "Calendario",
          style: M,
          className: "z-50 w-80 max-w-[calc(100vw-16px)] rounded-lg border border-neutral-200 bg-white p-3 shadow-xl",
          children: [
            /* @__PURE__ */ l("div", { className: "mb-2 flex flex-row items-center justify-between gap-2", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: W,
                  disabled: !q,
                  "aria-label": "Mes anterior",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ r("polyline", { points: "15 18 9 12 15 6" }) })
                }
              ),
              /* @__PURE__ */ l("span", { className: "text-sm font-semibold text-neutral-900", children: [
                U[o],
                " ",
                a
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: V,
                  disabled: !G,
                  "aria-label": "Mes siguiente",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ r("polyline", { points: "9 18 15 12 9 6" }) })
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "mb-1 grid grid-cols-7 text-center", children: R.map((e) => /* @__PURE__ */ r("span", { className: "text-xs font-medium text-neutral-400", children: e }, e)) }),
            /* @__PURE__ */ r("div", { className: "grid grid-cols-7 gap-y-0.5", children: I.map((e, C) => {
              if (!e) return /* @__PURE__ */ r("span", {}, C);
              const p = i ? S(e, i) : !1, K = S(e, c), y = b && e < b || f && e > f;
              return /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: () => !y && E(e),
                  disabled: !!y,
                  "aria-label": e.toLocaleDateString("es", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }),
                  "aria-pressed": p,
                  className: u(
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    y ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:bg-neutral-100",
                    p && "bg-primary-600 font-semibold text-white hover:bg-primary-700",
                    K && !p && "border border-primary-400 font-medium text-primary-600"
                  ),
                  children: e.getDate()
                },
                C
              );
            }) }),
            (N || D) && /* @__PURE__ */ l("div", { className: "mt-3 border-t border-neutral-200 pt-3 flex flex-col gap-2", children: [
              N && /* @__PURE__ */ l("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ l("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "HH",
                  /* @__PURE__ */ r(
                    d,
                    {
                      type: "number",
                      min: 0,
                      max: 23,
                      value: v(s.hour),
                      onChange: (e) => h("hour", e),
                      className: m
                    }
                  )
                ] }),
                /* @__PURE__ */ l("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "mm",
                  /* @__PURE__ */ r(
                    d,
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: v(s.minute),
                      onChange: (e) => h("minute", e),
                      className: m
                    }
                  )
                ] }),
                j && /* @__PURE__ */ l("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "ss",
                  /* @__PURE__ */ r(
                    d,
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: v(s.second),
                      onChange: (e) => h("second", e),
                      className: m
                    }
                  )
                ] })
              ] }),
              D && /* @__PURE__ */ l("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                "Timezone",
                x != null && x.length ? /* @__PURE__ */ l(
                  "select",
                  {
                    value: s.timezone ?? "",
                    onChange: (e) => k(e.target.value),
                    className: m,
                    children: [
                      !s.timezone && /* @__PURE__ */ r("option", { value: "", children: "Seleccionar timezone" }),
                      x.map((e) => /* @__PURE__ */ r("option", { value: e, children: e }, e))
                    ]
                  }
                ) : /* @__PURE__ */ r(
                  d,
                  {
                    type: "text",
                    value: s.timezone ?? "",
                    onChange: k,
                    placeholder: "America/Lima",
                    className: m
                  }
                )
              ] })
            ] })
          ]
        }
      ),
      document.body
    )
  ] });
};
export {
  T as JDatePickerView
};
//# sourceMappingURL=JDatePickerView.js.map
