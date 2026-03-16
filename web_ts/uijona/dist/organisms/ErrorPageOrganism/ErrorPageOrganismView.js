import { jsxs as s, jsx as e } from "react/jsx-runtime";
import { TextAtomImpl as t } from "../../atoms/TextAtom/TextAtomImpl.js";
import { ButtonAtomImpl as r } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const p = ({
  errorCode: l,
  title: n,
  message: m,
  onGoHome: a,
  onGoBack: i,
  primaryLabel: c,
  secondaryLabel: x
}) => /* @__PURE__ */ s("div", { className: "flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto", children: [
  l && /* @__PURE__ */ e(
    t,
    {
      as: "p",
      size: "2xl",
      className: "font-extrabold text-blue-600 text-8xl leading-none mb-4 select-none",
      children: l
    }
  ),
  /* @__PURE__ */ e(t, { as: "h1", size: "2xl", className: "font-bold text-gray-900 mb-2", children: n }),
  /* @__PURE__ */ e(t, { as: "p", size: "base", color: "muted", className: "mb-8", children: m }),
  /* @__PURE__ */ s("div", { className: "flex flex-wrap gap-3 justify-center", children: [
    a && /* @__PURE__ */ e(r, { variant: "default", onClick: a, children: c }),
    i && /* @__PURE__ */ e(r, { variant: "outline", onClick: i, children: x })
  ] })
] });
export {
  p as ErrorPageOrganismView
};
//# sourceMappingURL=ErrorPageOrganismView.js.map
