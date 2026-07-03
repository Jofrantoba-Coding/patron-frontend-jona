import { jsx as e, jsxs as n } from "react/jsx-runtime";
import { cn as i } from "../../lib/cn.js";
import { JSectionHeadingImpl as c } from "../../molecules/JSectionHeading/JSectionHeadingImpl.js";
import { JNumberedStepImpl as s } from "../../molecules/JNumberedStep/JNumberedStepImpl.js";
const b = ({
  eyebrow: l,
  heading: r,
  steps: o,
  as: t = "section",
  className: a
}) => /* @__PURE__ */ e(t, { className: i("w-full border-t border-neutral-200 bg-neutral-50 py-16 sm:py-20", a), children: /* @__PURE__ */ n("div", { className: "mx-auto w-full max-w-3xl px-4 sm:px-6", children: [
  /* @__PURE__ */ e(c, { eyebrow: l, heading: r, className: "mb-10" }),
  /* @__PURE__ */ e("div", { className: "flex flex-col gap-4", children: o.map((m) => /* @__PURE__ */ e(
    s,
    {
      num: m.num,
      title: m.title,
      body: m.body
    },
    m.num
  )) })
] }) });
export {
  b as JContactStepsView
};
//# sourceMappingURL=JContactStepsView.js.map
