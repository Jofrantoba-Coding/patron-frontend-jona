import { jsx as a } from "react/jsx-runtime";
import { JTABS_DEFAULTS as i } from "./InterJTabs.js";
import { JTabsView as t, JTabsContentView as T, JTabsListView as e, JTabsTriggerView as m } from "./JTabsView.js";
const o = (s) => /* @__PURE__ */ a(t, { ...i, ...s });
o.displayName = "JTabs";
const r = (s) => /* @__PURE__ */ a(e, { ...s });
r.displayName = "JTabsList";
const J = (s) => /* @__PURE__ */ a(m, { ...s });
J.displayName = "JTabsTrigger";
const b = (s) => /* @__PURE__ */ a(T, { ...s });
b.displayName = "JTabsContent";
export {
  b as JTabsContentImpl,
  o as JTabsImpl,
  r as JTabsListImpl,
  J as JTabsTriggerImpl
};
//# sourceMappingURL=JTabsImpl.js.map
