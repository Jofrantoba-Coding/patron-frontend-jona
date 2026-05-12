import { jsxs as n, jsx as r } from "react/jsx-runtime";
import { createPortal as Q } from "react-dom";
import { cn as d } from "../../lib/cn.js";
import { PanelAtomImpl as o } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { InputAtomImpl as m } from "../../atoms/InputAtom/InputAtomImpl.js";
import { LabelAtomImpl as p } from "../../atoms/LabelAtom/LabelAtomImpl.js";
const R = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"], U = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
function X(t, i) {
  const a = new Date(t, i, 1), s = new Date(t, i + 1, 0), b = a.getDay(), u = Array(b).fill(null);
  for (let l = 1; l <= s.getDate(); l += 1) u.push(new Date(t, i, l));
  for (; u.length % 7 !== 0; ) u.push(null);
  return u;
}
function A(t, i) {
  return t.getFullYear() === i.getFullYear() && t.getMonth() === i.getMonth() && t.getDate() === i.getDate();
}
function N(t) {
  return String(t).padStart(2, "0");
}
const ee = ({
  inputValue: t,
  open: i,
  viewYear: a,
  viewMonth: s,
  selectedDate: b,
  today: u,
  min: l,
  max: g,
  disabled: x,
  placeholder: w,
  mask: j,
  showTime: D,
  showSeconds: M,
  showTimezone: k,
  timezoneOptions: f,
  timeParts: c,
  className: F,
  panelStyle: I,
  triggerRef: L,
  panelRef: B,
  inputRef: H,
  onInputChange: J,
  onTriggerClick: W,
  onPrevMonth: V,
  onNextMonth: E,
  onSelectDay: q,
  onTimeChange: h,
  onTimezoneChange: C
}) => {
  const z = X(a, s), G = !l || new Date(a, s, 0) >= l, K = !g || new Date(a, s + 1, 1) <= g;
  return /* @__PURE__ */ n(o, { variant: "ghost", padding: "none", radius: "none", className: d("relative inline-block w-full", F), children: [
    /* @__PURE__ */ n(
      o,
      {
        variant: "ghost",
        padding: "none",
        radius: "none",
        ref: L,
        className: d(
          "flex h-9 w-full items-center rounded-md border border-neutral-300 bg-neutral-50 text-sm transition-colors",
          "focus-within:ring-2 focus-within:ring-primary-500",
          x && "cursor-not-allowed opacity-50",
          i && "ring-2 ring-primary-500"
        ),
        children: [
          /* @__PURE__ */ r(
            m,
            {
              ref: H,
              type: "text",
              disabled: x,
              value: t,
              onChange: J,
              placeholder: w || j,
              "aria-label": w || "Fecha",
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
              disabled: x,
              onClick: W,
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
    i && Q(
      /* @__PURE__ */ n(
        o,
        {
          variant: "ghost",
          padding: "none",
          radius: "none",
          ref: B,
          role: "dialog",
          "aria-label": "Calendario",
          style: I,
          className: "z-50 w-80 max-w-[calc(100vw-16px)] rounded-lg border border-neutral-200 bg-white p-3 shadow-xl",
          children: [
            /* @__PURE__ */ n(o, { variant: "ghost", padding: "none", radius: "none", className: "mb-2 flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: V,
                  disabled: !G,
                  "aria-label": "Mes anterior",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ r("polyline", { points: "15 18 9 12 15 6" }) })
                }
              ),
              /* @__PURE__ */ n("span", { className: "text-sm font-semibold text-neutral-900", children: [
                U[s],
                " ",
                a
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: E,
                  disabled: !K,
                  "aria-label": "Mes siguiente",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ r("polyline", { points: "9 18 15 12 9 6" }) })
                }
              )
            ] }),
            /* @__PURE__ */ r(o, { variant: "ghost", padding: "none", radius: "none", className: "mb-1 grid grid-cols-7 text-center", children: R.map((e) => /* @__PURE__ */ r("span", { className: "text-xs font-medium text-neutral-400", children: e }, e)) }),
            /* @__PURE__ */ r(o, { variant: "ghost", padding: "none", radius: "none", className: "grid grid-cols-7 gap-y-0.5", children: z.map((e, S) => {
              if (!e) return /* @__PURE__ */ r("span", {}, S);
              const y = b ? A(e, b) : !1, P = A(e, u), v = l && e < l || g && e > g;
              return /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: () => !v && q(e),
                  disabled: !!v,
                  "aria-label": e.toLocaleDateString("es", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
                  "aria-pressed": y,
                  className: d(
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    v ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:bg-neutral-100",
                    y && "bg-primary-600 font-semibold text-white hover:bg-primary-700",
                    P && !y && "border border-primary-400 font-medium text-primary-600"
                  ),
                  children: e.getDate()
                },
                S
              );
            }) }),
            (D || k) && /* @__PURE__ */ n(o, { variant: "ghost", padding: "none", radius: "none", className: "mt-3 border-t border-neutral-200 pt-3", children: [
              D && /* @__PURE__ */ n(o, { variant: "ghost", padding: "none", radius: "none", className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ n(p, { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "HH",
                  /* @__PURE__ */ r(
                    m,
                    {
                      type: "number",
                      min: 0,
                      max: 23,
                      value: N(c.hour),
                      onChange: (e) => h("hour", e),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] }),
                /* @__PURE__ */ n(p, { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "mm",
                  /* @__PURE__ */ r(
                    m,
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: N(c.minute),
                      onChange: (e) => h("minute", e),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] }),
                M && /* @__PURE__ */ n(p, { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "ss",
                  /* @__PURE__ */ r(
                    m,
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: N(c.second),
                      onChange: (e) => h("second", e),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] })
              ] }),
              k && /* @__PURE__ */ n(p, { className: "mt-2 flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                "Timezone",
                f != null && f.length ? /* @__PURE__ */ n(
                  "select",
                  {
                    value: c.timezone ?? "",
                    onChange: (e) => C(e.target.value),
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
                    onChange: C,
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
  ee as DatePickerMoleculeView
};
//# sourceMappingURL=DatePickerMoleculeView.js.map
