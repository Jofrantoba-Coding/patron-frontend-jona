import { jsxs as s, jsx as t } from "react/jsx-runtime";
import { cn as e } from "../../lib/cn.js";
const I = {
  plain: "bg-transparent",
  card: "rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5",
  inline: "inline-flex items-center gap-3"
}, o = {
  sm: {
    display: "text-xl",
    label: "text-xs",
    button: "h-8 px-3 text-xs"
  },
  md: {
    display: "text-3xl",
    label: "text-sm",
    button: "h-9 px-3 text-sm"
  },
  lg: {
    display: "text-5xl",
    label: "text-base",
    button: "h-10 px-4 text-sm"
  }
}, d = {
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
}, z = ({
  status: i,
  context: c,
  displayValue: b,
  canStart: p,
  canPause: x,
  canResume: f,
  onStartClick: g,
  onPauseClick: h,
  onResumeClick: v,
  onResetClick: _,
  mode: H,
  valueMs: P,
  defaultValueMs: S,
  durationMs: V,
  minMs: j,
  maxMs: O,
  autoStart: q,
  tickIntervalMs: A,
  resetOnComplete: B,
  loop: D,
  showHours: E,
  showMilliseconds: F,
  padHours: G,
  formatter: J,
  onChange: K,
  onTick: Q,
  onStart: U,
  onPause: W,
  onResume: X,
  onReset: Y,
  onComplete: Z,
  controls: w = !0,
  label: a,
  completedLabel: l,
  startLabel: y = "Iniciar",
  pauseLabel: C = "Pausar",
  resumeLabel: M = "Continuar",
  resetLabel: k = "Reiniciar",
  variant: u = "card",
  size: n = "md",
  tone: m = "neutral",
  className: N,
  ...R
}) => {
  const r = u === "inline";
  return /* @__PURE__ */ s(
    "div",
    {
      className: e(
        "min-w-0",
        I[u],
        !r && "flex flex-col gap-3",
        N
      ),
      "data-status": i,
      "data-mode": c.mode,
      ...R,
      children: [
        (a || l) && !r && /* @__PURE__ */ s("div", { className: "min-w-0", children: [
          a && /* @__PURE__ */ t("p", { className: e("break-words font-medium text-neutral-500", o[n].label), children: a }),
          i === "completed" && l && /* @__PURE__ */ t("p", { className: e("mt-1 break-words font-medium", o[n].label, d[m]), children: l })
        ] }),
        /* @__PURE__ */ s("div", { className: e("min-w-0", r && "flex items-center gap-3"), children: [
          /* @__PURE__ */ t(
            "output",
            {
              "aria-live": i === "running" ? "off" : "polite",
              "aria-label": "Timer",
              className: e(
                "block break-words font-mono font-semibold leading-none tabular-nums",
                o[n].display,
                d[m]
              ),
              children: b
            }
          ),
          /* @__PURE__ */ t("span", { className: "sr-only", children: T[i] }),
          w && /* @__PURE__ */ s("div", { className: e("flex flex-wrap items-center gap-2", r ? "ml-1" : "mt-3"), children: [
            p && /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: g,
                className: e(
                  "rounded-md bg-primary-600 font-medium text-white transition-colors hover:bg-primary-700",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  o[n].button
                ),
                children: y
              }
            ),
            x && /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: h,
                className: e(
                  "rounded-md border border-neutral-300 bg-white font-medium text-neutral-700 transition-colors hover:bg-neutral-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  o[n].button
                ),
                children: C
              }
            ),
            f && /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: v,
                className: e(
                  "rounded-md bg-primary-600 font-medium text-white transition-colors hover:bg-primary-700",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  o[n].button
                ),
                children: M
              }
            ),
            /* @__PURE__ */ t(
              "button",
              {
                type: "button",
                onClick: _,
                className: e(
                  "rounded-md border border-neutral-300 bg-white font-medium text-neutral-700 transition-colors hover:bg-neutral-50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                  o[n].button
                ),
                children: k
              }
            )
          ] })
        ] })
      ]
    }
  );
};
export {
  z as TimerMoleculeView
};
//# sourceMappingURL=TimerMoleculeView.js.map
