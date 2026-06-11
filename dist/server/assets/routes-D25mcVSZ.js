import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Award, Briefcase, Copy, Cpu, Download, ExternalLink, FileText, Filter, Github, GraduationCap, Linkedin, Lock, LogOut, Mail, Moon, Plus, Save, Search, Sun, Trash2, Upload, X } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { Toaster, toast } from "sonner";
//#region src/lib/portfolio-data.ts
var DEFAULT_BIO = "I’m a BSCS student with a keen interest in technology and a strong desire to learn and grow in the field of computer science. I’m actively seeking opportunities to gain hands-on experience, enhance my skills, and apply my academic knowledge in practical settings. I am enthusiastic, quick to learn, and committed to contributing positively to any team or project I become part of.";
var DEFAULT_EDUCATION = [{
	id: "e1",
	uni: "Abasyn University Islamabad Campus",
	degree: "Bachelor of Science in Computer Science",
	cgpa: "3.83 / 4.00",
	duration: "January 2023 – Present"
}];
var DEFAULT_EXPERIENCE = [{
	id: "x1",
	company: "FriendsWare Solutions",
	role: "Summer Internship Program 2025",
	duration: "Summer 2025",
	tech: ".NET Core, SQL, API Development, GitHub",
	desc: "Mini CRM System development with .NET Core, SQL, API development, and GitHub collaboration."
}];
var DEFAULT_SKILLS = [
	...[
		"HTML",
		"CSS",
		"JavaScript",
		"Bootstrap",
		"Tailwind CSS"
	].map((n, i) => ({
		id: `fd${i}`,
		name: n,
		category: "Frontend & Development"
	})),
	...[
		"React Native",
		"Node.js",
		"Express.js",
		".NET 8",
		"MongoDB"
	].map((n, i) => ({
		id: `aa${i}`,
		name: n,
		category: "App Architecture"
	})),
	...[
		"Microsoft Office Word",
		"Microsoft Office PowerPoint",
		"Microsoft Office Excel"
	].map((n, i) => ({
		id: `os${i}`,
		name: n,
		category: "Office Software"
	})),
	...[
		"C++",
		"Python",
		"SQL"
	].map((n, i) => ({
		id: `pl${i}`,
		name: n,
		category: "Programming Languages"
	})),
	...[
		"Canva",
		"Capcut",
		"Clipchamp",
		"Sketch Book"
	].map((n, i) => ({
		id: `gd${i}`,
		name: n,
		category: "Graphic Design"
	})),
	...[
		"Ubuntu",
		"VirtualBox",
		"Machine Learning",
		"Artificial Intelligence",
		"Data Science",
		"Cyber Security Fundamentals"
	].map((n, i) => ({
		id: `ei${i}`,
		name: n,
		category: "Emerging Infrastructure"
	}))
];
var SKILL_CATEGORIES = [
	"Frontend & Development",
	"App Architecture",
	"Office Software",
	"Programming Languages",
	"Graphic Design",
	"Emerging Infrastructure"
];
var DEFAULT_PROJECTS = [
	{
		id: "p1",
		title: "Edge Resume Parser 2026 (Full & Core)",
		description: "On-device resume parsing pipeline with edge-optimized inference.",
		tech: "Python, Transformers, ONNX, NLP",
		category: "NLP"
	},
	{
		id: "p2",
		title: "Universal Model Orchestrator",
		description: "Unified orchestration layer for multiple ML/LLM models.",
		tech: "Python, FastAPI, LangChain, Docker",
		category: "ML"
	},
	{
		id: "p3",
		title: "Agri-Shield 2026 — Plant Disease Detection",
		description: "Computer vision model for early plant disease detection.",
		tech: "PyTorch, CNN, OpenCV",
		category: "CV"
	},
	{
		id: "p4",
		title: "AI Resume Screening System",
		description: "Automated resume scoring & candidate ranking system.",
		tech: "Python, scikit-learn, NLP, Streamlit",
		category: "NLP"
	},
	{
		id: "p5",
		title: "Toxic Comment Detector",
		description: "Multi-label toxic comment classification with transformers.",
		tech: "Python, BERT, Transformers",
		category: "NLP"
	},
	{
		id: "p6",
		title: "AI Chatbot",
		description: "Conversational AI assistant with context memory.",
		tech: "Python, LLM, LangChain",
		category: "NLP"
	},
	{
		id: "p7",
		title: "Expense Tracker App (React Native)",
		description: "Mobile expense tracking app with charts and budgets.",
		tech: "React Native, Expo, AsyncStorage",
		category: "Mobile"
	},
	{
		id: "p8",
		title: "Weather App (React Native)",
		description: "Real-time weather app with location services.",
		tech: "React Native, REST API",
		category: "Mobile"
	},
	{
		id: "p9",
		title: "Task Manager App",
		description: "Productivity task manager with reminders.",
		tech: "React Native, MongoDB, Express",
		category: "Mobile"
	},
	{
		id: "p10",
		title: "Developer Cheatsheets",
		description: "Curated developer cheatsheets reference site.",
		tech: "HTML, CSS, JavaScript",
		category: "Web"
	}
];
var DEFAULT_CERTIFICATIONS = [
	{
		id: "c1",
		title: "Introduction to Programming and Basic Python",
		org: "Kaggle",
		date: ""
	},
	{
		id: "c2",
		title: "Numpy for DataScience Real time Experience",
		org: "Udemy",
		date: ""
	},
	{
		id: "c3",
		title: "Python with Numpy for DS & ML",
		org: "Udemy",
		date: ""
	},
	{
		id: "c4",
		title: "Data Science & Analysis",
		org: "HP-Foundation",
		date: ""
	},
	{
		id: "c5",
		title: "Artificial Intelligence",
		org: "MIND LABS sMc Pvt Ltd",
		date: ""
	},
	{
		id: "c6",
		title: "Numpy & Matplotlib",
		org: "Data-Camp",
		date: ""
	},
	{
		id: "c7",
		title: "Problems Algorithms and Flowcharts",
		org: "University of London – Coursera",
		date: ""
	},
	{
		id: "c8",
		title: "Tools for Data Science",
		org: "IBM – Coursera",
		date: ""
	},
	{
		id: "c9",
		title: "What is Data Science",
		org: "IBM – Coursera",
		date: ""
	},
	{
		id: "c10",
		title: "The Data Science Profession",
		org: "University of London – Coursera",
		date: ""
	}
];
var HF_SPACES = [
	"edge-resume-parser-2026",
	"universal-model-orchestrator",
	"agri-shield-2026",
	"ai-resume-screening",
	"toxic-comment-detector",
	"ai-chatbot",
	"ds-playground"
];
var DEFAULT_CONTACT = {
	email: "sanaullah786shah92@gmail.com",
	github: "https://github.com/sanaullah-ai",
	hf: "https://huggingface.co/sanaullah7964",
	linkedin: "https://linkedin.com/in/sanaullah"
};
//#endregion
//#region src/lib/use-portfolio.ts
var KEY = "sanaullah_portfolio_v1";
var DEFAULT = {
	bio: DEFAULT_BIO,
	education: DEFAULT_EDUCATION,
	experience: DEFAULT_EXPERIENCE,
	skills: DEFAULT_SKILLS,
	projects: DEFAULT_PROJECTS,
	certifications: DEFAULT_CERTIFICATIONS,
	contact: DEFAULT_CONTACT,
	cvDownloads: 0,
	achievements: {
		honors: "",
		hackathons: "",
		papers: ""
	}
};
function usePortfolio() {
	const [store, setStore] = useState(DEFAULT);
	const [hydrated, setHydrated] = useState(false);
	useEffect(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) setStore({
				...DEFAULT,
				...JSON.parse(raw)
			});
		} catch {}
		setHydrated(true);
	}, []);
	useEffect(() => {
		if (hydrated) try {
			localStorage.setItem(KEY, JSON.stringify(store));
		} catch {}
	}, [store, hydrated]);
	return {
		store,
		setStore,
		update: useCallback((p) => setStore((s) => ({
			...s,
			...p
		})), []),
		reset: useCallback(() => setStore(DEFAULT), []),
		hydrated
	};
}
var ADMIN_KEY = "sanaullah_admin_v1";
var ADMIN_TS = "sanaullah_admin_ts_v1";
var TIMEOUT_MS = 900 * 1e3;
function useAdmin() {
	const [isAdmin, setIsAdmin] = useState(false);
	useEffect(() => {
		try {
			const ok = localStorage.getItem(ADMIN_KEY) === "1";
			const ts = Number(localStorage.getItem(ADMIN_TS) || 0);
			if (ok && Date.now() - ts < TIMEOUT_MS) setIsAdmin(true);
			else {
				localStorage.removeItem(ADMIN_KEY);
				localStorage.removeItem(ADMIN_TS);
			}
		} catch {}
	}, []);
	useEffect(() => {
		if (!isAdmin) return;
		const touch = () => {
			try {
				localStorage.setItem(ADMIN_TS, String(Date.now()));
			} catch {}
		};
		touch();
		const events = [
			"click",
			"keydown",
			"mousemove",
			"scroll"
		];
		events.forEach((e) => window.addEventListener(e, touch));
		const i = setInterval(() => {
			const ts = Number(localStorage.getItem(ADMIN_TS) || 0);
			if (Date.now() - ts > TIMEOUT_MS) {
				setIsAdmin(false);
				try {
					localStorage.removeItem(ADMIN_KEY);
					localStorage.removeItem(ADMIN_TS);
				} catch {}
			}
		}, 3e4);
		return () => {
			events.forEach((e) => window.removeEventListener(e, touch));
			clearInterval(i);
		};
	}, [isAdmin]);
	const login = (pw) => {
		if (pw === "Sanaullah7964") {
			setIsAdmin(true);
			try {
				localStorage.setItem(ADMIN_KEY, "1");
				localStorage.setItem(ADMIN_TS, String(Date.now()));
			} catch {}
			return true;
		}
		return false;
	};
	const logout = () => {
		setIsAdmin(false);
		try {
			localStorage.removeItem(ADMIN_KEY);
			localStorage.removeItem(ADMIN_TS);
		} catch {}
	};
	return {
		isAdmin,
		login,
		logout
	};
}
var THEME_KEY = "sanaullah_theme_v1";
function useTheme() {
	const [theme, setTheme] = useState("light");
	useEffect(() => {
		setTheme(localStorage.getItem(THEME_KEY) || "light");
	}, []);
	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		try {
			localStorage.setItem(THEME_KEY, theme);
		} catch {}
	}, [theme]);
	return {
		theme,
		setTheme,
		toggle: () => setTheme((t) => t === "dark" ? "light" : "dark")
	};
}
async function compressImage(file, maxW = 1200, quality = .7) {
	const dataUrl = await new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(r.result);
		r.onerror = rej;
		r.readAsDataURL(file);
	});
	if (!file.type.startsWith("image/")) return dataUrl;
	const img = new Image();
	img.src = dataUrl;
	await new Promise((r) => img.onload = r);
	const scale = Math.min(1, maxW / img.width);
	const w = img.width * scale, h = img.height * scale;
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	c.getContext("2d").drawImage(img, 0, 0, w, h);
	return c.toDataURL("image/jpeg", quality);
}
async function fileToBase64(file) {
	return await new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(r.result);
		r.onerror = rej;
		r.readAsDataURL(file);
	});
}
//#endregion
//#region src/components/portfolio/NeuralCanvas.tsx
function NeuralCanvas() {
	const ref = useRef(null);
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	useEffect(() => {
		if (!mounted) return;
		const c = ref.current;
		const ctx = c.getContext("2d");
		let raf = 0;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const resize = () => {
			const r = c.getBoundingClientRect();
			c.width = r.width * dpr;
			c.height = r.height * dpr;
		};
		resize();
		window.addEventListener("resize", resize);
		const N = 50;
		const nodes = Array.from({ length: N }, () => ({
			x: Math.random() * c.width,
			y: Math.random() * c.height,
			vx: (Math.random() - .5) * .4 * dpr,
			vy: (Math.random() - .5) * .4 * dpr
		}));
		let mouseX = -9999, mouseY = -9999;
		const move = (e) => {
			const r = c.getBoundingClientRect();
			mouseX = (e.clientX - r.left) * dpr;
			mouseY = (e.clientY - r.top) * dpr;
		};
		c.addEventListener("mousemove", move);
		const tick = () => {
			const accent = document.documentElement.classList.contains("dark") ? "239,68,68" : "220,38,38";
			ctx.clearRect(0, 0, c.width, c.height);
			for (const n of nodes) {
				n.x += n.vx;
				n.y += n.vy;
				if (n.x < 0 || n.x > c.width) n.vx *= -1;
				if (n.y < 0 || n.y > c.height) n.vy *= -1;
				const dx = n.x - mouseX, dy = n.y - mouseY;
				const d = Math.hypot(dx, dy);
				if (d < 150 * dpr) {
					n.vx += dx / d * .05;
					n.vy += dy / d * .05;
				}
				n.vx = Math.max(-1.5, Math.min(1.5, n.vx));
				n.vy = Math.max(-1.5, Math.min(1.5, n.vy));
			}
			for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
				const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
				const d = Math.hypot(dx, dy);
				if (d < 140 * dpr) {
					ctx.strokeStyle = `rgba(${accent},${.4 * (1 - d / (140 * dpr))})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(nodes[i].x, nodes[i].y);
					ctx.lineTo(nodes[j].x, nodes[j].y);
					ctx.stroke();
				}
			}
			for (const n of nodes) {
				ctx.fillStyle = `rgba(${accent},0.9)`;
				ctx.beginPath();
				ctx.arc(n.x, n.y, 2.2 * dpr, 0, Math.PI * 2);
				ctx.fill();
			}
			raf = requestAnimationFrame(tick);
		};
		tick();
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
			c.removeEventListener("mousemove", move);
		};
	}, [mounted]);
	return /* @__PURE__ */ jsx("canvas", {
		ref,
		className: "absolute inset-0 w-full h-full"
	});
}
//#endregion
//#region src/components/portfolio/Typewriter.tsx
var PHRASES = [
	"Machine Learning",
	"Deep Learning",
	"Natural Language Processing",
	"Computer Vision",
	"Data Science"
];
function Typewriter() {
	const [i, setI] = useState(0);
	const [text, setText] = useState("");
	const [del, setDel] = useState(false);
	useEffect(() => {
		const cur = PHRASES[i];
		const t = setTimeout(() => {
			if (!del) {
				const next = cur.slice(0, text.length + 1);
				setText(next);
				if (next === cur) setTimeout(() => setDel(true), 1400);
			} else {
				const next = cur.slice(0, text.length - 1);
				setText(next);
				if (next === "") {
					setDel(false);
					setI((i + 1) % PHRASES.length);
				}
			}
		}, del ? 35 : 70);
		return () => clearTimeout(t);
	}, [
		text,
		del,
		i
	]);
	return /* @__PURE__ */ jsx("span", {
		className: "caret font-mono text-primary neon-text",
		children: text
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var SECTIONS = [
	{
		id: "home",
		label: "Home"
	},
	{
		id: "about",
		label: "About"
	},
	{
		id: "skills",
		label: "Skills"
	},
	{
		id: "projects",
		label: "Projects"
	},
	{
		id: "hf",
		label: "HuggingFace"
	},
	{
		id: "experience",
		label: "Experience"
	},
	{
		id: "certs",
		label: "Certifications"
	},
	{
		id: "vault",
		label: "Vault"
	},
	{
		id: "contact",
		label: "Contact"
	}
];
function uid() {
	return Math.random().toString(36).slice(2, 10);
}
function Home() {
	const { store, update, hydrated } = usePortfolio();
	const { isAdmin, login, logout } = useAdmin();
	const { theme, toggle } = useTheme();
	const [showLogin, setShowLogin] = useState(false);
	const [pw, setPw] = useState("");
	const [scroll, setScroll] = useState(0);
	const [showTop, setShowTop] = useState(false);
	const [projFilter, setProjFilter] = useState("ALL");
	const [projSearch, setProjSearch] = useState("");
	const [projModal, setProjModal] = useState(null);
	const [lightbox, setLightbox] = useState(null);
	const [costTokens, setCostTokens] = useState(1e3);
	useEffect(() => {
		const on = () => {
			const h = document.documentElement;
			setScroll(h.scrollTop / (h.scrollHeight - h.clientHeight) * 100);
			setShowTop(h.scrollTop > 600);
		};
		on();
		window.addEventListener("scroll", on);
		return () => window.removeEventListener("scroll", on);
	}, []);
	const handleLogin = () => {
		if (login(pw)) {
			setShowLogin(false);
			setPw("");
			toast.success("Admin unlocked");
		} else toast.error("Incorrect password");
	};
	const exportJSON = () => {
		const raw = localStorage.getItem("sanaullah_portfolio_v1") || "{}";
		navigator.clipboard.writeText(raw).then(() => toast.success("Database JSON copied to clipboard"));
		const blob = new Blob([raw], { type: "application/json" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = "portfolio-db.json";
		a.click();
	};
	const copyEmail = () => {
		navigator.clipboard.writeText(store.contact.email).then(() => toast.success("Email copied"));
	};
	const onResumeUpload = async (f) => {
		update({
			resumeBase64: await fileToBase64(f),
			resumeName: f.name
		});
		toast.success("Resume saved");
	};
	const downloadResume = () => {
		if (!store.resumeBase64) return toast.error("No resume uploaded");
		const a = document.createElement("a");
		a.href = store.resumeBase64;
		a.download = store.resumeName || "resume.pdf";
		a.click();
		update({ cvDownloads: store.cvDownloads + 1 });
		toast.success("Download started");
	};
	const projectCats = useMemo(() => Array.from(new Set(store.projects.map((p) => p.category || "Other"))), [store.projects]);
	const filteredProjects = useMemo(() => store.projects.filter((p) => {
		const okCat = projFilter === "ALL" || p.category === projFilter;
		const okQ = !projSearch || (p.title + p.tech + p.description).toLowerCase().includes(projSearch.toLowerCase());
		return okCat && okQ;
	}), [
		store.projects,
		projFilter,
		projSearch
	]);
	const radarData = useMemo(() => SKILL_CATEGORIES.map((cat) => ({
		category: cat.replace(" & ", " /\n"),
		value: store.skills.filter((s) => s.category === cat).length
	})), [store.skills]);
	if (!hydrated) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen grid place-items-center bg-background",
		children: /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" })
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ jsx(Toaster, {
				theme,
				richColors: true,
				position: "top-right"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "fixed top-0 left-0 right-0 h-0.5 bg-primary z-[60]",
				style: {
					width: `${scroll}%`,
					boxShadow: "0 0 10px currentColor"
				}
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4",
					children: [
						/* @__PURE__ */ jsxs("a", {
							href: "#home",
							className: "font-mono font-bold text-lg tracking-tight",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-primary neon-text",
									children: "S"
								}),
								"anaullah",
								/* @__PURE__ */ jsx("span", {
									className: "text-primary",
									children: "_"
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "hidden md:flex items-center gap-1 ml-4 text-sm",
							children: SECTIONS.map((s) => /* @__PURE__ */ jsx("a", {
								href: `#${s.id}`,
								className: "px-3 py-1.5 rounded-md hover:bg-accent hover:text-primary transition-colors",
								children: s.label
							}, s.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "ml-auto flex items-center gap-2",
							children: [
								isAdmin && /* @__PURE__ */ jsxs("span", {
									className: "hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-primary text-primary neon-glow",
									children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-pulse" }), " ADMIN"]
								}),
								isAdmin && /* @__PURE__ */ jsxs("button", {
									onClick: exportJSON,
									className: "hidden sm:inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-border hover:border-primary",
									children: [/* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }), " Export JSON"]
								}),
								isAdmin && /* @__PURE__ */ jsxs("button", {
									onClick: logout,
									className: "inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-border hover:border-primary",
									children: [/* @__PURE__ */ jsx(LogOut, { className: "h-3.5 w-3.5" }), " Logout"]
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: toggle,
									"aria-label": "Toggle theme",
									className: "relative h-9 w-9 grid place-items-center rounded-full border border-border hover:border-primary transition-all dark:neon-glow",
									children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => setShowLogin(true),
									"aria-label": "Admin",
									className: "h-9 w-9 grid place-items-center rounded-full border border-border hover:border-primary hover:text-primary transition-all",
									children: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" })
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsxs("section", {
				id: "home",
				className: "relative overflow-hidden border-b border-border",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 grid-bg opacity-60" }),
					/* @__PURE__ */ jsx("div", {
						className: "absolute inset-0",
						children: /* @__PURE__ */ jsx(NeuralCanvas, {})
					}),
					/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background pointer-events-none" }),
					/* @__PURE__ */ jsx("div", {
						className: "relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36",
						children: /* @__PURE__ */ jsxs(motion.div, {
							initial: {
								opacity: 0,
								y: 30
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .8 },
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60 backdrop-blur text-xs font-mono mb-6",
									children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-primary animate-pulse" }), " Available for opportunities"]
								}),
								/* @__PURE__ */ jsxs("h1", {
									className: "text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none",
									children: ["Sana", /* @__PURE__ */ jsx("span", {
										className: "text-primary neon-text",
										children: "ullah"
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-4 text-lg sm:text-xl text-muted-foreground font-mono",
									children: "BSCS Programmer & AI/ML Engineer"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-8 text-2xl sm:text-3xl font-bold min-h-[2.5rem]",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: `> `
									}), /* @__PURE__ */ jsx(Typewriter, {})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-10 flex flex-wrap gap-3",
									children: [
										/* @__PURE__ */ jsx("a", {
											href: "#projects",
											className: "px-5 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition dark:neon-glow",
											children: "View Projects"
										}),
										/* @__PURE__ */ jsx("a", {
											href: "#contact",
											className: "px-5 py-3 rounded-md border border-border hover:border-primary transition",
											children: "Get in Touch"
										}),
										store.resumeBase64 && /* @__PURE__ */ jsxs("button", {
											onClick: downloadResume,
											className: "px-5 py-3 rounded-md border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition inline-flex items-center gap-2",
											children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Resume"]
										})
									]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs(Section, {
				id: "about",
				title: "About",
				icon: /* @__PURE__ */ jsx(GraduationCap, { className: "h-5 w-5" }),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid lg:grid-cols-3 gap-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "lg:col-span-2 p-6 rounded-xl border border-border bg-card",
						children: isAdmin ? /* @__PURE__ */ jsx("textarea", {
							value: store.bio,
							onChange: (e) => update({ bio: e.target.value }),
							className: "w-full min-h-[180px] bg-transparent outline-none resize-none leading-relaxed"
						}) : /* @__PURE__ */ jsx("p", {
							className: "leading-relaxed text-card-foreground/90",
							children: store.bio
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-xl border border-border bg-card",
						children: [/* @__PURE__ */ jsxs("h3", {
							className: "font-bold mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Award, { className: "h-4 w-4 text-primary" }), " Achievements"]
						}), [
							"honors",
							"hackathons",
							"papers"
						].map((k) => /* @__PURE__ */ jsxs("div", {
							className: "mb-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "text-xs uppercase tracking-wider text-muted-foreground mb-1",
								children: k === "honors" ? "Academic Honors" : k === "hackathons" ? "Hackathon Wins" : "ML Research Papers/Preprints"
							}), isAdmin ? /* @__PURE__ */ jsx("input", {
								value: store.achievements[k],
								onChange: (e) => update({ achievements: {
									...store.achievements,
									[k]: e.target.value
								} }),
								placeholder: "Add entry...",
								className: "w-full px-2 py-1 rounded bg-background border border-border text-sm"
							}) : /* @__PURE__ */ jsx("div", {
								className: "text-sm text-muted-foreground italic",
								children: store.achievements[k] || "— placeholder slot —"
							})]
						}, k))]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "font-bold text-lg mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(GraduationCap, { className: "h-5 w-5 text-primary" }), " Education Timeline"]
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [store.education.map((ed) => /* @__PURE__ */ jsxs("div", {
							className: "relative pl-6 p-5 rounded-xl border border-border bg-card group",
							children: [/* @__PURE__ */ jsx("span", { className: "absolute left-0 top-7 -translate-x-1/2 h-3 w-3 rounded-full bg-primary neon-glow" }), isAdmin ? /* @__PURE__ */ jsxs("div", {
								className: "grid sm:grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ jsx(Input, {
										value: ed.uni,
										onChange: (v) => update({ education: store.education.map((x) => x.id === ed.id ? {
											...x,
											uni: v
										} : x) }),
										placeholder: "University"
									}),
									/* @__PURE__ */ jsx(Input, {
										value: ed.degree,
										onChange: (v) => update({ education: store.education.map((x) => x.id === ed.id ? {
											...x,
											degree: v
										} : x) }),
										placeholder: "Degree"
									}),
									/* @__PURE__ */ jsx(Input, {
										value: ed.duration,
										onChange: (v) => update({ education: store.education.map((x) => x.id === ed.id ? {
											...x,
											duration: v
										} : x) }),
										placeholder: "Duration"
									}),
									/* @__PURE__ */ jsx(Input, {
										value: ed.cgpa,
										onChange: (v) => update({ education: store.education.map((x) => x.id === ed.id ? {
											...x,
											cgpa: v
										} : x) }),
										placeholder: "CGPA"
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => update({ education: store.education.filter((x) => x.id !== ed.id) }),
										className: "text-xs text-destructive inline-flex items-center gap-1 self-start",
										children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Purge"]
									})
								]
							}) : /* @__PURE__ */ jsxs(Fragment, { children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-baseline gap-x-3 gap-y-1",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "font-bold",
										children: ed.uni
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-primary",
										children: ed.duration
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: ed.degree
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-sm mt-1",
									children: ["CGPA: ", /* @__PURE__ */ jsx("span", {
										className: "font-mono font-bold text-primary",
										children: ed.cgpa
									})]
								})
							] })]
						}, ed.id)), isAdmin && /* @__PURE__ */ jsxs("button", {
							onClick: () => update({ education: [...store.education, {
								id: uid(),
								uni: "",
								degree: "",
								cgpa: "",
								duration: ""
							}] }),
							className: "px-4 py-2 rounded-md border border-dashed border-border hover:border-primary text-sm inline-flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Education"]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(Section, {
				id: "skills",
				title: "Skills Radar",
				icon: /* @__PURE__ */ jsx(Cpu, { className: "h-5 w-5" }),
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid lg:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "p-6 rounded-xl border border-border bg-card h-[420px]",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ jsxs(RadarChart, {
								data: radarData,
								children: [
									/* @__PURE__ */ jsx(PolarGrid, { stroke: "var(--border)" }),
									/* @__PURE__ */ jsx(PolarAngleAxis, {
										dataKey: "category",
										tick: {
											fill: "var(--foreground)",
											fontSize: 11
										}
									}),
									/* @__PURE__ */ jsx(PolarRadiusAxis, {
										tick: false,
										axisLine: false
									}),
									/* @__PURE__ */ jsx(Radar, {
										dataKey: "value",
										stroke: "var(--primary)",
										fill: "var(--primary)",
										fillOpacity: .35,
										strokeWidth: 2
									})
								]
							})
						})
					}), /* @__PURE__ */ jsx("div", {
						className: "p-6 rounded-xl border border-border bg-card",
						children: /* @__PURE__ */ jsx("div", {
							className: "space-y-4 max-h-[380px] overflow-auto pr-2",
							children: SKILL_CATEGORIES.map((cat) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
								className: "text-xs uppercase tracking-wider text-primary font-mono mb-2",
								children: cat
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap gap-2",
								children: [store.skills.filter((s) => s.category === cat).map((s) => /* @__PURE__ */ jsx("span", {
									className: "group inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs border border-border",
									children: isAdmin ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("input", {
										value: s.name,
										onChange: (e) => update({ skills: store.skills.map((x) => x.id === s.id ? {
											...x,
											name: e.target.value
										} : x) }),
										className: "bg-transparent outline-none w-24"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => update({ skills: store.skills.filter((x) => x.id !== s.id) }),
										children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3 text-destructive" })
									})] }) : s.name
								}, s.id)), isAdmin && /* @__PURE__ */ jsx("button", {
									onClick: () => update({ skills: [...store.skills, {
										id: uid(),
										name: "New Skill",
										category: cat
									}] }),
									className: "px-2 py-1 rounded-full border border-dashed border-border text-xs hover:border-primary inline-flex items-center gap-1",
									children: /* @__PURE__ */ jsx(Plus, { className: "h-3 w-3" })
								})]
							})] }, cat))
						})
					})]
				})
			}),
			/* @__PURE__ */ jsxs(Section, {
				id: "projects",
				title: "Projects",
				icon: /* @__PURE__ */ jsx(Cpu, { className: "h-5 w-5" }),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-3 mb-6 items-center",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
								value: projSearch,
								onChange: (e) => setProjSearch(e.target.value),
								placeholder: "Search projects...",
								className: "pl-9 pr-3 py-2 rounded-md bg-card border border-border focus:border-primary outline-none text-sm w-56"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-2 items-center",
							children: [/* @__PURE__ */ jsx(Filter, { className: "h-3.5 w-3.5 text-muted-foreground" }), ["ALL", ...projectCats].map((c) => /* @__PURE__ */ jsx("button", {
								onClick: () => setProjFilter(c),
								className: `px-3 py-1 rounded-full text-xs border transition ${projFilter === c ? "bg-primary text-primary-foreground border-primary neon-glow" : "border-border hover:border-primary"}`,
								children: c
							}, c))]
						}),
						isAdmin && /* @__PURE__ */ jsxs("button", {
							onClick: () => update({ projects: [...store.projects, {
								id: uid(),
								title: "New Project",
								description: "",
								tech: "",
								category: "ML"
							}] }),
							className: "ml-auto px-3 py-1.5 rounded-md border border-dashed border-primary text-primary text-sm inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Project"]
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5",
					children: filteredProjects.map((p, idx) => /* @__PURE__ */ jsx(ProjectCard, {
						p,
						idx,
						isAdmin,
						onChange: (np) => update({ projects: store.projects.map((x) => x.id === p.id ? np : x) }),
						onDelete: () => update({ projects: store.projects.filter((x) => x.id !== p.id) }),
						onOpen: () => setProjModal(p)
					}, p.id))
				})]
			}),
			/* @__PURE__ */ jsxs(Section, {
				id: "hf",
				title: "HuggingFace Spaces",
				icon: /* @__PURE__ */ jsx(ExternalLink, { className: "h-5 w-5" }),
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground mb-4 font-mono",
						children: "@sanaullah7964 — 7 live Spaces"
					}),
					/* @__PURE__ */ jsx("div", {
						className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
						children: HF_SPACES.map((s) => /* @__PURE__ */ jsxs("a", {
							href: `https://huggingface.co/spaces/sanaullah7964/${s}`,
							target: "_blank",
							rel: "noreferrer",
							className: "group p-4 rounded-xl border border-border bg-card hover:border-primary transition-all hover:-translate-y-1 dark:hover:neon-glow",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs font-mono text-primary",
									children: "🤗 Space"
								}), /* @__PURE__ */ jsx("div", {
									className: "font-bold mt-1 group-hover:text-primary",
									children: s
								})] }), /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary" })]
							}), /* @__PURE__ */ jsxs("div", {
								className: "mt-4 text-xs text-muted-foreground font-mono",
								children: ["huggingface.co/spaces/sanaullah7964/", s]
							})]
						}, s))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 p-6 rounded-xl border border-border bg-card",
						children: [/* @__PURE__ */ jsxs("h3", {
							className: "font-bold mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Cpu, { className: "h-4 w-4 text-primary" }), " Model Cost Calculator"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid sm:grid-cols-2 gap-6 items-center",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: ["Tokens: ", /* @__PURE__ */ jsx("span", {
									className: "text-primary font-mono",
									children: costTokens.toLocaleString()
								})]
							}), /* @__PURE__ */ jsx("input", {
								type: "range",
								min: 100,
								max: 1e5,
								step: 100,
								value: costTokens,
								onChange: (e) => setCostTokens(Number(e.target.value)),
								className: "w-full accent-[var(--primary)] mt-2"
							})] }), /* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-3 text-sm",
								children: [/* @__PURE__ */ jsx(Metric, {
									label: "Llama-3 (8B)",
									cost: `$${(costTokens / 1e3 * 6e-4).toFixed(4)}`,
									latency: `${(costTokens / 50).toFixed(0)}ms`
								}), /* @__PURE__ */ jsx(Metric, {
									label: "DistilBERT",
									cost: `$${(costTokens / 1e3 * 8e-5).toFixed(5)}`,
									latency: `${(costTokens / 200).toFixed(0)}ms`
								})]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx(Section, {
				id: "experience",
				title: "Experience",
				icon: /* @__PURE__ */ jsx(Briefcase, { className: "h-5 w-5" }),
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [store.experience.map((x) => /* @__PURE__ */ jsxs("div", {
						className: "relative pl-6 p-5 rounded-xl border border-border bg-card",
						children: [/* @__PURE__ */ jsx("span", { className: "absolute left-0 top-7 -translate-x-1/2 h-3 w-3 rounded-full bg-primary neon-glow" }), isAdmin ? /* @__PURE__ */ jsxs("div", {
							className: "grid sm:grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ jsx(Input, {
									value: x.company,
									onChange: (v) => update({ experience: store.experience.map((e) => e.id === x.id ? {
										...e,
										company: v
									} : e) }),
									placeholder: "Company"
								}),
								/* @__PURE__ */ jsx(Input, {
									value: x.role,
									onChange: (v) => update({ experience: store.experience.map((e) => e.id === x.id ? {
										...e,
										role: v
									} : e) }),
									placeholder: "Role"
								}),
								/* @__PURE__ */ jsx(Input, {
									value: x.duration,
									onChange: (v) => update({ experience: store.experience.map((e) => e.id === x.id ? {
										...e,
										duration: v
									} : e) }),
									placeholder: "Duration"
								}),
								/* @__PURE__ */ jsx(Input, {
									value: x.tech,
									onChange: (v) => update({ experience: store.experience.map((e) => e.id === x.id ? {
										...e,
										tech: v
									} : e) }),
									placeholder: "Tech"
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: x.desc,
									onChange: (e) => update({ experience: store.experience.map((ex) => ex.id === x.id ? {
										...ex,
										desc: e.target.value
									} : ex) }),
									placeholder: "Description",
									className: "sm:col-span-2 px-3 py-2 rounded bg-background border border-border text-sm"
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: () => update({ experience: store.experience.filter((e) => e.id !== x.id) }),
									className: "text-xs text-destructive inline-flex items-center gap-1",
									children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Purge"]
								})
							]
						}) : /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-wrap items-baseline gap-x-3",
								children: [
									/* @__PURE__ */ jsx("h4", {
										className: "font-bold",
										children: x.role
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "text-primary text-sm",
										children: ["@ ", x.company]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs font-mono text-muted-foreground ml-auto",
										children: x.duration
									})
								]
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-sm mt-2",
								children: x.desc
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: x.tech.split(",").map((t) => /* @__PURE__ */ jsx("span", {
									className: "text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-secondary border border-border",
									children: t.trim()
								}, t))
							})
						] })]
					}, x.id)), isAdmin && /* @__PURE__ */ jsxs("button", {
						onClick: () => update({ experience: [...store.experience, {
							id: uid(),
							company: "",
							role: "",
							duration: "",
							tech: "",
							desc: ""
						}] }),
						className: "px-4 py-2 rounded-md border border-dashed border-border hover:border-primary text-sm inline-flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Experience"]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Section, {
				id: "certs",
				title: "Certifications",
				icon: /* @__PURE__ */ jsx(Award, { className: "h-5 w-5" }),
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative",
					children: [/* @__PURE__ */ jsx("div", { className: "absolute left-4 top-2 bottom-2 w-px bg-border" }), /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [store.certifications.map((c) => /* @__PURE__ */ jsxs("div", {
							className: "relative pl-12 p-4 rounded-xl border border-border bg-card group",
							children: [/* @__PURE__ */ jsx("a", {
								href: c.url || "#",
								target: "_blank",
								rel: "noreferrer",
								className: "absolute left-4 top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary neon-glow hover:scale-150 transition"
							}), isAdmin ? /* @__PURE__ */ jsxs("div", {
								className: "grid sm:grid-cols-2 gap-2",
								children: [
									/* @__PURE__ */ jsx(Input, {
										value: c.title,
										onChange: (v) => update({ certifications: store.certifications.map((x) => x.id === c.id ? {
											...x,
											title: v
										} : x) }),
										placeholder: "Title"
									}),
									/* @__PURE__ */ jsx(Input, {
										value: c.org,
										onChange: (v) => update({ certifications: store.certifications.map((x) => x.id === c.id ? {
											...x,
											org: v
										} : x) }),
										placeholder: "Issuing Org"
									}),
									/* @__PURE__ */ jsx(Input, {
										value: c.url || "",
										onChange: (v) => update({ certifications: store.certifications.map((x) => x.id === c.id ? {
											...x,
											url: v
										} : x) }),
										placeholder: "Verify URL"
									}),
									/* @__PURE__ */ jsx(Input, {
										value: c.date || "",
										onChange: (v) => update({ certifications: store.certifications.map((x) => x.id === c.id ? {
											...x,
											date: v
										} : x) }),
										placeholder: "Date Issued"
									}),
									/* @__PURE__ */ jsxs("label", {
										className: "text-xs inline-flex items-center gap-2 cursor-pointer",
										children: [
											/* @__PURE__ */ jsx(Upload, { className: "h-3 w-3" }),
											" Upload Badge",
											/* @__PURE__ */ jsx("input", {
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: async (e) => {
													const f = e.target.files?.[0];
													if (!f) return;
													const b = await compressImage(f, 400, .8);
													update({ certifications: store.certifications.map((x) => x.id === c.id ? {
														...x,
														badge: b
													} : x) });
												}
											})
										]
									}),
									/* @__PURE__ */ jsxs("button", {
										onClick: () => update({ certifications: store.certifications.filter((x) => x.id !== c.id) }),
										className: "text-xs text-destructive inline-flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Purge"]
									})
								]
							}) : /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-4",
								children: [
									c.badge && /* @__PURE__ */ jsx("button", {
										onClick: () => setLightbox(c.badge),
										className: "shrink-0",
										children: /* @__PURE__ */ jsx("img", {
											src: c.badge,
											alt: "",
											className: "h-12 w-12 rounded object-cover border border-border"
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "font-bold truncate",
											children: c.title
										}), /* @__PURE__ */ jsxs("p", {
											className: "text-sm text-muted-foreground",
											children: [c.org, c.date ? ` • ${c.date}` : ""]
										})]
									}),
									c.url && /* @__PURE__ */ jsxs("a", {
										href: c.url,
										target: "_blank",
										rel: "noreferrer",
										className: "text-xs text-primary inline-flex items-center gap-1 hover:underline shrink-0",
										children: ["Verify ", /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })]
									})
								]
							})]
						}, c.id)), isAdmin && /* @__PURE__ */ jsxs("button", {
							onClick: () => update({ certifications: [...store.certifications, {
								id: uid(),
								title: "",
								org: "",
								url: "",
								date: ""
							}] }),
							className: "ml-12 px-4 py-2 rounded-md border border-dashed border-border hover:border-primary text-sm inline-flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), " Add Certification"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsx(Section, {
				id: "vault",
				title: "Document Vault",
				icon: /* @__PURE__ */ jsx(FileText, { className: "h-5 w-5" }),
				children: /* @__PURE__ */ jsxs("div", {
					className: "p-6 rounded-xl border border-border bg-card",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-3 mb-4",
							children: [/* @__PURE__ */ jsx("h3", {
								className: "font-bold",
								children: "Resume / CV"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xs font-mono text-muted-foreground ml-auto",
								children: [
									"Downloaded ",
									store.cvDownloads,
									" times"
								]
							})]
						}),
						isAdmin && /* @__PURE__ */ jsxs("label", {
							className: "inline-flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-primary text-primary cursor-pointer mr-2",
							children: [
								/* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
								" Upload PDF",
								/* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "application/pdf",
									className: "hidden",
									onChange: (e) => e.target.files?.[0] && onResumeUpload(e.target.files[0])
								})
							]
						}),
						store.resumeBase64 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
							onClick: downloadResume,
							className: "inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground",
							children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), " Download Resume"]
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 h-[500px] rounded-lg overflow-hidden border border-border",
							children: /* @__PURE__ */ jsx("iframe", {
								src: store.resumeBase64,
								className: "w-full h-full",
								title: "Resume Preview"
							})
						})] }) : /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "No resume uploaded yet."
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Section, {
				id: "contact",
				title: "Contact",
				icon: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }),
				children: /* @__PURE__ */ jsxs("div", {
					className: "grid md:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-xl border border-border bg-card",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "font-bold text-2xl",
								children: "Let's build something."
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-muted-foreground mt-2",
								children: "Open to internships, collaborations, and ML/AI projects."
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: copyEmail,
								className: "mt-6 group w-full px-4 py-3 rounded-md border border-border hover:border-primary inline-flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-mono text-sm truncate",
									children: store.contact.email
								}), /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4 text-muted-foreground group-hover:text-primary" })]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "p-6 rounded-xl border border-border bg-card space-y-3",
						children: isAdmin ? /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx(Input, {
								value: store.contact.email,
								onChange: (v) => update({ contact: {
									...store.contact,
									email: v
								} }),
								placeholder: "Email"
							}),
							/* @__PURE__ */ jsx(Input, {
								value: store.contact.github,
								onChange: (v) => update({ contact: {
									...store.contact,
									github: v
								} }),
								placeholder: "GitHub URL"
							}),
							/* @__PURE__ */ jsx(Input, {
								value: store.contact.hf,
								onChange: (v) => update({ contact: {
									...store.contact,
									hf: v
								} }),
								placeholder: "HuggingFace URL"
							}),
							/* @__PURE__ */ jsx(Input, {
								value: store.contact.linkedin,
								onChange: (v) => update({ contact: {
									...store.contact,
									linkedin: v
								} }),
								placeholder: "LinkedIn URL"
							})
						] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
							/* @__PURE__ */ jsx(SocialLink, {
								href: store.contact.github,
								icon: /* @__PURE__ */ jsx(Github, { className: "h-5 w-5" }),
								label: "GitHub",
								sub: store.contact.github.replace(/https?:\/\//, "")
							}),
							/* @__PURE__ */ jsx(SocialLink, {
								href: store.contact.hf,
								icon: /* @__PURE__ */ jsx("span", {
									className: "text-xl",
									children: "🤗"
								}),
								label: "HuggingFace",
								sub: store.contact.hf.replace(/https?:\/\//, "")
							}),
							/* @__PURE__ */ jsx(SocialLink, {
								href: store.contact.linkedin,
								icon: /* @__PURE__ */ jsx(Linkedin, { className: "h-5 w-5" }),
								label: "LinkedIn",
								sub: store.contact.linkedin.replace(/https?:\/\//, "")
							})
						] })
					})]
				})
			}),
			/* @__PURE__ */ jsxs("footer", {
				className: "border-t border-border py-8 text-center text-sm text-muted-foreground font-mono",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Sanaullah — Built with React, TanStack, Framer Motion."
				]
			}),
			/* @__PURE__ */ jsx(AnimatePresence, { children: showTop && /* @__PURE__ */ jsx(motion.button, {
				initial: {
					opacity: 0,
					scale: .5
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				exit: {
					opacity: 0,
					scale: .5
				},
				onClick: () => window.scrollTo({
					top: 0,
					behavior: "smooth"
				}),
				className: "fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center dark:neon-glow z-50",
				children: /* @__PURE__ */ jsx(ArrowUp, { className: "h-5 w-5" })
			}) }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: showLogin && !isAdmin && /* @__PURE__ */ jsx(Modal, {
				onClose: () => setShowLogin(false),
				children: /* @__PURE__ */ jsxs("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mx-auto h-14 w-14 rounded-full bg-primary/10 border border-primary grid place-items-center dark:neon-glow",
							children: /* @__PURE__ */ jsx(Lock, { className: "h-6 w-6 text-primary" })
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "mt-4 text-xl font-bold",
							children: "Admin Access"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: "Enter password to unlock CRUD."
						}),
						/* @__PURE__ */ jsx("input", {
							type: "password",
							autoFocus: true,
							value: pw,
							onChange: (e) => setPw(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && handleLogin(),
							placeholder: "Password",
							className: "mt-6 w-full px-4 py-3 rounded-md bg-background border border-border focus:border-primary outline-none font-mono text-center"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleLogin,
							className: "mt-3 w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold dark:neon-glow",
							children: "Unlock"
						})
					]
				})
			}) }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: projModal && /* @__PURE__ */ jsxs(Modal, {
				onClose: () => setProjModal(null),
				children: [
					projModal.screenshot && /* @__PURE__ */ jsx("img", {
						src: projModal.screenshot,
						alt: "",
						className: "w-full h-64 object-cover rounded-lg border border-border"
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "mt-4 text-2xl font-bold",
						children: projModal.title
					}),
					projModal.category && /* @__PURE__ */ jsx("span", {
						className: "inline-block mt-1 text-xs font-mono text-primary",
						children: projModal.category
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 text-sm",
						children: projModal.description
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: projModal.tech.split(",").map((t) => /* @__PURE__ */ jsx("span", {
							className: "text-xs px-2 py-1 rounded bg-secondary border border-border",
							children: t.trim()
						}, t))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: [
							projModal.github && /* @__PURE__ */ jsxs("a", {
								href: projModal.github,
								target: "_blank",
								rel: "noreferrer",
								className: "px-3 py-2 rounded-md border border-border inline-flex items-center gap-2 text-sm hover:border-primary",
								children: [/* @__PURE__ */ jsx(Github, { className: "h-4 w-4" }), " GitHub"]
							}),
							projModal.hf && /* @__PURE__ */ jsx("a", {
								href: projModal.hf,
								target: "_blank",
								rel: "noreferrer",
								className: "px-3 py-2 rounded-md border border-border inline-flex items-center gap-2 text-sm hover:border-primary",
								children: "🤗 HuggingFace"
							}),
							projModal.demo && /* @__PURE__ */ jsxs("a", {
								href: projModal.demo,
								target: "_blank",
								rel: "noreferrer",
								className: "px-3 py-2 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }), " Demo"]
							})
						]
					})
				]
			}) }),
			/* @__PURE__ */ jsx(AnimatePresence, { children: lightbox && /* @__PURE__ */ jsx(Modal, {
				onClose: () => setLightbox(null),
				large: true,
				children: /* @__PURE__ */ jsx("img", {
					src: lightbox,
					alt: "",
					className: "w-full max-h-[80vh] object-contain"
				})
			}) })
		]
	});
}
function Section({ id, title, icon, children }) {
	return /* @__PURE__ */ jsx("section", {
		id,
		className: "border-b border-border",
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20",
			children: /* @__PURE__ */ jsxs(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: {
					once: true,
					margin: "-50px"
				},
				transition: { duration: .5 },
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 mb-8",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "h-8 w-8 rounded-md bg-primary/10 border border-primary text-primary grid place-items-center dark:neon-glow",
							children: icon
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-3xl sm:text-4xl font-black tracking-tight",
							children: title
						}),
						/* @__PURE__ */ jsx("span", { className: "flex-1 h-px bg-border ml-2" })
					]
				}), children]
			})
		})
	});
}
function Input({ value, onChange, placeholder }) {
	return /* @__PURE__ */ jsx("input", {
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder,
		className: "px-3 py-2 rounded bg-background border border-border focus:border-primary outline-none text-sm w-full"
	});
}
function SocialLink({ href, icon, label, sub }) {
	return /* @__PURE__ */ jsxs("a", {
		href,
		target: "_blank",
		rel: "noreferrer",
		className: "flex items-center gap-3 p-3 rounded-md border border-border hover:border-primary group",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "h-10 w-10 grid place-items-center rounded bg-secondary group-hover:text-primary",
				children: icon
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("div", {
					className: "font-bold",
					children: label
				}), /* @__PURE__ */ jsx("div", {
					className: "text-xs text-muted-foreground truncate",
					children: sub
				})]
			}),
			/* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary" })
		]
	});
}
function Metric({ label, cost, latency }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "p-3 rounded-lg border border-border bg-background",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "text-xs uppercase tracking-wider text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ jsx("div", {
				className: "font-mono text-primary text-lg mt-1",
				children: cost
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "text-xs text-muted-foreground",
				children: ["~", latency]
			})
		]
	});
}
function ProjectCard({ p, idx, isAdmin, onChange, onDelete, onOpen }) {
	const ref = useRef(null);
	const [tilt, setTilt] = useState({
		x: 0,
		y: 0
	});
	return /* @__PURE__ */ jsxs(motion.div, {
		initial: {
			opacity: 0,
			y: 20
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: { once: true },
		transition: { delay: idx * .05 },
		ref,
		onMouseMove: (e) => {
			const r = ref.current.getBoundingClientRect();
			setTilt({
				x: ((e.clientY - r.top) / r.height - .5) * -8,
				y: ((e.clientX - r.left) / r.width - .5) * 8
			});
		},
		onMouseLeave: () => setTilt({
			x: 0,
			y: 0
		}),
		style: { transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` },
		className: "group relative p-5 rounded-xl border border-border bg-card hover:border-primary transition-all dark:hover:neon-glow cursor-pointer",
		onClick: () => !isAdmin && onOpen(),
		children: [
			p.screenshot && /* @__PURE__ */ jsx("img", {
				src: p.screenshot,
				alt: "",
				className: "w-full h-32 object-cover rounded-md mb-3 border border-border"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-2",
				children: [isAdmin ? /* @__PURE__ */ jsx(Input, {
					value: p.title,
					onChange: (v) => onChange({
						...p,
						title: v
					}),
					placeholder: "Title"
				}) : /* @__PURE__ */ jsx("h3", {
					className: "font-bold leading-tight group-hover:text-primary",
					children: p.title
				}), p.category && !isAdmin && /* @__PURE__ */ jsx("span", {
					className: "text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary shrink-0",
					children: p.category
				})]
			}),
			isAdmin ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-2 mt-2",
				children: [
					/* @__PURE__ */ jsx("textarea", {
						value: p.description,
						onChange: (e) => onChange({
							...p,
							description: e.target.value
						}),
						placeholder: "Description",
						className: "w-full text-sm px-3 py-2 rounded bg-background border border-border"
					}),
					/* @__PURE__ */ jsx(Input, {
						value: p.tech,
						onChange: (v) => onChange({
							...p,
							tech: v
						}),
						placeholder: "Tech stack, comma separated"
					}),
					/* @__PURE__ */ jsx(Input, {
						value: p.category || "",
						onChange: (v) => onChange({
							...p,
							category: v
						}),
						placeholder: "Category (ML/NLP/CV/...)"
					}),
					/* @__PURE__ */ jsx(Input, {
						value: p.github || "",
						onChange: (v) => onChange({
							...p,
							github: v
						}),
						placeholder: "GitHub URL"
					}),
					/* @__PURE__ */ jsx(Input, {
						value: p.hf || "",
						onChange: (v) => onChange({
							...p,
							hf: v
						}),
						placeholder: "HuggingFace URL"
					}),
					/* @__PURE__ */ jsx(Input, {
						value: p.demo || "",
						onChange: (v) => onChange({
							...p,
							demo: v
						}),
						placeholder: "Demo URL"
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-xs inline-flex items-center gap-2 cursor-pointer",
						children: [
							/* @__PURE__ */ jsx(Upload, { className: "h-3 w-3" }),
							" Screenshot",
							/* @__PURE__ */ jsx("input", {
								type: "file",
								accept: "image/*",
								className: "hidden",
								onChange: async (e) => {
									const f = e.target.files?.[0];
									if (!f) return;
									onChange({
										...p,
										screenshot: await compressImage(f)
									});
								}
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex justify-between pt-2",
						children: [/* @__PURE__ */ jsxs("button", {
							onClick: onDelete,
							className: "text-xs text-destructive inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }), " Purge Card"]
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs text-primary inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Save, { className: "h-3 w-3" }), " Auto-saved"]
						})]
					})
				]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground mt-2 line-clamp-2",
					children: p.description
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: p.tech.split(",").slice(0, 4).map((t) => /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-mono px-2 py-0.5 rounded bg-secondary border border-border",
						children: t.trim()
					}, t))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 flex gap-3 text-xs text-muted-foreground",
					children: [
						p.github && /* @__PURE__ */ jsxs("a", {
							href: p.github,
							onClick: (e) => e.stopPropagation(),
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1 hover:text-primary",
							children: [/* @__PURE__ */ jsx(Github, { className: "h-3 w-3" }), " Code"]
						}),
						p.hf && /* @__PURE__ */ jsx("a", {
							href: p.hf,
							onClick: (e) => e.stopPropagation(),
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1 hover:text-primary",
							children: "🤗 HF"
						}),
						p.demo && /* @__PURE__ */ jsxs("a", {
							href: p.demo,
							onClick: (e) => e.stopPropagation(),
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-1 hover:text-primary",
							children: [/* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" }), " Demo"]
						})
					]
				})
			] })
		]
	});
}
function Modal({ children, onClose, large }) {
	useEffect(() => {
		const k = (e) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", k);
		return () => window.removeEventListener("keydown", k);
	}, [onClose]);
	return /* @__PURE__ */ jsx(motion.div, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		className: "fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center p-4",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs(motion.div, {
			initial: {
				scale: .95,
				y: 20
			},
			animate: {
				scale: 1,
				y: 0
			},
			exit: {
				scale: .95,
				y: 20
			},
			onClick: (e) => e.stopPropagation(),
			className: `relative bg-card border border-border rounded-xl p-6 w-full ${large ? "max-w-4xl" : "max-w-md"} max-h-[90vh] overflow-auto dark:neon-glow`,
			children: [/* @__PURE__ */ jsx("button", {
				onClick: onClose,
				className: "absolute top-3 right-3 h-8 w-8 rounded-full grid place-items-center hover:bg-secondary",
				children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
			}), children]
		})
	});
}
//#endregion
export { Home as component };
