export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string;
  github?: string;
  hf?: string;
  demo?: string;
  screenshot?: string;
  category?: string;
};
export type Certification = {
  id: string;
  title: string;
  org: string;
  url?: string;
  badge?: string;
  date?: string;
};
export type Skill = { id: string; name: string; category: string };
export type Education = { id: string; uni: string; degree: string; cgpa: string; duration: string };
export type Experience = { id: string; company: string; role: string; duration: string; tech: string; desc: string };

export const DEFAULT_BIO =
  "I’m a BSCS student with a keen interest in technology and a strong desire to learn and grow in the field of computer science. I’m actively seeking opportunities to gain hands-on experience, enhance my skills, and apply my academic knowledge in practical settings. I am enthusiastic, quick to learn, and committed to contributing positively to any team or project I become part of.";

export const DEFAULT_EDUCATION: Education[] = [
  { id: "e1", uni: "Abasyn University Islamabad Campus", degree: "Bachelor of Science in Computer Science", cgpa: "3.83 / 4.00", duration: "January 2023 – Present" },
];

export const DEFAULT_EXPERIENCE: Experience[] = [
  { id: "x1", company: "FriendsWare Solutions", role: "Summer Internship Program 2025", duration: "Summer 2025", tech: ".NET Core, SQL, API Development, GitHub", desc: "Mini CRM System development with .NET Core, SQL, API development, and GitHub collaboration." },
];

export const DEFAULT_SKILLS: Skill[] = [
  ...["HTML","CSS","JavaScript","Bootstrap","Tailwind CSS"].map((n,i)=>({id:`fd${i}`,name:n,category:"Frontend & Development"})),
  ...["React Native","Node.js","Express.js",".NET 8","MongoDB"].map((n,i)=>({id:`aa${i}`,name:n,category:"App Architecture"})),
  ...["Microsoft Office Word","Microsoft Office PowerPoint","Microsoft Office Excel"].map((n,i)=>({id:`os${i}`,name:n,category:"Office Software"})),
  ...["C++","Python","SQL"].map((n,i)=>({id:`pl${i}`,name:n,category:"Programming Languages"})),
  ...["Canva","Capcut","Clipchamp","Sketch Book"].map((n,i)=>({id:`gd${i}`,name:n,category:"Graphic Design"})),
  ...["Ubuntu","VirtualBox","Machine Learning","Artificial Intelligence","Data Science","Cyber Security Fundamentals"].map((n,i)=>({id:`ei${i}`,name:n,category:"Emerging Infrastructure"})),
];

export const SKILL_CATEGORIES = [
  "Frontend & Development",
  "App Architecture",
  "Office Software",
  "Programming Languages",
  "Graphic Design",
  "Emerging Infrastructure",
];

export const DEFAULT_PROJECTS: Project[] = [
  { id: "p1", title: "Edge Resume Parser 2026 (Full & Core)", description: "On-device resume parsing pipeline with edge-optimized inference.", tech: "Python, Transformers, ONNX, NLP", category: "NLP" },
  { id: "p2", title: "Universal Model Orchestrator", description: "Unified orchestration layer for multiple ML/LLM models.", tech: "Python, FastAPI, LangChain, Docker", category: "ML" },
  { id: "p3", title: "Agri-Shield 2026 — Plant Disease Detection", description: "Computer vision model for early plant disease detection.", tech: "PyTorch, CNN, OpenCV", category: "CV" },
  { id: "p4", title: "AI Resume Screening System", description: "Automated resume scoring & candidate ranking system.", tech: "Python, scikit-learn, NLP, Streamlit", category: "NLP" },
  { id: "p5", title: "Toxic Comment Detector", description: "Multi-label toxic comment classification with transformers.", tech: "Python, BERT, Transformers", category: "NLP" },
  { id: "p6", title: "AI Chatbot", description: "Conversational AI assistant with context memory.", tech: "Python, LLM, LangChain", category: "NLP" },
  { id: "p7", title: "Expense Tracker App (React Native)", description: "Mobile expense tracking app with charts and budgets.", tech: "React Native, Expo, AsyncStorage", category: "Mobile" },
  { id: "p8", title: "Weather App (React Native)", description: "Real-time weather app with location services.", tech: "React Native, REST API", category: "Mobile" },
  { id: "p9", title: "Task Manager App", description: "Productivity task manager with reminders.", tech: "React Native, MongoDB, Express", category: "Mobile" },
  { id: "p10", title: "Developer Cheatsheets", description: "Curated developer cheatsheets reference site.", tech: "HTML, CSS, JavaScript", category: "Web" },
];

export const DEFAULT_CERTIFICATIONS: Certification[] = [
  { id: "c1", title: "Introduction to Programming and Basic Python", org: "Kaggle", date: "" },
  { id: "c2", title: "Numpy for DataScience Real time Experience", org: "Udemy", date: "" },
  { id: "c3", title: "Python with Numpy for DS & ML", org: "Udemy", date: "" },
  { id: "c4", title: "Data Science & Analysis", org: "HP-Foundation", date: "" },
  { id: "c5", title: "Artificial Intelligence", org: "MIND LABS sMc Pvt Ltd", date: "" },
  { id: "c6", title: "Numpy & Matplotlib", org: "Data-Camp", date: "" },
  { id: "c7", title: "Problems Algorithms and Flowcharts", org: "University of London – Coursera", date: "" },
  { id: "c8", title: "Tools for Data Science", org: "IBM – Coursera", date: "" },
  { id: "c9", title: "What is Data Science", org: "IBM – Coursera", date: "" },
  { id: "c10", title: "The Data Science Profession", org: "University of London – Coursera", date: "" },
];

export const HF_SPACES = [
  "edge-resume-parser-2026",
  "universal-model-orchestrator",
  "agri-shield-2026",
  "ai-resume-screening",
  "toxic-comment-detector",
  "ai-chatbot",
  "ds-playground",
];

export const DEFAULT_CONTACT = {
  email: "sanaullah786shah92@gmail.com",
  github: "https://github.com/sanaullah-ai",
  hf: "https://huggingface.co/sanaullah7964",
  linkedin: "https://linkedin.com/in/sanaullah",
};

export const ADMIN_PASSWORD = "Sanaullah7964";
