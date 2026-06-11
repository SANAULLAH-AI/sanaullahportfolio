import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Sun, Moon, Github, Linkedin, Copy, Download, Upload, Plus, Trash2, Edit3, X, ArrowUp,
  ExternalLink, Mail, Award, GraduationCap, Briefcase, Cpu, FileText, LogOut, Filter, Search, Save,
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from "recharts";
import { toast, Toaster } from "sonner";
import { usePortfolio, useAdmin, useTheme, compressImage, fileToBase64 } from "@/lib/use-portfolio";
import { HF_SPACES, SKILL_CATEGORIES, type Project, type Certification, type Skill, type Education, type Experience } from "@/lib/portfolio-data";
import { NeuralCanvas } from "@/components/portfolio/NeuralCanvas";
import { Typewriter } from "@/components/portfolio/Typewriter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sanaullah — BSCS Programmer & AI/ML Engineer" },
      { name: "description", content: "Portfolio of Sanaullah — BSCS student, AI/ML engineer, data science projects, certifications, and HuggingFace spaces." },
      { property: "og:title", content: "Sanaullah — AI/ML Engineer Portfolio" },
      { property: "og:description", content: "Machine Learning, Deep Learning, NLP, Computer Vision and Data Science projects." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org", "@type": "Person",
          name: "Sanaullah", jobTitle: "BSCS Programmer & AI/ML Engineer",
          email: "sanaullah786shah92@gmail.com",
          url: "https://github.com/sanaullah-ai",
          alumniOf: "Abasyn University Islamabad Campus",
          sameAs: ["https://github.com/sanaullah-ai","https://huggingface.co/sanaullah7964"],
        }),
      },
    ],
  }),
  component: Home,
});

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "hf", label: "HuggingFace" },
  { id: "experience", label: "Experience" },
  { id: "certs", label: "Certifications" },
  { id: "vault", label: "Vault" },
  { id: "contact", label: "Contact" },
];

function uid() { return Math.random().toString(36).slice(2, 10); }

function Home() {
  const { store, update, hydrated } = usePortfolio();
  const { isAdmin, login, logout } = useAdmin();
  const { theme, toggle } = useTheme();
  const [showLogin, setShowLogin] = useState(false);
  const [pw, setPw] = useState("");
  const [scroll, setScroll] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [projFilter, setProjFilter] = useState<string>("ALL");
  const [projSearch, setProjSearch] = useState("");
  const [projModal, setProjModal] = useState<Project | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [costTokens, setCostTokens] = useState(1000);

  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const sc = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setScroll(sc * 100);
      setShowTop(h.scrollTop > 600);
    };
    on(); window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  const handleLogin = () => {
    if (login(pw)) { setShowLogin(false); setPw(""); toast.success("Admin unlocked"); }
    else toast.error("Incorrect password");
  };

  const exportJSON = () => {
    const raw = localStorage.getItem("sanaullah_portfolio_v1") || "{}";
    navigator.clipboard.writeText(raw).then(() => toast.success("Database JSON copied to clipboard"));
    const blob = new Blob([raw], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "portfolio-db.json"; a.click();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(store.contact.email).then(() => toast.success("Email copied"));
  };

  const onResumeUpload = async (f: File) => {
    const b64 = await fileToBase64(f);
    update({ resumeBase64: b64, resumeName: f.name });
    toast.success("Resume saved");
  };

  const downloadResume = () => {
    if (!store.resumeBase64) return toast.error("No resume uploaded");
    const a = document.createElement("a");
    a.href = store.resumeBase64; a.download = store.resumeName || "resume.pdf"; a.click();
    update({ cvDownloads: store.cvDownloads + 1 });
    toast.success("Download started");
  };

  const projectCats = useMemo(() => Array.from(new Set(store.projects.map(p => p.category || "Other"))), [store.projects]);
  const filteredProjects = useMemo(() => store.projects.filter(p => {
    const okCat = projFilter === "ALL" || p.category === projFilter;
    const okQ = !projSearch || (p.title + p.tech + p.description).toLowerCase().includes(projSearch.toLowerCase());
    return okCat && okQ;
  }), [store.projects, projFilter, projSearch]);

  const radarData = useMemo(() => SKILL_CATEGORIES.map(cat => ({
    category: cat.replace(" & ", " /\n"), value: store.skills.filter(s => s.category === cat).length,
  })), [store.skills]);

  if (!hydrated) {
    return <div className="min-h-screen grid place-items-center bg-background"><div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme={theme} richColors position="top-right" />
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-primary z-[60]" style={{ width: `${scroll}%`, boxShadow: "0 0 10px currentColor" }} />

      {/* NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <a href="#home" className="font-mono font-bold text-lg tracking-tight">
            <span className="text-primary neon-text">S</span>anaullah<span className="text-primary">_</span>
          </a>
          <div className="hidden md:flex items-center gap-1 ml-4 text-sm">
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} className="px-3 py-1.5 rounded-md hover:bg-accent hover:text-primary transition-colors">{s.label}</a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isAdmin && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-primary text-primary neon-glow">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> ADMIN
              </span>
            )}
            {isAdmin && (
              <button onClick={exportJSON} className="hidden sm:inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-border hover:border-primary">
                <Download className="h-3.5 w-3.5" /> Export JSON
              </button>
            )}
            {isAdmin && (
              <button onClick={logout} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-border hover:border-primary">
                <LogOut className="h-3.5 w-3.5" /> Logout
              </button>
            )}
            <button onClick={toggle} aria-label="Toggle theme"
              className="relative h-9 w-9 grid place-items-center rounded-full border border-border hover:border-primary transition-all dark:neon-glow">
              {theme === "dark" ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => setShowLogin(true)} aria-label="Admin"
              className="h-9 w-9 grid place-items-center rounded-full border border-border hover:border-primary hover:text-primary transition-all">
              <Lock className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0"><NeuralCanvas /></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60 backdrop-blur text-xs font-mono mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Available for opportunities
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
              Sana<span className="text-primary neon-text">ullah</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground font-mono">BSCS Programmer &amp; AI/ML Engineer</p>
            <div className="mt-8 text-2xl sm:text-3xl font-bold min-h-[2.5rem]">
              <span className="text-muted-foreground">{`> `}</span><Typewriter />
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#projects" className="px-5 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition dark:neon-glow">View Projects</a>
              <a href="#contact" className="px-5 py-3 rounded-md border border-border hover:border-primary transition">Get in Touch</a>
              {store.resumeBase64 && (
                <button onClick={downloadResume} className="px-5 py-3 rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition inline-flex items-center gap-2">
                  <Download className="h-4 w-4" /> Resume
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" title="About" icon={<GraduationCap className="h-5 w-5" />}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card">
            {isAdmin ? (
              <textarea value={store.bio} onChange={e => update({ bio: e.target.value })}
                className="w-full min-h-[180px] bg-transparent outline-none resize-none leading-relaxed" />
            ) : (
              <p className="leading-relaxed text-card-foreground/90">{store.bio}</p>
            )}
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Achievements</h3>
            {(["honors","hackathons","papers"] as const).map(k => (
              <div key={k} className="mb-3">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {k === "honors" ? "Academic Honors" : k === "hackathons" ? "Hackathon Wins" : "ML Research Papers/Preprints"}
                </div>
                {isAdmin ? (
                  <input value={store.achievements[k]} onChange={e => update({ achievements: { ...store.achievements, [k]: e.target.value } })}
                    placeholder="Add entry..." className="w-full px-2 py-1 rounded bg-background border border-border text-sm" />
                ) : (
                  <div className="text-sm text-muted-foreground italic">{store.achievements[k] || "— placeholder slot —"}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Education Timeline</h3>
          <div className="space-y-3">
            {store.education.map(ed => (
              <div key={ed.id} className="relative pl-6 p-5 rounded-xl border border-border bg-card group">
                <span className="absolute left-0 top-7 -translate-x-1/2 h-3 w-3 rounded-full bg-primary neon-glow" />
                {isAdmin ? (
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Input value={ed.uni} onChange={v => update({ education: store.education.map(x => x.id === ed.id ? { ...x, uni: v } : x) })} placeholder="University" />
                    <Input value={ed.degree} onChange={v => update({ education: store.education.map(x => x.id === ed.id ? { ...x, degree: v } : x) })} placeholder="Degree" />
                    <Input value={ed.duration} onChange={v => update({ education: store.education.map(x => x.id === ed.id ? { ...x, duration: v } : x) })} placeholder="Duration" />
                    <Input value={ed.cgpa} onChange={v => update({ education: store.education.map(x => x.id === ed.id ? { ...x, cgpa: v } : x) })} placeholder="CGPA" />
                    <button onClick={() => update({ education: store.education.filter(x => x.id !== ed.id) })} className="text-xs text-destructive inline-flex items-center gap-1 self-start"><Trash2 className="h-3 w-3" /> Purge</button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="font-bold">{ed.uni}</h4>
                      <span className="text-xs font-mono text-primary">{ed.duration}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{ed.degree}</p>
                    <p className="text-sm mt-1">CGPA: <span className="font-mono font-bold text-primary">{ed.cgpa}</span></p>
                  </>
                )}
              </div>
            ))}
            {isAdmin && (
              <button onClick={() => update({ education: [...store.education, { id: uid(), uni: "", degree: "", cgpa: "", duration: "" }] })}
                className="px-4 py-2 rounded-md border border-dashed border-border hover:border-primary text-sm inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add Education</button>
            )}
          </div>
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills Radar" icon={<Cpu className="h-5 w-5" />}>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: "var(--foreground)", fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="space-y-4 max-h-[380px] overflow-auto pr-2">
              {SKILL_CATEGORIES.map(cat => (
                <div key={cat}>
                  <h4 className="text-xs uppercase tracking-wider text-primary font-mono mb-2">{cat}</h4>
                  <div className="flex flex-wrap gap-2">
                    {store.skills.filter(s => s.category === cat).map(s => (
                      <span key={s.id} className="group inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs border border-border">
                        {isAdmin ? (
                          <>
                            <input value={s.name} onChange={e => update({ skills: store.skills.map(x => x.id === s.id ? { ...x, name: e.target.value } : x) })} className="bg-transparent outline-none w-24" />
                            <button onClick={() => update({ skills: store.skills.filter(x => x.id !== s.id) })}><X className="h-3 w-3 text-destructive" /></button>
                          </>
                        ) : s.name}
                      </span>
                    ))}
                    {isAdmin && (
                      <button onClick={() => update({ skills: [...store.skills, { id: uid(), name: "New Skill", category: cat }] })} className="px-2 py-1 rounded-full border border-dashed border-border text-xs hover:border-primary inline-flex items-center gap-1"><Plus className="h-3 w-3" /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" title="Projects" icon={<Cpu className="h-5 w-5" />}>
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={projSearch} onChange={e => setProjSearch(e.target.value)} placeholder="Search projects..." className="pl-9 pr-3 py-2 rounded-md bg-card border border-border focus:border-primary outline-none text-sm w-56" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {["ALL", ...projectCats].map(c => (
              <button key={c} onClick={() => setProjFilter(c)} className={`px-3 py-1 rounded-full text-xs border transition ${projFilter === c ? "bg-primary text-primary-foreground border-primary neon-glow" : "border-border hover:border-primary"}`}>{c}</button>
            ))}
          </div>
          {isAdmin && (
            <button onClick={() => update({ projects: [...store.projects, { id: uid(), title: "New Project", description: "", tech: "", category: "ML" }] })}
              className="ml-auto px-3 py-1.5 rounded-md border border-dashed border-primary text-primary text-sm inline-flex items-center gap-1"><Plus className="h-4 w-4" /> Add Project</button>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p, idx) => (
            <ProjectCard key={p.id} p={p} idx={idx} isAdmin={isAdmin}
              onChange={np => update({ projects: store.projects.map(x => x.id === p.id ? np : x) })}
              onDelete={() => update({ projects: store.projects.filter(x => x.id !== p.id) })}
              onOpen={() => setProjModal(p)}
            />
          ))}
        </div>
      </Section>

      {/* HUGGINGFACE */}
      <Section id="hf" title="HuggingFace Spaces" icon={<ExternalLink className="h-5 w-5" />}>
        <p className="text-sm text-muted-foreground mb-4 font-mono">@sanaullah7964 — 7 live Spaces</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HF_SPACES.map(s => (
            <a key={s} href={`https://huggingface.co/spaces/sanaullah7964/${s}`} target="_blank" rel="noreferrer"
              className="group p-4 rounded-xl border border-border bg-card hover:border-primary transition-all hover:-translate-y-1 dark:hover:neon-glow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono text-primary">🤗 Space</div>
                  <div className="font-bold mt-1 group-hover:text-primary">{s}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="mt-4 text-xs text-muted-foreground font-mono">huggingface.co/spaces/sanaullah7964/{s}</div>
            </a>
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl border border-border bg-card">
          <h3 className="font-bold mb-3 flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> Model Cost Calculator</h3>
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Tokens: <span className="text-primary font-mono">{costTokens.toLocaleString()}</span></label>
              <input type="range" min={100} max={100000} step={100} value={costTokens} onChange={e => setCostTokens(Number(e.target.value))} className="w-full accent-[var(--primary)] mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Metric label="Llama-3 (8B)" cost={`$${(costTokens / 1000 * 0.0006).toFixed(4)}`} latency={`${(costTokens / 50).toFixed(0)}ms`} />
              <Metric label="DistilBERT" cost={`$${(costTokens / 1000 * 0.00008).toFixed(5)}`} latency={`${(costTokens / 200).toFixed(0)}ms`} />
            </div>
          </div>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience" icon={<Briefcase className="h-5 w-5" />}>
        <div className="space-y-4">
          {store.experience.map(x => (
            <div key={x.id} className="relative pl-6 p-5 rounded-xl border border-border bg-card">
              <span className="absolute left-0 top-7 -translate-x-1/2 h-3 w-3 rounded-full bg-primary neon-glow" />
              {isAdmin ? (
                <div className="grid sm:grid-cols-2 gap-2">
                  <Input value={x.company} onChange={v => update({ experience: store.experience.map(e => e.id === x.id ? { ...e, company: v } : e) })} placeholder="Company" />
                  <Input value={x.role} onChange={v => update({ experience: store.experience.map(e => e.id === x.id ? { ...e, role: v } : e) })} placeholder="Role" />
                  <Input value={x.duration} onChange={v => update({ experience: store.experience.map(e => e.id === x.id ? { ...e, duration: v } : e) })} placeholder="Duration" />
                  <Input value={x.tech} onChange={v => update({ experience: store.experience.map(e => e.id === x.id ? { ...e, tech: v } : e) })} placeholder="Tech" />
                  <textarea value={x.desc} onChange={e => update({ experience: store.experience.map(ex => ex.id === x.id ? { ...ex, desc: e.target.value } : ex) })} placeholder="Description" className="sm:col-span-2 px-3 py-2 rounded bg-background border border-border text-sm" />
                  <button onClick={() => update({ experience: store.experience.filter(e => e.id !== x.id) })} className="text-xs text-destructive inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Purge</button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h4 className="font-bold">{x.role}</h4>
                    <span className="text-primary text-sm">@ {x.company}</span>
                    <span className="text-xs font-mono text-muted-foreground ml-auto">{x.duration}</span>
                  </div>
                  <p className="text-sm mt-2">{x.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {x.tech.split(",").map(t => <span key={t} className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-secondary border border-border">{t.trim()}</span>)}
                  </div>
                </>
              )}
            </div>
          ))}
          {isAdmin && (
            <button onClick={() => update({ experience: [...store.experience, { id: uid(), company: "", role: "", duration: "", tech: "", desc: "" }] })}
              className="px-4 py-2 rounded-md border border-dashed border-border hover:border-primary text-sm inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add Experience</button>
          )}
        </div>
      </Section>

      {/* CERTIFICATIONS */}
      <Section id="certs" title="Certifications" icon={<Award className="h-5 w-5" />}>
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-3">
            {store.certifications.map(c => (
              <div key={c.id} className="relative pl-12 p-4 rounded-xl border border-border bg-card group">
                <a href={c.url || "#"} target="_blank" rel="noreferrer" className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary neon-glow hover:scale-150 transition" />
                {isAdmin ? (
                  <div className="grid sm:grid-cols-2 gap-2">
                    <Input value={c.title} onChange={v => update({ certifications: store.certifications.map(x => x.id === c.id ? { ...x, title: v } : x) })} placeholder="Title" />
                    <Input value={c.org} onChange={v => update({ certifications: store.certifications.map(x => x.id === c.id ? { ...x, org: v } : x) })} placeholder="Issuing Org" />
                    <Input value={c.url || ""} onChange={v => update({ certifications: store.certifications.map(x => x.id === c.id ? { ...x, url: v } : x) })} placeholder="Verify URL" />
                    <Input value={c.date || ""} onChange={v => update({ certifications: store.certifications.map(x => x.id === c.id ? { ...x, date: v } : x) })} placeholder="Date Issued" />
                    <label className="text-xs inline-flex items-center gap-2 cursor-pointer">
                      <Upload className="h-3 w-3" /> Upload Badge
                      <input type="file" accept="image/*" className="hidden" onChange={async e => {
                        const f = e.target.files?.[0]; if (!f) return;
                        const b = await compressImage(f, 400, 0.8);
                        update({ certifications: store.certifications.map(x => x.id === c.id ? { ...x, badge: b } : x) });
                      }} />
                    </label>
                    <button onClick={() => update({ certifications: store.certifications.filter(x => x.id !== c.id) })} className="text-xs text-destructive inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Purge</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {c.badge && (
                      <button onClick={() => setLightbox(c.badge!)} className="shrink-0">
                        <img src={c.badge} alt="" className="h-12 w-12 rounded object-cover border border-border" />
                      </button>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold truncate">{c.title}</h4>
                      <p className="text-sm text-muted-foreground">{c.org}{c.date ? ` • ${c.date}` : ""}</p>
                    </div>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline shrink-0">
                        Verify <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isAdmin && (
              <button onClick={() => update({ certifications: [...store.certifications, { id: uid(), title: "", org: "", url: "", date: "" }] })}
                className="ml-12 px-4 py-2 rounded-md border border-dashed border-border hover:border-primary text-sm inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add Certification</button>
            )}
          </div>
        </div>
      </Section>

      {/* VAULT */}
      <Section id="vault" title="Document Vault" icon={<FileText className="h-5 w-5" />}>
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h3 className="font-bold">Resume / CV</h3>
            <span className="text-xs font-mono text-muted-foreground ml-auto">Downloaded {store.cvDownloads} times</span>
          </div>
          {isAdmin && (
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-primary text-primary cursor-pointer mr-2">
              <Upload className="h-4 w-4" /> Upload PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files?.[0] && onResumeUpload(e.target.files[0])} />
            </label>
          )}
          {store.resumeBase64 ? (
            <>
              <button onClick={downloadResume} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground"><Download className="h-4 w-4" /> Download Resume</button>
              <div className="mt-4 h-[500px] rounded-lg overflow-hidden border border-border">
                <iframe src={store.resumeBase64} className="w-full h-full" title="Resume Preview" />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
          )}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact" icon={<Mail className="h-5 w-5" />}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-bold text-2xl">Let's build something.</h3>
            <p className="text-muted-foreground mt-2">Open to internships, collaborations, and ML/AI projects.</p>
            <button onClick={copyEmail} className="mt-6 group w-full px-4 py-3 rounded-md border border-border hover:border-primary inline-flex items-center justify-between gap-2">
              <span className="font-mono text-sm truncate">{store.contact.email}</span>
              <Copy className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </button>
          </div>
          <div className="p-6 rounded-xl border border-border bg-card space-y-3">
            {isAdmin ? (
              <>
                <Input value={store.contact.email} onChange={v => update({ contact: { ...store.contact, email: v } })} placeholder="Email" />
                <Input value={store.contact.github} onChange={v => update({ contact: { ...store.contact, github: v } })} placeholder="GitHub URL" />
                <Input value={store.contact.hf} onChange={v => update({ contact: { ...store.contact, hf: v } })} placeholder="HuggingFace URL" />
                <Input value={store.contact.linkedin} onChange={v => update({ contact: { ...store.contact, linkedin: v } })} placeholder="LinkedIn URL" />
              </>
            ) : (
              <>
                <SocialLink href={store.contact.github} icon={<Github className="h-5 w-5" />} label="GitHub" sub={store.contact.github.replace(/https?:\/\//, "")} />
                <SocialLink href={store.contact.hf} icon={<span className="text-xl">🤗</span>} label="HuggingFace" sub={store.contact.hf.replace(/https?:\/\//, "")} />
                <SocialLink href={store.contact.linkedin} icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" sub={store.contact.linkedin.replace(/https?:\/\//, "")} />
              </>
            )}
          </div>
        </div>
      </Section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground font-mono">
        © {new Date().getFullYear()} Sanaullah — Built with React, TanStack, Framer Motion.
      </footer>

      {/* BACK TO TOP */}
      <AnimatePresence>
        {showTop && (
          <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center dark:neon-glow z-50">
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ADMIN LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && !isAdmin && (
          <Modal onClose={() => setShowLogin(false)}>
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 border border-primary grid place-items-center dark:neon-glow">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-bold">Admin Access</h3>
              <p className="text-sm text-muted-foreground mt-1">Enter password to unlock CRUD.</p>
              <input type="password" autoFocus value={pw} onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Password" className="mt-6 w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary outline-none font-mono text-center" />
              <button onClick={handleLogin} className="mt-3 w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold dark:neon-glow">Unlock</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* PROJECT MODAL */}
      <AnimatePresence>
        {projModal && (
          <Modal onClose={() => setProjModal(null)}>
            {projModal.screenshot && <img src={projModal.screenshot} alt="" className="w-full h-64 object-cover rounded-lg border border-border" />}
            <h3 className="mt-4 text-2xl font-bold">{projModal.title}</h3>
            {projModal.category && <span className="inline-block mt-1 text-xs font-mono text-primary">{projModal.category}</span>}
            <p className="mt-3 text-sm">{projModal.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {projModal.tech.split(",").map(t => <span key={t} className="text-xs px-2 py-1 rounded bg-secondary border border-border">{t.trim()}</span>)}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {projModal.github && <a href={projModal.github} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md border border-border inline-flex items-center gap-2 text-sm hover:border-primary"><Github className="h-4 w-4" /> GitHub</a>}
              {projModal.hf && <a href={projModal.hf} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md border border-border inline-flex items-center gap-2 text-sm hover:border-primary">🤗 HuggingFace</a>}
              {projModal.demo && <a href={projModal.demo} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-2 text-sm"><ExternalLink className="h-4 w-4" /> Demo</a>}
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightbox && (
          <Modal onClose={() => setLightbox(null)} large>
            <img src={lightbox} alt="" className="w-full max-h-[80vh] object-contain" />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ id, title, icon, children }: { id: string; title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-8">
            <span className="h-8 w-8 rounded-md bg-primary/10 border border-primary text-primary grid place-items-center dark:neon-glow">{icon}</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{title}</h2>
            <span className="flex-1 h-px bg-border ml-2" />
          </div>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="px-3 py-2 rounded bg-background border border-border focus:border-primary outline-none text-sm w-full" />;
}

function SocialLink({ href, icon, label, sub }: { href: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary group">
      <span className="h-10 w-10 grid place-items-center rounded bg-secondary group-hover:text-primary">{icon}</span>
      <div className="min-w-0">
        <div className="font-bold">{label}</div>
        <div className="text-xs text-muted-foreground truncate">{sub}</div>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary" />
    </a>
  );
}

function Metric({ label, cost, latency }: { label: string; cost: string; latency: string }) {
  return (
    <div className="p-3 rounded-lg border border-border bg-background">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-mono text-primary text-lg mt-1">{cost}</div>
      <div className="text-xs text-muted-foreground">~{latency}</div>
    </div>
  );
}

function ProjectCard({ p, idx, isAdmin, onChange, onDelete, onOpen }: {
  p: Project; idx: number; isAdmin: boolean;
  onChange: (p: Project) => void; onDelete: () => void; onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
      ref={ref}
      onMouseMove={e => {
        const r = ref.current!.getBoundingClientRect();
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -8, y: ((e.clientX - r.left) / r.width - 0.5) * 8 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      className="group relative p-5 rounded-xl border border-border bg-card hover:border-primary transition-all dark:hover:neon-glow cursor-pointer"
      onClick={() => !isAdmin && onOpen()}>
      {p.screenshot && <img src={p.screenshot} alt="" className="w-full h-32 object-cover rounded-md mb-3 border border-border" />}
      <div className="flex items-start justify-between gap-2">
        {isAdmin ? (
          <Input value={p.title} onChange={v => onChange({ ...p, title: v })} placeholder="Title" />
        ) : (
          <h3 className="font-bold leading-tight group-hover:text-primary">{p.title}</h3>
        )}
        {p.category && !isAdmin && <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary shrink-0">{p.category}</span>}
      </div>
      {isAdmin ? (
        <div className="space-y-2 mt-2">
          <textarea value={p.description} onChange={e => onChange({ ...p, description: e.target.value })} placeholder="Description" className="w-full text-sm px-3 py-2 rounded bg-background border border-border" />
          <Input value={p.tech} onChange={v => onChange({ ...p, tech: v })} placeholder="Tech stack, comma separated" />
          <Input value={p.category || ""} onChange={v => onChange({ ...p, category: v })} placeholder="Category (ML/NLP/CV/...)" />
          <Input value={p.github || ""} onChange={v => onChange({ ...p, github: v })} placeholder="GitHub URL" />
          <Input value={p.hf || ""} onChange={v => onChange({ ...p, hf: v })} placeholder="HuggingFace URL" />
          <Input value={p.demo || ""} onChange={v => onChange({ ...p, demo: v })} placeholder="Demo URL" />
          <label className="text-xs inline-flex items-center gap-2 cursor-pointer">
            <Upload className="h-3 w-3" /> Screenshot
            <input type="file" accept="image/*" className="hidden" onChange={async e => {
              const f = e.target.files?.[0]; if (!f) return;
              onChange({ ...p, screenshot: await compressImage(f) });
            }} />
          </label>
          <div className="flex justify-between pt-2">
            <button onClick={onDelete} className="text-xs text-destructive inline-flex items-center gap-1"><Trash2 className="h-3 w-3" /> Purge Card</button>
            <span className="text-xs text-primary inline-flex items-center gap-1"><Save className="h-3 w-3" /> Auto-saved</span>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.tech.split(",").slice(0, 4).map(t => <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary border border-border">{t.trim()}</span>)}
          </div>
          <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
            {p.github && <a href={p.github} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary"><Github className="h-3 w-3" /> Code</a>}
            {p.hf && <a href={p.hf} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary">🤗 HF</a>}
            {p.demo && <a href={p.demo} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-primary"><ExternalLink className="h-3 w-3" /> Demo</a>}
          </div>
        </>
      )}
    </motion.div>
  );
}

function Modal({ children, onClose, large }: { children: React.ReactNode; onClose: () => void; large?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className={`relative bg-card border border-border rounded-xl p-6 w-full ${large ? "max-w-4xl" : "max-w-md"} max-h-[90vh] overflow-auto dark:neon-glow`}>
        <button onClick={onClose} className="absolute top-3 right-3 h-8 w-8 rounded-full grid place-items-center hover:bg-secondary"><X className="h-4 w-4" /></button>
        {children}
      </motion.div>
    </motion.div>
  );
}
