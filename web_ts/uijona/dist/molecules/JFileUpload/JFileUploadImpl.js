import { jsx as B } from "react/jsx-runtime";
import { useId as E, useState as v } from "react";
import { JFILE_UPLOAD_DEFAULTS as O } from "./InterJFileUpload.js";
import { JFileUploadView as S } from "./JFileUploadView.js";
const A = (s, f) => {
  if (!f) return !0;
  const p = f.split(",").map((r) => r.trim()).filter(Boolean);
  return p.length === 0 ? !0 : p.some((r) => r.startsWith(".") ? s.name.toLowerCase().endsWith(r.toLowerCase()) : r.endsWith("/*") ? s.type.startsWith(r.slice(0, -1)) : s.type === r);
}, T = ({
  files: s,
  defaultFiles: f = [],
  id: p,
  accept: r,
  multiple: D,
  maxFiles: e,
  onFilesChange: o,
  onReject: i,
  onRemoveFile: n,
  ...U
}) => {
  const J = E(), I = p ?? `jona-file-upload-${J}`, W = { ...O, ...U, accept: r, multiple: D, maxFiles: e }, [w, g] = v(f), [Z, c] = v(!1), u = s ?? w, y = (t) => {
    const a = t.filter((m) => A(m, r)), d = t.filter((m) => !A(m, r));
    d.length > 0 && (i == null || i({ reason: "accept", files: d }));
    const l = D ? [...u, ...a] : a.slice(0, 1), L = e ? l.slice(0, e) : l;
    e && l.length > e && (i == null || i({ reason: "max-files", files: l.slice(e) })), s === void 0 && g(L), o == null || o(L);
  };
  return /* @__PURE__ */ B(
    S,
    {
      ...W,
      id: I,
      inputId: I,
      selectedFiles: u,
      isDragging: Z,
      onInputChange: (t) => {
        y(Array.from(t.target.files ?? [])), t.target.value = "";
      },
      onDropZoneDragOver: (t) => {
        t.preventDefault(), c(!0);
      },
      onDropZoneDragLeave: () => c(!1),
      onDropZoneDrop: (t) => {
        t.preventDefault(), c(!1), y(Array.from(t.dataTransfer.files ?? []));
      },
      onRemoveClick: (t) => {
        const a = u.filter((d) => d !== t);
        s === void 0 && g(a), n == null || n(t, a), o == null || o(a);
      }
    }
  );
};
T.displayName = "JFileUpload";
export {
  T as JFileUploadImpl
};
//# sourceMappingURL=JFileUploadImpl.js.map
