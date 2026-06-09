import { jsxs as s, jsx as n } from "react/jsx-runtime";
import { cn as e } from "../../lib/cn.js";
import { JPanelImpl as a } from "../../atoms/JPanel/JPanelImpl.js";
const P = {
  plain: "bg-transparent",
  card: "rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5",
  inline: "inline-flex items-center gap-3"
}, o = {
  sm: { display: "text-xl", label: "text-xs", button: "h-8 px-3 text-xs" },
  md: { display: "text-3xl", label: "text-sm", button: "h-9 px-3 text-sm" },
  lg: { display: "text-5xl", label: "text-base", button: "h-10 px-4 text-sm" }
}, c = {
  neutral: "text-neutral-900",
  success: "text-success-700",
  warning: "text-warning-700",
  danger: "text-danger-700",
  info: "text-primary-700"
}, T = {
  idle: "Idle",
  running: "Running",
  paused: "Paused",
  completed: "Completed"
}, ne = ({
  status: r,
  context: p,
  displayValue: b,
  canStart: g,
  canPause: x,
  canResume: f,
  onStartClick: h,
  onPauseClick: v,
  onResumeClick: _,
  onResetClick: w,
  mode: H,
  valueMs: S,
  defaultValueMs: V,
  durationMs: j,
  minMs: J,
  maxMs: O,
  autoStart: q,
  tickIntervalMs: A,
  resetOnComplete: B,
  loop: D,
  showHours: E,
  showMilliseconds: F,
  padHours: G,
  formatter: K,
  onChange: Q,
  onTick: U,
  onStart: W,
  onPause: X,
  onResume: Y,
  onReset: Z,
  onComplete: $,
  controls: y = !0,
  label: l,
  completedLabel: u,
  startLabel: C = "Iniciar",
  pauseLabel: M = "Pausar",
  resumeLabel: k = "Continuar",
  resetLabel: N = "Reiniciar",
  variant: d = "card",
  size: t = "md",
  tone: m = "neutral",
  className: I,
  ...R
}) => {
  const i = d === "inline";
  return /* @__PURE__ */ s(
    a,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      className: e("min-w-0", P[d], !i && "flex flex-col gap-3", I),
      "data-status": r,
      "data-mode": p.mode,
      ...R,
      children: [
        (l || u) && !i && /* @__PURE__ */ s(a, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0", children: [
          l && /* @__PURE__ */ n("p", { className: e("break-words font-medium text-neutral-500", o[t].label), children: l }),
          r === "completed" && u && /* @__PURE__ */ n("p", { className: e("mt-1 break-words font-medium", o[t].label, c[m]), children: u })
        ] }),
        /* @__PURE__ */ s(a, { variant: "ghost", padding: "none", radius: "none", className: e("min-w-0", i && "flex items-center gap-3"), children: [
          /* @__PURE__ */ n(
            "output",
            {
              "aria-live": r === "running" ? "off" : "polite",
              "aria-label": "Timer",
              className: e(
                "block break-words font-mono font-semibold leading-none tabular-nums",
                o[t].display,
                c[m]
              ),
              children: b
            }
          ),
          /* @__PURE__ */ n("span", { className: "sr-only", children: T[r] }),
          y && /* @__PURE__ */ s(
            a,
            {
              variant: "ghost",
              padding: "none",
              radius: "none",
              className: e("flex flex-wrap items-center gap-2", i ? "ml-1" : "mt-3"),
              children: [
                g && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: h,
                    className: e(
                      "rounded-md bg-primary-600 font-medium text-white transition-colors hover:bg-primary-700",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                      o[t].button
                    ),
                    children: C
                  }
                ),
                x && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: v,
                    className: e(
                      "rounded-md border border-neutral-300 bg-white font-medium text-neutral-700 transition-colors hover:bg-neutral-50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                      o[t].button
                    ),
                    children: M
                  }
                ),
                f && /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: _,
                    className: e(
                      "rounded-md bg-primary-600 font-medium text-white transition-colors hover:bg-primary-700",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                      o[t].button
                    ),
                    children: k
                  }
                ),
                /* @__PURE__ */ n(
                  "button",
                  {
                    type: "button",
                    onClick: w,
                    className: e(
                      "rounded-md border border-neutral-300 bg-white font-medium text-neutral-700 transition-colors hover:bg-neutral-50",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                      o[t].button
                    ),
                    children: N
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
};
export {
  ne as JTimerView
};
//# sourceMappingURL=JTimerView.js.map
