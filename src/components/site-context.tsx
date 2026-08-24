import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { SITES } from "@/lib/aperture";

type Site = (typeof SITES)[number];

const SiteContext = createContext<{ site: Site; setSiteId: (id: string) => void }>({
  site: SITES[0],
  setSiteId: () => {},
});

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteId, setSiteId] = useState<string>(SITES[0].id);
  const value = useMemo(
    () => ({ site: SITES.find((s) => s.id === siteId) ?? SITES[0], setSiteId }),
    [siteId],
  );
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
