import { jsx as l } from "react/jsx-runtime";
import { useContext as x, createContext as v } from "react";
import { cn as i } from "../../lib/cn.js";
import { JButtonImpl as b } from "../../atoms/JButton/JButtonImpl.js";
const u = v({
  value: "",
  onChange: () => {
  },
  variant: "pill",
  orientation: "horizontal"
}), y = ({
  value: e,
  onChange: o,
  onTabFocus: n,
  onDisabledTabClick: t,
  variant: r = "pill",
  orientation: s = "horizontal",
  className: c,
  children: a
}) => /* @__PURE__ */ l(
  u.Provider,
  {
    value: { value: e, onChange: o ?? (() => {
    }), onTabFocus: n, onDisabledTabClick: t, variant: r, orientation: s },
    children: /* @__PURE__ */ l(
      "div",
      {
        className: i(
          "min-w-0",
          s === "vertical" ? "flex flex-col gap-4 sm:flex-row" : "flex flex-col gap-2",
          c
        ),
        children: a
      }
    )
  }
), C = ({
  className: e,
  children: o,
  ...n
}) => {
  const { variant: t, orientation: r } = x(u);
  return /* @__PURE__ */ l(
    "div",
    {
      role: "tablist",
      "aria-orientation": r,
      className: i(
        "flex max-w-full min-w-0",
        r === "vertical" ? "flex-row overflow-x-auto sm:flex-col sm:overflow-visible" : "flex-row overflow-x-auto",
        t === "pill" ? "gap-1 rounded-md bg-neutral-100 p-1" : "gap-0 border-b border-neutral-200",
        e
      ),
      ...n,
      children: o
    }
  );
}, J = ({
  value: e,
  className: o,
  children: n,
  disabled: t,
  ...r
}) => {
  const { value: s, onChange: c, onTabFocus: a, onDisabledTabClick: m, variant: f } = x(u), p = s === e;
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
        "inline-flex max-w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        "disabled:pointer-events-none disabled:opacity-50",
        f === "pill" ? i(
          "rounded px-3 py-1.5",
          p ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"
        ) : i(
          "-mb-px rounded-none border-b-2 px-4 py-2",
          p ? "border-primary-600 text-primary-600" : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
        ),
        o
      ),
      ...r,
      children: n
    }
  );
}, V = ({
  value: e,
  className: o,
  children: n,
  ...t
}) => {
  const { value: r } = x(u);
  return r !== e ? null : /* @__PURE__ */ l(
    "div",
    {
      role: "tabpanel",
      tabIndex: 0,
      className: i(
        "min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        o
      ),
      ...t,
      children: n
    }
  );
};
export {
  V as JTabsContentView,
  u as JTabsContext,
  C as JTabsListView,
  J as JTabsTriggerView,
  y as JTabsView
};
//# sourceMappingURL=JTabsView.js.map
