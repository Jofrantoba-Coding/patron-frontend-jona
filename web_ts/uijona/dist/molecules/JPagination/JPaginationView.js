import { jsxs as b, jsx as l } from "react/jsx-runtime";
import { cn as p } from "../../lib/cn.js";
import { JButtonImpl as c } from "../../atoms/JButton/JButtonImpl.js";
function h(i, t, r) {
  const s = [];
  for (let e = Math.max(2, i - r); e <= Math.min(t - 1, i + r); e++) s.push(e);
  const n = [1];
  return s[0] > 2 && n.push("..."), n.push(...s), s[s.length - 1] < t - 1 && n.push("..."), t > 1 && n.push(t), n.filter((e, d, m) => m.indexOf(e) === d);
}
const a = () => /* @__PURE__ */ l("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: /* @__PURE__ */ l("polyline", { points: "15 18 9 12 15 6" }) }), y = () => /* @__PURE__ */ l("svg", { className: "w-4 h-4", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: /* @__PURE__ */ l("polyline", { points: "9 18 15 12 9 6" }) }), B = ({
  currentPage: i,
  totalPages: t,
  onPageChange: r,
  onPrevious: s,
  onNext: n,
  onFirstPageReached: e,
  onLastPageReached: d,
  siblingCount: m = 1,
  className: f
}) => {
  if (t <= 1) return null;
  const v = h(i, t, m), u = p("inline-flex items-center justify-center h-8 min-w-[2rem] px-2 rounded text-sm transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50");
  return /* @__PURE__ */ b("nav", { "aria-label": "JPagination", className: p("flex max-w-full items-center gap-1 overflow-x-auto", f), children: [
    /* @__PURE__ */ b(
      c,
      {
        variant: "ghost",
        type: "button",
        "aria-label": "Go to previous page",
        disabled: i <= 1,
        onClick: () => {
          if (i <= 1) {
            e == null || e();
            return;
          }
          s == null || s(i), r == null || r(i - 1);
        },
        className: p(u, "gap-1 pr-3 text-neutral-600 hover:bg-neutral-100 border border-neutral-200"),
        children: [
          /* @__PURE__ */ l(a, {}),
          /* @__PURE__ */ l("span", { className: "hidden sm:inline", children: "Previous" })
        ]
      }
    ),
    v.map((o, x) => o === "..." ? /* @__PURE__ */ l("span", { className: "shrink-0 px-2 text-neutral-400 select-none", children: "…" }, `e-${x}`) : /* @__PURE__ */ l(
      c,
      {
        variant: "ghost",
        type: "button",
        "aria-label": `Page ${o}`,
        "aria-current": o === i ? "page" : void 0,
        onClick: () => r == null ? void 0 : r(o),
        className: p(u, o === i ? "bg-primary-600 text-white border border-primary-600" : "text-neutral-700 hover:bg-neutral-100 border border-neutral-200"),
        children: o
      },
      o
    )),
    /* @__PURE__ */ b(
      c,
      {
        variant: "ghost",
        type: "button",
        "aria-label": "Go to next page",
        disabled: i >= t,
        onClick: () => {
          if (i >= t) {
            d == null || d();
            return;
          }
          n == null || n(i), r == null || r(i + 1);
        },
        className: p(u, "gap-1 pl-3 text-neutral-600 hover:bg-neutral-100 border border-neutral-200"),
        children: [
          /* @__PURE__ */ l("span", { className: "hidden sm:inline", children: "Next" }),
          /* @__PURE__ */ l(y, {})
        ]
      }
    )
  ] });
};
export {
  B as JPaginationView
};
//# sourceMappingURL=JPaginationView.js.map
