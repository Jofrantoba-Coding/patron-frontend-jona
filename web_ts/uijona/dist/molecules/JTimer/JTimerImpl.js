import { jsx as F } from "react/jsx-runtime";
import { useState as $, useRef as T, useEffect as x, useMemo as O } from "react";
import { JTIMER_DEFAULTS as D } from "./InterJTimer.js";
import { JTimerView as b } from "./JTimerView.js";
function V(e, n, l) {
  return Math.min(l ?? Number.POSITIVE_INFINITY, Math.max(n, e));
}
function y(e) {
  return e.defaultValueMs !== void 0 ? e.defaultValueMs : e.mode === "stopwatch" ? 0 : e.durationMs ?? D.durationMs;
}
function H(e, n, l) {
  const a = Math.max(0, e), u = Math.floor(a / 36e5), i = Math.floor(a % 36e5 / 6e4), h = Math.floor(a % 6e4 / 1e3), r = a % 1e3;
  return { mode: n, status: l, hours: u, minutes: i, seconds: h, milliseconds: r, totalMilliseconds: a };
}
function S(e, n = 2) {
  return String(e).padStart(n, "0");
}
function _(e, n, l, a) {
  const u = a ? S(e.hours) : String(e.hours), i = S(e.minutes), h = S(e.seconds), r = S(e.milliseconds, 3), c = n || e.hours > 0 ? `${u}:${i}:${h}` : `${i}:${h}`;
  return l ? `${c}.${r}` : c;
}
const j = (e) => {
  const n = { ...D, ...e }, l = e.valueMs !== void 0, a = n.minMs, u = e.maxMs, i = V(e.valueMs ?? y(n), a, u), [h, r] = $(i), [c, g] = $(n.autoStart ? "running" : "idle"), v = T(null), R = T(!1), w = T(i), f = V(e.valueMs ?? h, a, u), d = n.mode;
  x(() => {
    l && r(V(e.valueMs ?? i, a, u));
  }, [l, e.valueMs, i, a, u]), x(() => {
    w.current = f;
  }, [f]);
  const k = (t, o = c) => {
    var m, M;
    const s = V(t, a, u);
    return w.current = s, l || r(s), (m = e.onChange) == null || m.call(e, s, o), (M = e.onTick) == null || M.call(e, s, o), s;
  }, N = () => {
    var t;
    if (!(R.current && !n.loop)) {
      if (R.current = !0, (t = e.onComplete) == null || t.call(e), n.loop) {
        const o = d === "countdown" ? n.durationMs : a;
        w.current = o, l || r(o), g("running"), v.current = Date.now();
        return;
      }
      g("completed"), v.current = null;
    }
  };
  x(() => {
    if (c !== "running") {
      v.current = null;
      return;
    }
    v.current = Date.now();
    const t = window.setInterval(() => {
      const o = Date.now(), s = o - (v.current ?? o);
      v.current = o;
      const m = w.current, M = d === "countdown" ? m - s : m + s, C = d === "countdown" ? M <= a : u !== void 0 && M >= u;
      k(C ? (d === "countdown" ? a : u) ?? M : M, C ? "completed" : "running"), C && N();
    }, Math.max(16, n.tickIntervalMs));
    return () => window.clearInterval(t);
  }, [c, d, a, u, n.tickIntervalMs, e.valueMs]);
  const I = O(
    () => H(f, d, c),
    [f, d, c]
  ), E = n.formatter ? n.formatter(I) : _(I, n.showHours, n.showMilliseconds, n.padHours), P = d === "countdown" ? n.durationMs : e.defaultValueMs ?? a, J = c === "idle" || c === "completed" && n.resetOnComplete;
  return /* @__PURE__ */ F(
    b,
    {
      ...n,
      status: c,
      context: I,
      displayValue: E,
      canStart: J,
      canPause: c === "running",
      canResume: c === "paused",
      onStartClick: () => {
        var t;
        R.current = !1, c === "completed" && n.resetOnComplete && k(P, "running"), g("running"), (t = e.onStart) == null || t.call(e, f);
      },
      onPauseClick: () => {
        var t;
        g("paused"), (t = e.onPause) == null || t.call(e, f);
      },
      onResumeClick: () => {
        var t;
        g("running"), (t = e.onResume) == null || t.call(e, f);
      },
      onResetClick: () => {
        var s, m;
        R.current = !1;
        const t = V(P, a, u);
        w.current = t, l || r(t);
        const o = n.autoStart ? "running" : "idle";
        g(o), (s = e.onReset) == null || s.call(e, t), (m = e.onChange) == null || m.call(e, t, o);
      }
    }
  );
};
j.displayName = "JTimer";
export {
  j as JTimerImpl
};
//# sourceMappingURL=JTimerImpl.js.map
