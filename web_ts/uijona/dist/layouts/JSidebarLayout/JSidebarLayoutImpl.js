import { jsx as m } from "react/jsx-runtime";
import { useState as t, useEffect as f } from "react";
import { JSIDEBAR_LAYOUT_DEFAULTS as b } from "./InterJSidebarLayout.js";
import { JSidebarLayoutView as C } from "./JSidebarLayoutView.js";
const h = (e) => {
  const i = { ...b, ...e }, [s, d] = t(i.defaultCollapsed), [r, l] = t(!1);
  f(() => {
    const a = () => {
      window.innerWidth >= 1024 && l(!1);
    };
    return window.addEventListener("resize", a), () => window.removeEventListener("resize", a);
  }, []);
  const c = (a) => {
    var o, n;
    (o = a.onClick) == null || o.call(a), (n = e.onNavItemClick) == null || n.call(e, a), l(!1);
  };
  return /* @__PURE__ */ m(
    C,
    {
      nav: e.nav,
      header: e.header,
      footer: e.footer,
      activeKey: e.activeKey,
      collapsible: i.collapsible,
      collapsed: s,
      mobileOpen: r,
      sidebarWidth: i.sidebarWidth,
      className: e.className,
      sidebarClassName: e.sidebarClassName,
      onToggleCollapse: () => d((a) => !a),
      onToggleMobile: () => l((a) => !a),
      onCloseMobile: () => l(!1),
      onItemClick: c,
      children: e.children
    }
  );
};
h.displayName = "JSidebarLayout";
export {
  h as JSidebarLayoutImpl
};
//# sourceMappingURL=JSidebarLayoutImpl.js.map
