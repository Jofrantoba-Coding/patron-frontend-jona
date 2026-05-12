import { jsxs as n, jsx as r } from "react/jsx-runtime";
import { createPortal as P } from "react-dom";
import { cn as d } from "../../lib/cn.js";
import { PanelAtomImpl as a } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { InputAtomImpl as m } from "../../atoms/InputAtom/InputAtomImpl.js";
const Q = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"], R = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
function U(t, i) {
  const o = new Date(t, i, 1), s = new Date(t, i + 1, 0), b = o.getDay(), u = Array(b).fill(null);
  for (let l = 1; l <= s.getDate(); l += 1) u.push(new Date(t, i, l));
  for (; u.length % 7 !== 0; ) u.push(null);
  return u;
}
function S(t, i) {
  return t.getFullYear() === i.getFullYear() && t.getMonth() === i.getMonth() && t.getDate() === i.getDate();
}
function v(t) {
  return String(t).padStart(2, "0");
}
const T = ({
  inputValue: t,
  open: i,
  viewYear: o,
  viewMonth: s,
  selectedDate: b,
  today: u,
  min: l,
  max: g,
  disabled: p,
  placeholder: N,
  mask: A,
  showTime: w,
  showSeconds: j,
  showTimezone: D,
  timezoneOptions: f,
  timeParts: c,
  className: M,
  panelStyle: F,
  triggerRef: B,
  panelRef: H,
  inputRef: I,
  onInputChange: J,
  onTriggerClick: L,
  onPrevMonth: W,
  onNextMonth: V,
  onSelectDay: E,
  onTimeChange: x,
  onTimezoneChange: k
}) => {
  const q = U(o, s), z = !l || new Date(o, s, 0) >= l, G = !g || new Date(o, s + 1, 1) <= g;
  return /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", className: d("relative inline-block w-full", M), children: [
    /* @__PURE__ */ n(
      a,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        ref: B,
        className: d(
          "flex h-9 w-full items-center rounded-md border border-neutral-300 bg-neutral-50 text-sm transition-colors",
          "focus-within:ring-2 focus-within:ring-primary-500",
          p && "cursor-not-allowed opacity-50",
          i && "ring-2 ring-primary-500"
        ),
        children: [
          /* @__PURE__ */ r(
            m,
            {
              ref: I,
              type: "text",
              disabled: p,
              value: t,
              onChange: J,
              placeholder: N || A,
              "aria-label": N || "Fecha",
              className: d(
                "min-w-0 flex-1 rounded-l-md rounded-r-none border-0 bg-transparent px-3 py-1 text-sm text-neutral-900",
                "placeholder:text-neutral-400 focus-visible:ring-0 disabled:cursor-not-allowed"
              )
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: p,
              onClick: L,
              "aria-label": "Abrir calendario",
              "aria-haspopup": "dialog",
              "aria-expanded": i,
              className: d(
                "flex h-full w-9 shrink-0 items-center justify-center rounded-r-md text-neutral-500 transition-colors",
                "hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                "disabled:cursor-not-allowed disabled:opacity-50"
              ),
              children: /* @__PURE__ */ n("svg", { className: "h-4 w-4 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: [
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
    i && P(
      /* @__PURE__ */ n(
        a,
        {
          variant: "ghost",
          padding: "none",
          radius: "none",
          ref: H,
          role: "dialog",
          "aria-label": "Calendario",
          style: F,
          className: "z-50 w-80 max-w-[calc(100vw-16px)] rounded-lg border border-neutral-200 bg-white p-3 shadow-xl",
          children: [
            /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", className: "mb-2 flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: W,
                  disabled: !z,
                  "aria-label": "Mes anterior",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ r("polyline", { points: "15 18 9 12 15 6" }) })
                }
              ),
              /* @__PURE__ */ n("span", { className: "text-sm font-semibold text-neutral-900", children: [
                R[s],
                " ",
                o
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
            /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: "mb-1 grid grid-cols-7 text-center", children: Q.map((e) => /* @__PURE__ */ r("span", { className: "text-xs font-medium text-neutral-400", children: e }, e)) }),
            /* @__PURE__ */ r(a, { variant: "ghost", padding: "none", radius: "none", className: "grid grid-cols-7 gap-y-0.5", children: q.map((e, C) => {
              if (!e) return /* @__PURE__ */ r("span", {}, C);
              const h = b ? S(e, b) : !1, K = S(e, u), y = l && e < l || g && e > g;
              return /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: () => !y && E(e),
                  disabled: !!y,
                  "aria-label": e.toLocaleDateString("es", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
                  "aria-pressed": h,
                  className: d(
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    y ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:bg-neutral-100",
                    h && "bg-primary-600 font-semibold text-white hover:bg-primary-700",
                    K && !h && "border border-primary-400 font-medium text-primary-600"
                  ),
                  children: e.getDate()
                },
                C
              );
            }) }),
            (w || D) && /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", className: "mt-3 border-t border-neutral-200 pt-3", children: [
              w && /* @__PURE__ */ n(a, { variant: "ghost", padding: "none", radius: "none", className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ n("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "HH",
                  /* @__PURE__ */ r(
                    m,
                    {
                      type: "number",
                      min: 0,
                      max: 23,
                      value: v(c.hour),
                      onChange: (e) => x("hour", e),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] }),
                /* @__PURE__ */ n("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "mm",
                  /* @__PURE__ */ r(
                    m,
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: v(c.minute),
                      onChange: (e) => x("minute", e),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] }),
                j && /* @__PURE__ */ n("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "ss",
                  /* @__PURE__ */ r(
                    m,
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: v(c.second),
                      onChange: (e) => x("second", e),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] })
              ] }),
              D && /* @__PURE__ */ n("label", { className: "mt-2 flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                "Timezone",
                f != null && f.length ? /* @__PURE__ */ n(
                  "select",
                  {
                    value: c.timezone ?? "",
                    onChange: (e) => k(e.target.value),
                    className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    children: [
                      !c.timezone && /* @__PURE__ */ r("option", { value: "", children: "Seleccionar timezone" }),
                      f.map((e) => /* @__PURE__ */ r("option", { value: e, children: e }, e))
                    ]
                  }
                ) : /* @__PURE__ */ r(
                  m,
                  {
                    type: "text",
                    value: c.timezone ?? "",
                    onChange: k,
                    placeholder: "America/Lima",
                    className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
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
  T as DatePickerMoleculeView
};
//# sourceMappingURL=DatePickerMoleculeView.js.map
