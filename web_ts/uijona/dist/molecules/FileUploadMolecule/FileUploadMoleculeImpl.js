import { jsx as O } from "react/jsx-runtime";
import { useId as Z, useState as g } from "react";
import { FILE_UPLOAD_MOLECULE_DEFAULTS as _ } from "./InterFileUploadMolecule.js";
import { FileUploadMoleculeView as B } from "./FileUploadMoleculeView.js";
const v = (e, a) => {
  if (!a) return !0;
  const f = a.split(",").map((r) => r.trim()).filter(Boolean);
  return f.length === 0 ? !0 : f.some((r) => r.startsWith(".") ? e.name.toLowerCase().endsWith(r.toLowerCase()) : r.endsWith("/*") ? e.type.startsWith(r.slice(0, -1)) : e.type === r);
}, S = ({
  files: e,
  defaultFiles: a = [],
  id: f,
  accept: r,
  multiple: D,
  maxFiles: s,
  onFilesChange: o,
  onReject: i,
  onRemoveFile: d,
  ...A
}) => {
  const E = Z(), I = f ?? `jona-file-upload-${E}`, M = { ..._, ...A, accept: r, multiple: D, maxFiles: s }, [W, L] = g(a), [w, c] = g(!1), u = e ?? W, y = (t) => {
    const l = t.filter((m) => v(m, r)), p = t.filter((m) => !v(m, r));
    p.length > 0 && (i == null || i({ reason: "accept", files: p }));
    const n = D ? [...u, ...l] : l.slice(0, 1), U = s ? n.slice(0, s) : n;
    s && n.length > s && (i == null || i({ reason: "max-files", files: n.slice(s) })), e === void 0 && L(U), o == null || o(U);
  };
  return /* @__PURE__ */ O(
    B,
    {
      ...M,
      id: I,
      inputId: I,
      selectedFiles: u,
      isDragging: w,
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
        const l = u.filter((p) => p !== t);
        e === void 0 && L(l), d == null || d(t, l), o == null || o(l);
      }
    }
  );
};
S.displayName = "FileUploadMolecule";
export {
  S as FileUploadMoleculeImpl
};
//# sourceMappingURL=FileUploadMoleculeImpl.js.map
