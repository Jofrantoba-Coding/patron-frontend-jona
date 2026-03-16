import { jsx as l } from "react/jsx-runtime";
import { useContext as d, createContext as x } from "react";
import { cn as i } from "../../lib/cn.js";
const c = x({
  value: "",
  onChange: () => {
  },
  variant: "pill",
  orientation: "horizontal"
}), h = ({
  value: e,
  onChange: n,
  onTabFocus: o,
  onDisabledTabClick: t,
  variant: r = "pill",
  orientation: s = "horizontal",
  className: u,
  children: a
}) => /* @__PURE__ */ l(c.Provider, { value: { value: e, onChange: n ?? (() => {
}), onTabFocus: o, onDisabledTabClick: t, variant: r, orientation: s }, children: /* @__PURE__ */ l("div", { className: i(s === "vertical" ? "flex gap-4" : "flex flex-col gap-2", u), children: a }) }), y = ({ className: e, children: n, ...o }) => {
  const { variant: t, orientation: r } = d(c);
  return /* @__PURE__ */ l(
    "div",
    {
      role: "tablist",
      "aria-orientation": r,
      className: i("flex", r === "vertical" ? "flex-col" : "flex-row", t === "pill" ? "bg-neutral-100 rounded-md p-1 gap-1" : "border-b border-neutral-200 gap-0", e),
      ...o,
      children: n
    }
  );
}, w = ({ value: e, className: n, children: o, disabled: t, ...r }) => {
  const { value: s, onChange: u, onTabFocus: a, onDisabledTabClick: p, variant: v } = d(c), b = s === e;
  return /* @__PURE__ */ l(
    "button",
    {
      role: "tab",
      type: "button",
      "aria-selected": b,
      disabled: t,
      onClick: () => {
        t ? p == null || p(e) : u(e);
      },
      onFocus: () => a == null ? void 0 : a(e),
      className: i(
        "inline-flex items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
        v === "pill" ? i("px-3 py-1.5 rounded", b ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700") : i("px-4 py-2 border-b-2 -mb-px rounded-none", b ? "border-primary-600 text-primary-600" : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"),
        n
      ),
      ...r,
      children: o
    }
  );
}, C = ({ value: e, className: n, children: o, ...t }) => {
  const { value: r } = d(c);
  return r !== e ? null : /* @__PURE__ */ l("div", { role: "tabpanel", tabIndex: 0, className: i("focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500", n), ...t, children: o });
};
export {
  C as TabsContentView,
  c as TabsContext,
  y as TabsListView,
  h as TabsMoleculeView,
  w as TabsTriggerView
};
//# sourceMappingURL=TabsMoleculeView.js.map
