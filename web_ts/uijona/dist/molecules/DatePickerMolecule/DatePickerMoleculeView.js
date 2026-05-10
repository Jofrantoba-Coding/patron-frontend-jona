import { jsxs as t, jsx as r } from "react/jsx-runtime";
import { createPortal as I } from "react-dom";
import { cn as c } from "../../lib/cn.js";
const K = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"], Q = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
function R(l, i) {
  const a = new Date(l, i, 1), o = new Date(l, i + 1, 0), d = a.getDay(), s = Array(d).fill(null);
  for (let n = 1; n <= o.getDate(); n += 1) s.push(new Date(l, i, n));
  for (; s.length % 7 !== 0; ) s.push(null);
  return s;
}
function k(l, i) {
  return l.getFullYear() === i.getFullYear() && l.getMonth() === i.getMonth() && l.getDate() === i.getDate();
}
function h(l) {
  return String(l).padStart(2, "0");
}
const Z = ({
  inputValue: l,
  open: i,
  viewYear: a,
  viewMonth: o,
  selectedDate: d,
  today: s,
  min: n,
  max: m,
  disabled: x,
  placeholder: v,
  mask: C,
  showTime: y,
  showSeconds: S,
  showTimezone: N,
  timezoneOptions: b,
  timeParts: u,
  className: j,
  panelStyle: M,
  triggerRef: A,
  panelRef: F,
  inputRef: B,
  onInputChange: H,
  onTriggerClick: J,
  onPrevMonth: L,
  onNextMonth: W,
  onSelectDay: V,
  onTimeChange: f,
  onTimezoneChange: w
}) => {
  const E = R(a, o), q = !n || new Date(a, o, 0) >= n, z = !m || new Date(a, o + 1, 1) <= m;
  return /* @__PURE__ */ t("div", { className: c("relative inline-block w-full", j), children: [
    /* @__PURE__ */ t(
      "div",
      {
        ref: A,
        className: c(
          "flex h-9 w-full items-center rounded-md border border-neutral-300 bg-neutral-50 text-sm transition-colors",
          "focus-within:ring-2 focus-within:ring-primary-500",
          x && "cursor-not-allowed opacity-50",
          i && "ring-2 ring-primary-500"
        ),
        children: [
          /* @__PURE__ */ r(
            "input",
            {
              ref: B,
              type: "text",
              disabled: x,
              value: l,
              onChange: (e) => H(e.target.value),
              placeholder: v || C,
              "aria-label": v || "Fecha",
              className: c(
                "min-w-0 flex-1 rounded-l-md bg-transparent px-3 py-1 text-sm text-neutral-900 outline-none",
                "placeholder:text-neutral-400 disabled:cursor-not-allowed"
              )
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: x,
              onClick: J,
              "aria-label": "Abrir calendario",
              "aria-haspopup": "dialog",
              "aria-expanded": i,
              className: c(
                "flex h-full w-9 shrink-0 items-center justify-center rounded-r-md text-neutral-500 transition-colors",
                "hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                "disabled:cursor-not-allowed disabled:opacity-50"
              ),
              children: /* @__PURE__ */ t("svg", { className: "h-4 w-4 shrink-0", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: [
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
    i && I(
      /* @__PURE__ */ t(
        "div",
        {
          ref: F,
          role: "dialog",
          "aria-label": "Calendario",
          style: M,
          className: "z-50 w-80 max-w-[calc(100vw-16px)] rounded-lg border border-neutral-200 bg-white p-3 shadow-xl",
          children: [
            /* @__PURE__ */ t("div", { className: "mb-2 flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: L,
                  disabled: !q,
                  "aria-label": "Mes anterior",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ r("polyline", { points: "15 18 9 12 15 6" }) })
                }
              ),
              /* @__PURE__ */ t("span", { className: "text-sm font-semibold text-neutral-900", children: [
                Q[o],
                " ",
                a
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: W,
                  disabled: !z,
                  "aria-label": "Mes siguiente",
                  className: "flex h-7 w-7 items-center justify-center rounded hover:bg-neutral-100 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  children: /* @__PURE__ */ r("svg", { className: "h-4 w-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, "aria-hidden": "true", children: /* @__PURE__ */ r("polyline", { points: "9 18 15 12 9 6" }) })
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { className: "mb-1 grid grid-cols-7 text-center", children: K.map((e) => /* @__PURE__ */ r("span", { className: "text-xs font-medium text-neutral-400", children: e }, e)) }),
            /* @__PURE__ */ r("div", { className: "grid grid-cols-7 gap-y-0.5", children: E.map((e, D) => {
              if (!e) return /* @__PURE__ */ r("span", {}, D);
              const g = d ? k(e, d) : !1, G = k(e, s), p = n && e < n || m && e > m;
              return /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: () => !p && V(e),
                  disabled: !!p,
                  "aria-label": e.toLocaleDateString("es", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
                  "aria-pressed": g,
                  className: c(
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    p ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:bg-neutral-100",
                    g && "bg-primary-600 font-semibold text-white hover:bg-primary-700",
                    G && !g && "border border-primary-400 font-medium text-primary-600"
                  ),
                  children: e.getDate()
                },
                D
              );
            }) }),
            (y || N) && /* @__PURE__ */ t("div", { className: "mt-3 border-t border-neutral-200 pt-3", children: [
              y && /* @__PURE__ */ t("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ t("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "HH",
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      max: 23,
                      value: h(u.hour),
                      onChange: (e) => f("hour", e.target.value),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] }),
                /* @__PURE__ */ t("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "mm",
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: h(u.minute),
                      onChange: (e) => f("minute", e.target.value),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] }),
                S && /* @__PURE__ */ t("label", { className: "flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                  "ss",
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "number",
                      min: 0,
                      max: 59,
                      value: h(u.second),
                      onChange: (e) => f("second", e.target.value),
                      className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    }
                  )
                ] })
              ] }),
              N && /* @__PURE__ */ t("label", { className: "mt-2 flex flex-col gap-1 text-xs font-medium text-neutral-600", children: [
                "Timezone",
                b != null && b.length ? /* @__PURE__ */ t(
                  "select",
                  {
                    value: u.timezone ?? "",
                    onChange: (e) => w(e.target.value),
                    className: "h-8 rounded-md border border-neutral-300 px-2 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                    children: [
                      !u.timezone && /* @__PURE__ */ r("option", { value: "", children: "Seleccionar timezone" }),
                      b.map((e) => /* @__PURE__ */ r("option", { value: e, children: e }, e))
                    ]
                  }
                ) : /* @__PURE__ */ r(
                  "input",
                  {
                    type: "text",
                    value: u.timezone ?? "",
                    onChange: (e) => w(e.target.value),
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
  Z as DatePickerMoleculeView
};
//# sourceMappingURL=DatePickerMoleculeView.js.map
