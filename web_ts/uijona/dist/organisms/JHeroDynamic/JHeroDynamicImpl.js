import { jsx as a } from "react/jsx-runtime";
import { useState as m, useEffect as f } from "react";
import { JHERO_DYNAMIC_DEFAULTS as l } from "./InterJHeroDynamic.js";
import { JHeroDynamicView as p } from "./JHeroDynamicView.js";
const u = (n) => {
  const { rotatingWords: t, intervalMs: r = l.intervalMs, ...o } = n, e = t.length > 0 ? t : [""], [i, d] = m(0);
  return f(() => {
    if (e.length <= 1 || typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const s = setInterval(() => {
      d((c) => (c + 1) % e.length);
    }, r);
    return () => clearInterval(s);
  }, [e.length, r]), /* @__PURE__ */ a(p, { ...o, word: e[i % e.length] });
};
u.displayName = "JHeroDynamic";
export {
  u as JHeroDynamicImpl
};
//# sourceMappingURL=JHeroDynamicImpl.js.map
