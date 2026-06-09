import { jsxs as a, jsx as e } from "react/jsx-runtime";
import { createPortal as y } from "react-dom";
import { cn as r } from "../../lib/cn.js";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
import { JButtonImpl as N } from "../../atoms/JButton/JButtonImpl.js";
const j = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl"
}, S = ({
  open: d,
  title: l,
  description: t,
  titleIcon: i,
  showCloseButton: o = !0,
  size: m = "md",
  className: c,
  titleBarClassName: u,
  contentClassName: x,
  footerClassName: p,
  children: g,
  footer: s,
  overlayRef: h,
  dialogRef: f,
  onOverlayClick: b,
  onCloseClick: v
}) => d ? y(
  /* @__PURE__ */ a(
    n,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      ref: h,
      role: "presentation",
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      children: [
        /* @__PURE__ */ e(
          n,
          {
            variant: "ghost",
            padding: "none",
            radius: "none",
            className: "absolute inset-0 bg-black/50",
            "aria-hidden": "true",
            onClick: b
          }
        ),
        /* @__PURE__ */ a(
          n,
          {
            layout: "border",
            variant: "ghost",
            padding: "none",
            radius: "none",
            ref: f,
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": l ? "jdialog-title" : void 0,
            "aria-describedby": t ? "jdialog-desc" : void 0,
            tabIndex: -1,
            onClick: (w) => w.stopPropagation(),
            className: r(
              "relative z-10 w-full rounded-lg bg-white shadow-xl focus:outline-none overflow-hidden",
              "max-h-[calc(100dvh-4rem)]",
              j[m],
              c
            ),
            children: [
              /* @__PURE__ */ a(
                "div",
                {
                  "data-panel-area": "top",
                  className: r(
                    "flex flex-row items-center bg-neutral-50 border-b border-neutral-200",
                    u
                  ),
                  children: [
                    i && /* @__PURE__ */ e("span", { className: "flex items-center pl-3 pr-1 py-3 shrink-0 text-neutral-500", children: i }),
                    /* @__PURE__ */ a(
                      "div",
                      {
                        className: r(
                          "flex min-w-0 flex-1 flex-col justify-center gap-0.5 py-3",
                          i ? "pl-1" : "pl-4",
                          o ? "pr-1" : "pr-4"
                        ),
                        children: [
                          l && /* @__PURE__ */ e(
                            "h2",
                            {
                              id: "jdialog-title",
                              className: "truncate text-sm font-semibold text-neutral-900 leading-tight",
                              children: l
                            }
                          ),
                          t && /* @__PURE__ */ e(
                            "p",
                            {
                              id: "jdialog-desc",
                              className: "break-words text-xs text-neutral-500 leading-snug",
                              children: t
                            }
                          )
                        ]
                      }
                    ),
                    o && /* @__PURE__ */ e("span", { className: "flex shrink-0 items-center px-2 py-2", children: /* @__PURE__ */ e(
                      N,
                      {
                        variant: "ghost",
                        size: "icon",
                        onClick: v,
                        "aria-label": "Close dialog",
                        className: "h-7 w-7 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200",
                        children: /* @__PURE__ */ a("svg", { className: "h-3.5 w-3.5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", "aria-hidden": "true", children: [
                          /* @__PURE__ */ e("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                          /* @__PURE__ */ e("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                        ] })
                      }
                    ) })
                  ]
                }
              ),
              /* @__PURE__ */ e(
                n,
                {
                  area: "center",
                  variant: "ghost",
                  padding: "none",
                  radius: "none",
                  className: r("overflow-auto p-4 text-sm text-neutral-700", x),
                  children: g
                }
              ),
              s && /* @__PURE__ */ e(
                n,
                {
                  area: "bottom",
                  layout: "flow",
                  variant: "ghost",
                  padding: "none",
                  radius: "none",
                  justifyContent: "end",
                  gap: "sm",
                  className: r(
                    "px-4 py-3 bg-neutral-50 border-t border-neutral-200",
                    p
                  ),
                  children: s
                }
              )
            ]
          }
        )
      ]
    }
  ),
  document.body
) : null;
export {
  S as JDialogView
};
//# sourceMappingURL=JDialogView.js.map
