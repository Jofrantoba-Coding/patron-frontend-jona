import { jsx as r } from "react/jsx-runtime";
import { ErrorPageOrganismView as s } from "../../organisms/ErrorPageOrganism/ErrorPageOrganismView.js";
import { HeaderPageOrganismView as f } from "../../organisms/HeaderPageOrganism/HeaderPageOrganismView.js";
import { FooterPageOrganismView as w } from "../../organisms/FooterPageOrganism/FooterPageOrganismView.js";
import { BorderLayoutView as V } from "../../layouts/BorderLayout/BorderLayoutView.js";
const h = ({
  errorCode: o,
  title: e,
  message: t,
  onGoHome: i,
  onGoBack: m,
  primaryLabel: a,
  secondaryLabel: g,
  appTitle: n,
  footerText: p
}) => /* @__PURE__ */ r(
  V,
  {
    north: /* @__PURE__ */ r(f, { title: n }),
    south: /* @__PURE__ */ r(w, { text: p }),
    center: /* @__PURE__ */ r(
      s,
      {
        errorCode: o,
        title: e,
        message: t,
        onGoHome: i,
        onGoBack: m,
        primaryLabel: a,
        secondaryLabel: g
      }
    )
  }
);
export {
  h as UiHomeErrorView
};
//# sourceMappingURL=UiHomeErrorView.js.map
