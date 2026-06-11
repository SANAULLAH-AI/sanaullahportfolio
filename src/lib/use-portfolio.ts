import { useEffect, useState, useCallback } from "react";
import * as D from "./portfolio-data";

const KEY = "sanaullah_portfolio_v1";

export type Store = {
  bio: string;
  education: D.Education[];
  experience: D.Experience[];
  skills: D.Skill[];
  projects: D.Project[];
  certifications: D.Certification[];
  contact: typeof D.DEFAULT_CONTACT;
  resumeBase64?: string;
  resumeName?: string;
  cvDownloads: number;
  achievements: { honors: string; hackathons: string; papers: string };
};

const DEFAULT: Store = {
  bio: D.DEFAULT_BIO,
  education: D.DEFAULT_EDUCATION,
  experience: D.DEFAULT_EXPERIENCE,
  skills: D.DEFAULT_SKILLS,
  projects: D.DEFAULT_PROJECTS,
  certifications: D.DEFAULT_CERTIFICATIONS,
  contact: D.DEFAULT_CONTACT,
  cvDownloads: 0,
  achievements: { honors: "", hackathons: "", papers: "" },
};

export function usePortfolio() {
  const [store, setStore] = useState<Store>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStore({ ...DEFAULT, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {}
    }
  }, [store, hydrated]);

  const update = useCallback((p: Partial<Store>) => setStore(s => ({ ...s, ...p })), []);
  const reset = useCallback(() => setStore(DEFAULT), []);
  return { store, setStore, update, reset, hydrated };
}

const ADMIN_KEY = "sanaullah_admin_v1";
const ADMIN_TS = "sanaullah_admin_ts_v1";
const TIMEOUT_MS = 15 * 60 * 1000;

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    try {
      const ok = localStorage.getItem(ADMIN_KEY) === "1";
      const ts = Number(localStorage.getItem(ADMIN_TS) || 0);
      if (ok && Date.now() - ts < TIMEOUT_MS) setIsAdmin(true);
      else { localStorage.removeItem(ADMIN_KEY); localStorage.removeItem(ADMIN_TS); }
    } catch {}
  }, []);
  useEffect(() => {
    if (!isAdmin) return;
    const touch = () => { try { localStorage.setItem(ADMIN_TS, String(Date.now())); } catch {} };
    touch();
    const events = ["click","keydown","mousemove","scroll"];
    events.forEach(e => window.addEventListener(e, touch));
    const i = setInterval(() => {
      const ts = Number(localStorage.getItem(ADMIN_TS) || 0);
      if (Date.now() - ts > TIMEOUT_MS) {
        setIsAdmin(false);
        try { localStorage.removeItem(ADMIN_KEY); localStorage.removeItem(ADMIN_TS); } catch {}
      }
    }, 30_000);
    return () => { events.forEach(e => window.removeEventListener(e, touch)); clearInterval(i); };
  }, [isAdmin]);
  const login = (pw: string) => {
    if (pw === D.ADMIN_PASSWORD) {
      setIsAdmin(true);
      try { localStorage.setItem(ADMIN_KEY, "1"); localStorage.setItem(ADMIN_TS, String(Date.now())); } catch {}
      return true;
    }
    return false;
  };
  const logout = () => {
    setIsAdmin(false);
    try { localStorage.removeItem(ADMIN_KEY); localStorage.removeItem(ADMIN_TS); } catch {}
  };
  return { isAdmin, login, logout };
}

const THEME_KEY = "sanaullah_theme_v1";
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const saved = (localStorage.getItem(THEME_KEY) as "light" | "dark") || "light";
    setTheme(saved);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }, [theme]);
  return { theme, setTheme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") };
}

export async function compressImage(file: File, maxW = 1200, quality = 0.7): Promise<string> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
  if (!file.type.startsWith("image/")) return dataUrl;
  const img = new Image();
  img.src = dataUrl;
  await new Promise(r => (img.onload = r));
  const scale = Math.min(1, maxW / img.width);
  const w = img.width * scale, h = img.height * scale;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return c.toDataURL("image/jpeg", quality);
}

export async function fileToBase64(file: File): Promise<string> {
  return await new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
