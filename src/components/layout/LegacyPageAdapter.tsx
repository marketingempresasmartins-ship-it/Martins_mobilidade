import { useEffect, useRef } from "react";
import type { LegacyRoute } from "../../router/routes";
import { trackPageView } from "../../services/analyticsStorage.js";

type LegacyPageAdapterProps = {
  normalizedPath: string;
  route: LegacyRoute;
};

const ROUTE_BODY_CLASSES = ["product-light-body", "ventura-body"];

function scrollToCurrentHash() {
  if (!window.location.hash) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  requestAnimationFrame(() => {
    document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function LegacyPageAdapter({ normalizedPath, route }: LegacyPageAdapterProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = route.title;
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accent-hover");
    document.body.classList.toggle("dashboard-body", Boolean(route.dashboard));
    document.body.classList.toggle("martins-app-shell", Boolean(route.dashboard || route.appShell));
    document.body.classList.toggle("martins-landing-shell", !(route.dashboard || route.appShell));
    document.body.classList.toggle("grid-lines", !(route.dashboard || route.appShell));
    ROUTE_BODY_CLASSES.forEach((bodyClass) => {
      document.body.classList.toggle(bodyClass, route.bodyClass === bodyClass);
    });
  }, [route]);

  useEffect(() => {
    let cancelled = false;

    async function renderLegacyRoute() {
      if (!hostRef.current) return;
      hostRef.current.innerHTML = route.render();
      await route.init?.();
      if (cancelled) return;

      scrollToCurrentHash();

      if (!(route.dashboard || route.appShell)) {
        trackPageView(normalizedPath, route.title);
      }
    }

    renderLegacyRoute();

    return () => {
      cancelled = true;
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [normalizedPath, route]);

  return <div ref={hostRef} data-route-id={route.id} />;
}
