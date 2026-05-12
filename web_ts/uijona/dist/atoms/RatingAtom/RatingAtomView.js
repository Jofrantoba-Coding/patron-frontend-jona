import { jsx as o } from "react/jsx-runtime";
import { cn as n } from "../../lib/cn.js";
import { PanelAtomImpl as p } from "../PanelAtom/PanelAtomImpl.js";
const g = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7"
}, k = ({
  value: l,
  max: r,
  readOnly: i,
  size: s,
  hovered: t,
  className: a,
  onStarClick: c,
  onStarEnter: u,
  onStarLeave: d
}) => {
  const f = t ?? l;
  return /* @__PURE__ */ o(
    p,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      role: i ? "img" : "group",
      "aria-label": i ? `Calificación: ${l} de ${r}` : `Selecciona calificación de ${r}`,
      className: n("inline-flex items-center gap-0.5", a),
      children: Array.from({ length: r }, (b, m) => {
        const e = m + 1, h = e <= f;
        return /* @__PURE__ */ o(
          "button",
          {
            type: "button",
            "aria-label": `${e} estrella${e !== 1 ? "s" : ""}`,
            "aria-pressed": e === l,
            disabled: i,
            onClick: () => c(e),
            onMouseEnter: () => u(e),
            onMouseLeave: d,
            className: n(
              "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-sm",
              i ? "cursor-default pointer-events-none" : "cursor-pointer",
              g[s]
            ),
            children: /* @__PURE__ */ o(
              "svg",
              {
                viewBox: "0 0 24 24",
                "aria-hidden": "true",
                className: n(
                  "w-full h-full transition-colors duration-150",
                  h ? "fill-yellow-400 stroke-yellow-400" : "fill-neutral-200 stroke-neutral-300"
                ),
                children: /* @__PURE__ */ o("path", { strokeWidth: "1.5", d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" })
              }
            )
          },
          e
        );
      })
    }
  );
};
export {
  k as RatingAtomView
};
//# sourceMappingURL=RatingAtomView.js.map
