import { useCallback, useEffect, useMemo, useState } from "react";
import { LegacyPageAdapter } from "./components/layout/LegacyPageAdapter";
import { getRoute, normalizePath } from "./router/routes";
import { LeadModal } from "./components/ui/LeadModal";

function getCurrentLocationKey() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function isRoutableLink(link: HTMLAnchorElement | null) {
  if (!link || link.target || link.hasAttribute("download")) return false;
  const url = new URL(link.href, window.location.href);
  return url.origin === window.location.origin;
}

export function App() {
  const [locationKey, setLocationKey] = useState(() => getCurrentLocationKey());
  
  // Modal State for Popup Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInterest, setModalInterest] = useState("");
  const [modalIsContact, setModalIsContact] = useState(false);

  const normalizedPath = useMemo(() => normalizePath(window.location.pathname), [locationKey]);
  const route = useMemo(() => getRoute(normalizedPath), [normalizedPath]);

  const navigateTo = useCallback((href: string) => {
    const url = new URL(href, window.location.href);
    const nextPath = normalizePath(url.pathname);
    
    const currentPath = normalizePath(window.location.pathname);
    const isCurrentlyHome = currentPath === "/";

    if (!isCurrentlyHome) {
      const isTargetingHomeForm = nextPath === "/" && (url.hash === "#hero" || url.hash === "#contact");
      const isTargetingCurrentPageForm = nextPath === currentPath && (url.hash === "#hero" || url.hash === "#contact");

      if (isTargetingHomeForm || isTargetingCurrentPageForm) {
        const interest = url.searchParams.get("interesse") || "";
        const isContact = url.hash === "#contact";
        setModalInterest(interest);
        setModalIsContact(isContact);
        setIsModalOpen(true);
        return;
      }
    }

    const nextUrl = `${nextPath}${url.search}${url.hash}`;
    const currentUrl = getCurrentLocationKey();

    if (nextUrl === currentUrl) {
      if (window.location.hash) {
        document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    window.history.pushState({}, "", nextUrl);
    setLocationKey(getCurrentLocationKey());
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const nextPath = normalizePath(currentPath);

    if (nextPath !== currentPath) {
      window.history.replaceState({}, "", `${nextPath}${window.location.search}${window.location.hash}`);
      setLocationKey(getCurrentLocationKey());
    }
  }, [locationKey]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const link = target?.closest("a") as HTMLAnchorElement | null;
      if (!isRoutableLink(link)) return;

      event.preventDefault();
      navigateTo(link.getAttribute("href") || "/");
    };

    const onPopState = () => setLocationKey(getCurrentLocationKey());
    const onMartinsNavigate = (event: Event) => {
      const detail = (event as CustomEvent<{ href?: string }>).detail;
      navigateTo(detail?.href || "/");
    };

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("martins:navigate", onMartinsNavigate);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("martins:navigate", onMartinsNavigate);
    };
  }, [navigateTo]);

  return (
    <>
      <LegacyPageAdapter key={normalizedPath} normalizedPath={normalizedPath} route={route} />
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialInterest={modalInterest}
        isContactForm={modalIsContact}
      />
    </>
  );
}
