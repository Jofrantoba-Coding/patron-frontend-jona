import { jsx as e, jsxs as r } from "react/jsx-runtime";
import { JPanelImpl as n } from "../../atoms/JPanel/JPanelImpl.js";
import { TextAtomImpl as a } from "../../atoms/TextAtom/TextAtomImpl.js";
import { JButtonImpl as i } from "../../atoms/JButton/JButtonImpl.js";
const u = ({
  errorCode: l,
  title: m,
  message: o,
  onGoHome: t,
  onGoBack: s,
  primaryLabel: c,
  secondaryLabel: d
}) => /* @__PURE__ */ e(n, { variant: "ghost", padding: "none", radius: "none", className: "flex w-full flex-col items-center justify-center px-4 py-8 text-center sm:py-12", children: /* @__PURE__ */ r(n, { variant: "ghost", padding: "none", radius: "none", className: "flex w-full max-w-sm flex-col items-center sm:max-w-md", children: [
  l && /* @__PURE__ */ e(
    a,
    {
      as: "p",
      size: "2xl",
      className: "font-extrabold text-blue-600 text-8xl leading-none mb-4 select-none",
      children: l
    }
  ),
  /* @__PURE__ */ e(a, { as: "h1", size: "2xl", className: "font-bold text-gray-900 mb-2", children: m }),
  /* @__PURE__ */ e(a, { as: "p", size: "base", color: "muted", className: "mb-8 break-words", children: o }),
  /* @__PURE__ */ r(n, { variant: "ghost", padding: "none", radius: "none", className: "flex flex-wrap gap-3 justify-center", children: [
    t && /* @__PURE__ */ e(i, { variant: "default", onClick: t, children: c }),
    s && /* @__PURE__ */ e(i, { variant: "outline", onClick: s, children: d })
  ] })
] }) });
export {
  u as ErrorPageOrganismView
};
//# sourceMappingURL=ErrorPageOrganismView.js.map
