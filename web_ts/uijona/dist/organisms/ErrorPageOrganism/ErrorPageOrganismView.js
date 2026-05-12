import { jsx as e, jsxs as r } from "react/jsx-runtime";
import { PanelAtomImpl as n } from "../../atoms/PanelAtom/PanelAtomImpl.js";
import { TextAtomImpl as t } from "../../atoms/TextAtom/TextAtomImpl.js";
import { ButtonAtomImpl as i } from "../../atoms/ButtonAtom/ButtonAtomImpl.js";
const u = ({
  errorCode: a,
  title: m,
  message: o,
  onGoHome: l,
  onGoBack: s,
  primaryLabel: c,
  secondaryLabel: d
}) => /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex w-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12", children: /* @__PURE__ */ r(n, { variant: "ghost", padding: "none", radius: "none", className: "flex w-full max-w-sm flex-col items-center sm:max-w-md", children: [
  a && /* @__PURE__ */ e(
    t,
    {
      as: "p",
      size: "2xl",
      className: "font-extrabold text-blue-600 text-8xl leading-none mb-4 select-none",
      children: a
    }
  ),
  /* @__PURE__ */ e(t, { as: "h1", size: "2xl", className: "font-bold text-gray-900 mb-2", children: m }),
  /* @__PURE__ */ e(t, { as: "p", size: "base", color: "muted", className: "mb-8 break-words", children: o }),
  /* @__PURE__ */ r(n, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-wrap gap-3 justify-center", children: [
    l && /* @__PURE__ */ e(i, { variant: "default", onClick: l, children: c }),
    s && /* @__PURE__ */ e(i, { variant: "outline", onClick: s, children: d })
  ] })
] }) });
export {
  u as ErrorPageOrganismView
};
//# sourceMappingURL=ErrorPageOrganismView.js.map
