export const meta = {
  kicker: "Graduate Software Engineer · AI-Focused · HPE",
  headline: "I build agentic AI systems that survive production.",
  sub: "First Class Honours CS student at University of Galway, currently interning at HPE on multi-agent workflows that actually ship, not just demos.",
  location: "Galway, IE",
};

export const about = {
  body: "Outside of internships and coursework, I build things that start from a question I actually want answered: can a model predict when I'm about to blunder at chess, can a group of specialist agents out-diagnose a single generalist one, can an AI game master run a coherent story for ten people at once. I play competitive chess for the Connacht team on Chess.com, and I've run the Great Limerick Run half marathon.",
};

export type TrajectoryEntry = {
  id: string;
  org: string;
  role: string;
  dates: string;
  current: boolean;
  summary: string;
  bullets?: string[];
  stack?: string;
};

export const trajectory: TrajectoryEntry[] = [
  {
    id: "ai-intern",
    org: "Hewlett Packard Enterprise",
    role: "Innovation Engineering AI Intern",
    dates: "Jan 2026 — present",
    current: true,
    summary: "Asked to stay on part-time after the internship, now building multi-agent systems and an MCP retrieval service on the innovation team.",
    bullets: [
      "Prototypes AI proofs of concept and presents them directly to executive leadership, including CTOs, before production handoff.",
      "Co-built an AI tool that turns a manual spreadsheet process into customer upgrade insights in seconds, now being productised.",
      "Designed autonomous multi-agent systems and tool-augmented LLM workflows to automate complex processes.",
      "Built an MCP data retrieval service on PostgreSQL with vector schemas, serving low-latency context downstream.",
    ],
    stack: "Python · LangGraph · Google ADK · MCP · PostgreSQL · Kubernetes · Langfuse",
  },
  {
    id: "swe-intern",
    org: "Hewlett Packard Enterprise",
    role: "Software Engineer Intern",
    dates: "Jun 2025 — Aug 2025",
    current: false,
    summary: "LangGraph agent for Kubernetes workload failure remediation.",
    bullets: [
      "Co-developed a LangGraph agent for Kubernetes workload failure remediation, extracting actionable insights from cluster logs.",
      "Extended the workflow with RAG and persistent memory for context-aware, multi-turn troubleshooting conversations.",
    ],
    stack: "Python · LangGraph · Kubernetes · RAG",
  },
  {
    id: "university",
    org: "University of Galway",
    role: "B.Sc. Computer Science & Information Technology",
    dates: "Sept 2023 — Sept 2027",
    current: true,
    summary: "First Class Honours, Excellence Scholarship, University Scholar.",
    stack: "",
  },
];

export type Project = {
  slug: string;
  title: string;
  status: "in-progress" | "complete";
  statusLabel: string;
  kicker: string;
  stack: string;
  summary: string;
  body?: string[];
  link?: string;
  images?: { src: string; alt: string }[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "fyp-multi-agent-diagnosis",
    title: "Multi-Agent Software Diagnosis System",
    status: "in-progress",
    statusLabel: "In progress",
    kicker: "Final Year Project · 2026/27",
    stack: "Python · LLM Agents · SWE-agent / mini-SWE-agent · Benchmarking",
    summary:
      "Research question: can a team of specialist AI agents diagnose problems in a software system more effectively than a single general-purpose coding agent?",
    body: [
      "Most AI coding agents are generalists: one agent, one context window, trying to hold architecture, tests, performance, and documentation in its head at once. This project tests whether splitting that work across specialist agents (architecture, code quality, testing, performance, usability, accessibility, documentation), coordinated by a reviewing agent, actually produces better diagnoses rather than just different ones.",
      "Approach: build on SWE-agent or mini-SWE-agent's existing agent-computer interface; turn a supervisor-provided PetClinic assignment set (one reference repo, ~70 student submissions with real bugs) into a scored diagnosis benchmark with precision/recall metrics defined up front; run the general-purpose agent across all 70 repos as the baseline to beat; build the specialist agents plus a coordinator; rerun the full benchmark and compare against the baseline.",
    ],
    featured: true,
  },
  {
    slug: "ascend",
    title: "Ascend — AI-Powered Study Platform",
    status: "complete",
    statusLabel: "Complete · team of 3",
    kicker: "Team project",
    stack: "Java · Spring Boot · AWS (Lambda, DynamoDB, S3) · Google ADK · React · TypeScript",
    summary:
      "A study platform that turns PDFs and lecture notes into structured notes, auto-generated quizzes, and a conversational study assistant, built across a 5-service microservices backend.",
    body: [
      "Built 2 of 5 services plus the corresponding frontend: a notes service (serverless, Spring Boot on AWS Lambda, handling rich-text note CRUD and PDF ingestion via S3 presigned URLs and Apache PDFBox), and a generation service, a Google ADK agent that takes a PDF snapshot plus a natural-language request and returns structured notes, quizzes, or a tutoring conversation depending on intent.",
      "The interesting problem wasn't the AI call itself: it was making the generation agent intent-aware and wiring a serverless PDF pipeline that stays fast under presigned-URL upload and download without a server in the loop.",
    ],
    images: [
      { src: "/projects/ascend-generation-diagram.png", alt: "Ascend generation service system design diagram" },
      { src: "/projects/ascend-frontend-screenshot.png", alt: "Ascend frontend product UI" },
    ],
    featured: true,
  },
  {
    slug: "chess-blunder-risk",
    title: "Chess Blunder Risk",
    status: "in-progress",
    statusLabel: "In progress",
    kicker: "CT4101 Machine Learning coursework",
    stack: "Python · scikit-learn · Stockfish",
    summary:
      "Can a model predict whether a player is about to blunder on their next move? A binary classifier trained on ~4,300 of my own Chess.com games (~250k board positions), labelled with Stockfish 16. I play competitive chess for the Connacht team, and this one started as a question about my own games before it became coursework.",
    link: "https://github.com/patrick-oreilly/chess-blunder-risk",
    featured: false,
  },
  {
    slug: "route-scouter",
    title: "Route Scouter",
    status: "complete",
    statusLabel: "Complete",
    kicker: "Independent",
    stack: "Python · Google Cloud · Google Maps API",
    summary:
      "A conversational agent that recommends running routes by distance and location from plain-language requests. Built off the back of training for the Great Limerick Run half marathon.",
    link: "https://github.com/patrick-oreilly/route-scouter",
    images: [{ src: "/projects/route-scouter-screenshot.png", alt: "Route Scouter conversational agent screenshot" }],
    featured: false,
  },
  {
    slug: "what-next",
    title: "What Next?",
    status: "complete",
    statusLabel: "Complete",
    kicker: "Independent, with my brother",
    stack: "Swift · iOS · Vercel (Serverless) · Generative AI",
    summary:
      "An AI game master for 2–10 players: an LLM dynamically narrates a branching turn-based story based on everyone's choices. Built a serverless state API with quorum-based voting and host-side timestamp verification to stop race conditions when everyone submits at once.",
    link: "https://github.com/patrick-oreilly/whatNext",
    images: [{ src: "/projects/whatnext-screenshot.png", alt: "What Next? app screenshot" }],
    featured: false,
  },
  {
    slug: "the-finals-curse",
    title: "The Finals Curse",
    status: "complete",
    statusLabel: "Complete",
    kicker: "Independent",
    stack: "Unity 6 (URP) · C#",
    summary:
      "A 2D puzzle-platformer: a cursed basketball player dunks through five mystical levels to escape before the NBA Finals. Custom ball-throw physics, a gravity-flip ability, and enemy AI built on state machines, all on a modular component-based architecture.",
    link: "https://github.com/patrick-oreilly/theFinalsCurse",
    images: [{ src: "/projects/finals-curse-banner.png", alt: "The Finals Curse game banner" }],
    featured: false,
  },
];

export const references = {
  resume: "/resume/Patrick_OReilly_CV.pdf",
  email: "oreilllypatrick@gmail.com",
  linkedin: "https://www.linkedin.com/in/patrick-o-reilly-79a6662a9",
  github: "https://github.com/patrick-oreilly",
};
