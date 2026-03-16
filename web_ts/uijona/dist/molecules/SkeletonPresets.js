import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { SkeletonAtom as a } from "../atoms/SkeletonAtom.js";
const i = () => /* @__PURE__ */ s("div", { className: "flex items-center gap-3", children: [
  /* @__PURE__ */ e(a, { circle: !0, className: "w-10 h-10 shrink-0" }),
  /* @__PURE__ */ s("div", { className: "flex flex-col gap-2 flex-1", children: [
    /* @__PURE__ */ e(a, { className: "h-3 w-32" }),
    /* @__PURE__ */ e(a, { className: "h-3 w-48" })
  ] })
] }), N = () => /* @__PURE__ */ s("div", { className: "rounded-lg border border-neutral-200 p-6 space-y-4", children: [
  /* @__PURE__ */ s("div", { className: "space-y-2", children: [
    /* @__PURE__ */ e(a, { className: "h-4 w-40" }),
    /* @__PURE__ */ e(a, { className: "h-3 w-64" })
  ] }),
  /* @__PURE__ */ s("div", { className: "space-y-2", children: [
    /* @__PURE__ */ e(a, { className: "h-3 w-full" }),
    /* @__PURE__ */ e(a, { className: "h-3 w-full" }),
    /* @__PURE__ */ e(a, { className: "h-3 w-3/4" })
  ] }),
  /* @__PURE__ */ s("div", { className: "flex gap-2 pt-2", children: [
    /* @__PURE__ */ e(a, { className: "h-8 w-20 rounded-md" }),
    /* @__PURE__ */ e(a, { className: "h-8 w-20 rounded-md" })
  ] })
] }), t = ({ rows: l = 4, cols: c = 4 }) => /* @__PURE__ */ e("div", { className: "space-y-2", children: Array.from({ length: l }).map((m, r) => /* @__PURE__ */ e("div", { className: "flex gap-4", children: Array.from({ length: c }).map((n, d) => /* @__PURE__ */ e(a, { className: "h-4 flex-1" }, d)) }, r)) }), p = ({ fields: l = 3 }) => /* @__PURE__ */ s("div", { className: "space-y-4", children: [
  Array.from({ length: l }).map((c, m) => /* @__PURE__ */ s("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ e(a, { className: "h-3 w-24" }),
    /* @__PURE__ */ e(a, { className: "h-9 w-full rounded-md" })
  ] }, m)),
  /* @__PURE__ */ e(a, { className: "h-9 w-28 rounded-md" })
] });
export {
  N as SkeletonCard,
  p as SkeletonForm,
  t as SkeletonTableRows,
  i as SkeletonUserRow
};
//# sourceMappingURL=SkeletonPresets.js.map
