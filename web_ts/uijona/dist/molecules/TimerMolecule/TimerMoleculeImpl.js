import { jsx as L } from "react/jsx-runtime";
import { useState as $, useRef as T, useEffect as k, useMemo as _ } from "react";
import { TIMER_MOLECULE_DEFAULTS as D } from "./InterTimerMolecule.js";
import { TimerMoleculeView as b } from "./TimerMoleculeView.js";
function V(e, n, o) {
  const t = o ?? Number.POSITIVE_INFINITY;
  return Math.min(t, Math.max(n, e));
}
function y(e) {
  return e.defaultValueMs !== void 0 ? e.defaultValueMs : e.mode === "stopwatch" ? 0 : e.durationMs ?? D.durationMs;
}
function H(e, n, o) {
  const t = Math.max(0, e), a = Math.floor(t / 36e5), i = Math.floor(t % 36e5 / 6e4), M = Math.floor(t % 6e4 / 1e3), r = t % 1e3;
  return { mode: n, status: o, hours: a, minutes: i, seconds: M, milliseconds: r, totalMilliseconds: t };
}
function S(e, n = 2) {
  return String(e).padStart(n, "0");
}
function U(e, n, o, t) {
  const a = t ? S(e.hours) : String(e.hours), i = S(e.minutes), M = S(e.seconds), r = S(e.milliseconds, 3), c = n || e.hours > 0 ? `${a}:${i}:${M}` : `${i}:${M}`;
  return o ? `${c}.${r}` : c;
}
const j = (e) => {
  const n = { ...D, ...e }, o = e.valueMs !== void 0, t = n.minMs, a = e.maxMs, i = V(e.valueMs ?? y(n), t, a), [M, r] = $(i), [c, h] = $(n.autoStart ? "running" : "idle"), g = T(null), R = T(!1), v = T(i), m = V(e.valueMs ?? M, t, a), d = n.mode;
  k(() => {
    o && r(V(e.valueMs ?? i, t, a));
  }, [o, e.valueMs, i, t, a]), k(() => {
    v.current = m;
  }, [m]);
  const x = (u, l = c) => {
    var w, f;
    const s = V(u, t, a);
    return v.current = s, o || r(s), (w = e.onChange) == null || w.call(e, s, l), (f = e.onTick) == null || f.call(e, s, l), s;
  }, E = () => {
    var u;
    if (!(R.current && !n.loop)) {
      if (R.current = !0, (u = e.onComplete) == null || u.call(e), n.loop) {
        const l = d === "countdown" ? n.durationMs : t;
        v.current = l, o || r(l), h("running"), g.current = Date.now();
        return;
      }
      h("completed"), g.current = null;
    }
  };
  k(() => {
    if (c !== "running") {
      g.current = null;
      return;
    }
    g.current = Date.now();
    const u = window.setInterval(() => {
      const l = Date.now(), s = l - (g.current ?? l);
      g.current = l;
      const w = v.current, f = d === "countdown" ? w - s : w + s, F = d === "countdown" ? t : a, I = d === "countdown" ? f <= t : a !== void 0 && f >= a;
      x(I ? F ?? f : f, I ? "completed" : "running"), I && E();
    }, Math.max(16, n.tickIntervalMs));
    return () => window.clearInterval(u);
  }, [c, d, t, a, n.tickIntervalMs, e.valueMs]);
  const C = _(
    () => H(m, d, c),
    [m, d, c]
  ), N = n.formatter ? n.formatter(C) : U(C, n.showHours, n.showMilliseconds, n.padHours), P = d === "countdown" ? n.durationMs : e.defaultValueMs ?? t, O = c === "idle" || c === "completed" && n.resetOnComplete;
  return /* @__PURE__ */ L(
    b,
    {
      ...n,
      status: c,
      context: C,
      displayValue: N,
      canStart: O,
      canPause: c === "running",
      canResume: c === "paused",
      onStartClick: () => {
        var u;
        R.current = !1, c === "completed" && n.resetOnComplete && x(P, "running"), h("running"), (u = e.onStart) == null || u.call(e, m);
      },
      onPauseClick: () => {
        var u;
        h("paused"), (u = e.onPause) == null || u.call(e, m);
      },
      onResumeClick: () => {
        var u;
        h("running"), (u = e.onResume) == null || u.call(e, m);
      },
      onResetClick: () => {
        var l, s;
        R.current = !1;
        const u = V(P, t, a);
        v.current = u, o || r(u), h(n.autoStart ? "running" : "idle"), (l = e.onReset) == null || l.call(e, u), (s = e.onChange) == null || s.call(e, u, n.autoStart ? "running" : "idle");
      }
    }
  );
};
j.displayName = "TimerMolecule";
export {
  j as TimerMoleculeImpl
};
//# sourceMappingURL=TimerMoleculeImpl.js.map
