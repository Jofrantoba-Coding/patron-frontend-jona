import { jsx as l } from "react/jsx-runtime";
import { cn as r } from "../../lib/cn.js";
const p = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7"
}, v = ({
  value: o,
  max: s,
  readOnly: i,
  size: n,
  hovered: t,
  className: a,
  onStarClick: c,
  onStarEnter: u,
  onStarLeave: f
}) => {
  const d = t ?? o;
  return (
    // span nativo: evita los CSS variables de JPanel (flex-direction:column)
    // que rompían el layout horizontal de las estrellas
    /* @__PURE__ */ l(
      "span",
      {
        role: i ? "img" : "group",
        "aria-label": i ? `Calificación: ${o} de ${s}` : `Selecciona calificación de ${s}`,
        className: r("inline-flex items-center gap-0.5", a),
        children: Array.from({ length: s }, (g, h) => {
          const e = h + 1, m = e <= d;
          return /* @__PURE__ */ l(
            "button",
            {
              type: "button",
              "aria-label": `${e} estrella${e !== 1 ? "s" : ""}`,
              "aria-pressed": e === o,
              disabled: i,
              onClick: () => c(e),
              onMouseEnter: () => u(e),
              onMouseLeave: f,
              className: r(
                "rounded-sm transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
                i ? "pointer-events-none cursor-default" : "cursor-pointer",
                p[n]
              ),
              children: /* @__PURE__ */ l(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  className: r(
                    "h-full w-full transition-colors duration-150",
                    m ? "fill-yellow-400 stroke-yellow-400" : "fill-neutral-200 stroke-neutral-300"
                  ),
                  children: /* @__PURE__ */ l(
                    "path",
                    {
                      strokeWidth: "1.5",
                      d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    }
                  )
                }
              )
            },
            e
          );
        })
      }
    )
  );
};
export {
  v as JRatingView
};
//# sourceMappingURL=JRatingView.js.map
