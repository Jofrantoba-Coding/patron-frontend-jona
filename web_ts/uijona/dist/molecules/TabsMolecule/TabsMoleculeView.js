import { jsx as a } from "react/jsx-runtime";
import { useContext as p, createContext as b } from "react";
import { cn as i } from "../../lib/cn.js";
const u = b({
  value: "",
  onChange: () => {
  },
  variant: "pill",
  orientation: "horizontal"
}), g = ({
  value: e,
  onChange: o,
  onTabFocus: n,
  onDisabledTabClick: t,
  variant: r = "pill",
  orientation: s = "horizontal",
  className: c,
  children: l
}) => /* @__PURE__ */ a(u.Provider, { value: { value: e, onChange: o ?? (() => {
}), onTabFocus: n, onDisabledTabClick: t, variant: r, orientation: s }, children: /* @__PURE__ */ a("div", { className: i("min-w-0", s === "vertical" ? "flex flex-col gap-4 sm:flex-row" : "flex flex-col gap-2", c), children: l }) }), h = ({ className: e, children: o, ...n }) => {
  const { variant: t, orientation: r } = p(u);
  return /* @__PURE__ */ a(
    "div",
    {
      role: "tablist",
      "aria-orientation": r,
      className: i("flex max-w-full min-w-0", r === "vertical" ? "flex-row overflow-x-auto sm:flex-col sm:overflow-visible" : "flex-row overflow-x-auto", t === "pill" ? "bg-neutral-100 rounded-md p-1 gap-1" : "border-b border-neutral-200 gap-0", e),
      ...n,
      children: o
    }
  );
}, y = ({ value: e, className: o, children: n, disabled: t, ...r }) => {
  const { value: s, onChange: c, onTabFocus: l, onDisabledTabClick: x, variant: f } = p(u), m = s === e;
  return /* @__PURE__ */ a(
    "button",
    {
      role: "tab",
      type: "button",
      "aria-selected": m,
      disabled: t,
      onClick: () => {
        t ? x == null || x(e) : c(e);
      },
      onFocus: () => l == null ? void 0 : l(e),
      className: i(
        "inline-flex max-w-full shrink-0 items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50",
        f === "pill" ? i("px-3 py-1.5 rounded", m ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700") : i("px-4 py-2 border-b-2 -mb-px rounded-none", m ? "border-primary-600 text-primary-600" : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"),
        o
      ),
      ...r,
      children: n
    }
  );
}, C = ({ value: e, className: o, children: n, ...t }) => {
  const { value: r } = p(u);
  return r !== e ? null : /* @__PURE__ */ a("div", { role: "tabpanel", tabIndex: 0, className: i("min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500", o), ...t, children: n });
};
export {
  C as TabsContentView,
  u as TabsContext,
  h as TabsListView,
  g as TabsMoleculeView,
  y as TabsTriggerView
};
//# sourceMappingURL=TabsMoleculeView.js.map
