import { jsxs as s, jsx as a } from "react/jsx-runtime";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
import { JSkeletonImpl as e } from "../../atoms/JSkeleton/JSkeletonImpl.js";
const p = () => /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "flex items-center gap-3", children: [
  /* @__PURE__ */ a(e, { circle: !0, className: "w-10 h-10 shrink-0" }),
  /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-col gap-2 flex-1", children: [
    /* @__PURE__ */ a(e, { className: "h-3 w-32" }),
    /* @__PURE__ */ a(e, { className: "h-3 w-48" })
  ] })
] }), g = () => /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "rounded-lg border border-neutral-200 p-6 space-y-4", children: [
  /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "space-y-2", children: [
    /* @__PURE__ */ a(e, { className: "h-4 w-40" }),
    /* @__PURE__ */ a(e, { className: "h-3 w-64" })
  ] }),
  /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "space-y-2", children: [
    /* @__PURE__ */ a(e, { className: "h-3 w-full" }),
    /* @__PURE__ */ a(e, { className: "h-3 w-full" }),
    /* @__PURE__ */ a(e, { className: "h-3 w-3/4" })
  ] }),
  /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "flex gap-2 pt-2", children: [
    /* @__PURE__ */ a(e, { className: "h-8 w-20 rounded-md" }),
    /* @__PURE__ */ a(e, { className: "h-8 w-20 rounded-md" })
  ] })
] }), N = ({ rows: l = 4, cols: r = 4 }) => /* @__PURE__ */ a(n, { variant: "ghost", padding: "none", radius: "none", className: "space-y-2", children: Array.from({ length: l }).map((o, d) => /* @__PURE__ */ a(n, { variant: "ghost", padding: "none", radius: "none", className: "flex gap-4", children: Array.from({ length: r }).map((c, i) => /* @__PURE__ */ a(e, { className: "h-4 flex-1" }, i)) }, d)) }), u = ({ fields: l = 3 }) => /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "space-y-4", children: [
  Array.from({ length: l }).map((r, o) => /* @__PURE__ */ s(n, { variant: "ghost", padding: "none", radius: "none", className: "space-y-1.5", children: [
    /* @__PURE__ */ a(e, { className: "h-3 w-24" }),
    /* @__PURE__ */ a(e, { className: "h-9 w-full rounded-md" })
  ] }, o)),
  /* @__PURE__ */ a(e, { className: "h-9 w-28 rounded-md" })
] });
export {
  g as SkeletonCardView,
  u as SkeletonFormView,
  N as SkeletonTableRowsView,
  p as SkeletonUserRowView
};
//# sourceMappingURL=JSkeletonPresetsView.js.map
