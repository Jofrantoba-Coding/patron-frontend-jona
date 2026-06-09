import { jsx as r } from "react/jsx-runtime";
import { JErrorPageView as J } from "../../organisms/JErrorPage/JErrorPageView.js";
import { JHeaderPageView as V } from "../../organisms/JHeaderPage/JHeaderPageView.js";
import { JFooterPageView as g } from "../../organisms/JFooterPage/JFooterPageView.js";
import { JBorderLayoutView as n } from "../../layouts/JBorderLayout/JBorderLayoutView.js";
const h = ({
  errorCode: o,
  title: e,
  message: t,
  onGoHome: i,
  onGoBack: m,
  primaryLabel: p,
  secondaryLabel: a,
  appTitle: f,
  footerText: w
}) => /* @__PURE__ */ r(
  n,
  {
    north: /* @__PURE__ */ r(V, { title: f }),
    south: /* @__PURE__ */ r(g, { text: w }),
    center: /* @__PURE__ */ r(
      J,
      {
        errorCode: o,
        title: e,
        message: t,
        onGoHome: i,
        onGoBack: m,
        primaryLabel: p,
        secondaryLabel: a
      }
    )
  }
);
export {
  h as JHomeErrorView
};
//# sourceMappingURL=JHomeErrorView.js.map
