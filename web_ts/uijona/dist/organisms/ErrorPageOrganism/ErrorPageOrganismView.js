import { jsx as e, jsxs as i } from "react/jsx-runtime";
import { TextAtomImpl as l } from "../../atoms/TextAtom/TextAtomImpl.js";
import { ButtonAtomImpl as r } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const p = ({
  errorCode: t,
  title: m,
  message: n,
  onGoHome: s,
  onGoBack: a,
  primaryLabel: c,
  secondaryLabel: x
}) => /* @__PURE__ */ e("div", { className: "flex w-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12", children: /* @__PURE__ */ i("div", { className: "flex w-full max-w-sm flex-col items-center sm:max-w-md", children: [
  t && /* @__PURE__ */ e(
    l,
    {
      as: "p",
      size: "2xl",
      className: "font-extrabold text-blue-600 text-8xl leading-none mb-4 select-none",
      children: t
    }
  ),
  /* @__PURE__ */ e(l, { as: "h1", size: "2xl", className: "font-bold text-gray-900 mb-2", children: m }),
  /* @__PURE__ */ e(l, { as: "p", size: "base", color: "muted", className: "mb-8 break-words", children: n }),
  /* @__PURE__ */ i("div", { className: "flex flex-wrap gap-3 justify-center", children: [
    s && /* @__PURE__ */ e(r, { variant: "default", onClick: s, children: c }),
    a && /* @__PURE__ */ e(r, { variant: "outline", onClick: a, children: x })
  ] })
] }) });
export {
  p as ErrorPageOrganismView
};
//# sourceMappingURL=ErrorPageOrganismView.js.map
