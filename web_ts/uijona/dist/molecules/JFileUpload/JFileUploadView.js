import { jsxs as n, jsx as e } from "react/jsx-runtime";
import { cn as s } from "../../lib/cn.js";
import { JPanelImpl as u } from "../../atoms/JPanel/JPanelImpl.js";
import { JLabelImpl as B } from "../../atoms/JLabel/JLabelImpl.js";
import { JTextBoxImpl as $ } from "../../atoms/JTextBox/JTextBoxImpl.js";
const j = () => /* @__PURE__ */ n("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", "aria-hidden": "true", children: [
  /* @__PURE__ */ e("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ e("path", { d: "m17 8-5-5-5 5" }),
  /* @__PURE__ */ e("path", { d: "M12 3v12" })
] }), M = (r) => r < 1024 ? `${r} B` : r < 1024 * 1024 ? `${(r / 1024).toFixed(1)} KB` : `${(r / 1024 / 1024).toFixed(1)} MB`, z = ({
  selectedFiles: r,
  inputId: i,
  isDragging: x,
  label: a,
  description: m,
  helperText: d,
  maxFiles: o,
  dropzoneClassName: h,
  fileListClassName: f,
  className: g,
  onInputChange: v,
  onDropZoneDragOver: b,
  onDropZoneDragLeave: w,
  onDropZoneDrop: N,
  onRemoveClick: y,
  disabled: c,
  onBlur: p,
  ...k
}) => /* @__PURE__ */ n(u, { variant: "ghost", padding: "none", radius: "none", className: s("flex w-full min-w-0 flex-col gap-3", g), children: [
  /* @__PURE__ */ n(
    B,
    {
      variant: "label",
      htmlFor: i,
      onDragOver: b,
      onDragLeave: w,
      onDrop: N,
      className: s(
        "flex min-h-36 w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-white px-4 py-6 text-center transition-colors",
        x ? "border-primary-500 bg-primary-50" : "border-neutral-300 hover:border-primary-400 hover:bg-neutral-50",
        c && "pointer-events-none opacity-50",
        h
      ),
      children: [
        /* @__PURE__ */ e("span", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600", children: /* @__PURE__ */ e(j, {}) }),
        /* @__PURE__ */ e("span", { className: "break-words text-sm font-medium text-neutral-900", children: a }),
        m && /* @__PURE__ */ e("span", { className: "max-w-sm break-words text-sm text-neutral-500", children: m }),
        o && /* @__PURE__ */ n("span", { className: "text-xs text-neutral-400", children: [
          "Max ",
          o,
          " file",
          o === 1 ? "" : "s"
        ] }),
        /* @__PURE__ */ e(
          $,
          {
            ...k,
            id: i,
            type: "file",
            disabled: c,
            "aria-label": typeof a == "string" ? a : "Upload files",
            onChange: (t, l) => v(l),
            onBlur: p ? (t, l) => p(l) : void 0,
            className: "sr-only"
          }
        )
      ]
    }
  ),
  d && /* @__PURE__ */ e("p", { className: "break-words text-xs text-neutral-500", children: d }),
  r.length > 0 && /* @__PURE__ */ e("ul", { className: s("flex min-w-0 flex-col gap-2", f), children: r.map((t) => /* @__PURE__ */ n(
    "li",
    {
      className: "flex min-w-0 items-center justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2",
      children: [
        /* @__PURE__ */ n(u, { variant: "ghost", padding: "none", radius: "none", className: "min-w-0", children: [
          /* @__PURE__ */ e("p", { className: "truncate text-sm font-medium text-neutral-900", children: t.name }),
          /* @__PURE__ */ e("p", { className: "text-xs text-neutral-500", children: M(t.size) })
        ] }),
        /* @__PURE__ */ e(
          "button",
          {
            type: "button",
            onClick: () => y(t),
            className: "shrink-0 rounded px-2 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
            children: "Remove"
          }
        )
      ]
    },
    `${t.name}-${t.size}-${t.lastModified}`
  )) })
] });
export {
  z as JFileUploadView
};
//# sourceMappingURL=JFileUploadView.js.map
