import { jsx as l } from "react/jsx-runtime";
import { useContext as d, createContext as v } from "react";
import { cn as i } from "../../lib/cn.js";
import { JPanelImpl as f } from "../../atoms/JPanel/JPanelImpl.js";
import { ButtonAtomImpl as b } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const u = v({
  value: "",
  onChange: () => {
  },
  variant: "pill",
  orientation: "horizontal"
}), V = ({
  value: e,
  onChange: r,
  onTabFocus: o,
  onDisabledTabClick: t,
  variant: n = "pill",
  orientation: s = "horizontal",
  className: c,
  children: a
}) => /* @__PURE__ */ l(u.Provider, { value: { value: e, onChange: r ?? (() => {
}), onTabFocus: o, onDisabledTabClick: t, variant: n, orientation: s }, children: /* @__PURE__ */ l(f, { variant: "ghost", padding: "none", radius: "none", className: i("min-w-0", s === "vertical" ? "flex flex-col gap-4 sm:flex-row" : "flex flex-col gap-2", c), children: a }) }), N = ({ className: e, children: r, ...o }) => {
  const { variant: t, orientation: n } = d(u);
  return /* @__PURE__ */ l(
    f,
    {
      variant: "ghost",
      padding: "none",
      radius: "none",
      role: "tablist",
      "aria-orientation": n,
      className: i("flex max-w-full min-w-0", n === "vertical" ? "flex-row overflow-x-auto sm:flex-col sm:overflow-visible" : "flex-row overflow-x-auto", t === "pill" ? "bg-neutral-100 rounded-md p-1 gap-1" : "border-b border-neutral-200 gap-0", e),
      ...o,
      children: r
    }
  );
}, T = ({ value: e, className: r, children: o, disabled: t, ...n }) => {
  const { value: s, onChange: c, onTabFocus: a, onDisabledTabClick: m, variant: x } = d(u), p = s === e;
  return /* @__PURE__ */ l(
    b,
    {
      variant: "ghost",
      role: "tab",
      type: "button",
      "aria-selected": p,
      disabled: t,
      onClick: () => {
        t ? m == null || m(e) : c(e);
      },
      onFocus: () => a == null ? void 0 : a(e),
      className: i(
        "inline-flex max-w-full shrink-0 items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
        x === "pill" ? i("px-3 py-1.5 rounded", p ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700") : i("px-4 py-2 border-b-2 -mb-px rounded-none", p ? "border-primary-600 text-primary-600" : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"),
        r
      ),
      ...n,
      children: o
    }
  );
}, I = ({ value: e, className: r, children: o, ...t }) => {
  const { value: n } = d(u);
  return n !== e ? null : /* @__PURE__ */ l(f, { variant: "ghost", padding: "none", radius: "none", role: "tabpanel", tabIndex: 0, className: i("min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500", r), ...t, children: o });
};
export {
  I as TabsContentView,
  u as TabsContext,
  N as TabsListView,
  V as TabsMoleculeView,
  T as TabsTriggerView
};
//# sourceMappingURL=TabsMoleculeView.js.map
