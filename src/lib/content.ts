export const meta = {
  kicker: "Final-Year CS Student · AI Intern at HPE",
  headline: "I build practical agentic workflows and production AI systems.",
  sub: "First Class Honours CS student at University of Galway, currently interning at HPE on the innovation team, building multi-agent workflows.",
  availability: "Working part-time at HPE",
  location: "Galway, IE",
};

export const about = {
  body: "Outside of college and work I build things I'm curious about. Can a model tell when I'm about to blunder at chess? Would a few specialist agents beat one generalist at finding a bug? I don't know yet, so I'm building them to find out.",
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
    summary: "On the innovation team, building agent workflows and a retrieval service.",
    bullets: [
      "I build AI prototypes and demo them to senior leadership, including CTOs, before they go to production.",
      "One of my prototypes made it onto the product roadmap within 2 months.",
      "I built an AI tool that replaces a manual spreadsheet process with automated analysis.",
      "I built multi-agent workflows for internal infrastructure tools.",
      "I built an MCP retrieval service on PostgreSQL with vector schemas that serves context to downstream tools with low latency.",
      "I containerised microservices with Docker on Kubernetes and secured service-to-service traffic with token-based OAuth.",
      "I run releases from staging to production: regression tests, compliance checks, and nothing has broken live.",
      "I've stayed on part-time alongside my final year of college.",
    ],
    stack: "Python · LangGraph · Google ADK · MCP · PostgreSQL · Docker · Kubernetes · OAuth · Langfuse",
  },
  {
    id: "swe-intern",
    org: "Hewlett Packard Enterprise",
    role: "Software Engineer Intern",
    dates: "Jun 2025 — Aug 2025",
    current: false,
    summary: "LangGraph agent for Kubernetes workload failure remediation.",
    bullets: [
      "I co-developed a LangGraph agent that diagnoses Kubernetes workload failures by pulling useful insights out of cluster logs.",
      "I extended it with RAG and persistent memory so it can hold a multi-turn troubleshooting conversation with context.",
    ],
    stack: "Python · LangGraph · Kubernetes · RAG",
  },
  {
    id: "university",
    org: "University of Galway",
    role: "B.Sc. Computer Science & Information Technology",
    dates: "Sept 2023 — Sept 2027",
    current: true,
    summary:
      "First Class Honours (Years 1–3). Excellence Scholarship (2023–24) and University Scholar (2024–25) for top-tier examination results.",
    bullets: [
      "Relevant coursework: Advanced Programming (93%), Data Comms & Networking (92%), Programming Paradigms (90%).",
      "Leaving Certificate: 625 points, the maximum available.",
    ],
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
  secondaryLink?: { label: string; href: string };
  images?: { src: string; alt: string }[];
  video?: { src: string; poster: string; label: string };
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "taxi-chat",
    title: "Taxi Chat",
    status: "complete",
    statusLabel: "Complete",
    kicker: "Independent · open source",
    stack: "Python · DuckDB · Jev (TypeSafe) · DeepSeek · FastAPI · React · deck.gl",
    summary:
      "A chatbot over every NYC taxi and rideshare trip from 2019 to 2025, all 1.79 billion of them, built to decline rather than guess. On 46 held-out questions I wrote without trying them on the bot first, it answered 30 of 33 correctly and declined all 12 it should have, with no answers it should have refused.",
    body: [
      "A classification model picks the question type, place and dates with a confidence for each, and anything below a tuned threshold is declined with the reason. Code turns those choices into SQL, and the language model only phrases the result. A checker rejects any number in the reply that isn't in the query result.",
      "All three wrong answers came from one bug: New Year's Eve 2021 was a Friday, and the small hours of that night were counted in 2022. The held-out run is what found it.",
    ],
    link: "https://github.com/patrick-oreilly/taxi-chat",
    video: {
      src: "/projects/taxi-chat-demo.mp4",
      poster: "/projects/taxi-chat-demo-poster.jpg",
      label: "Screen recording: Taxi Chat ranks the busiest pickup zones of January 2024, compares Brooklyn and Queens, charts monthly yellow cab trips in 2020, answers a question about Billyburg on Friday nights, and declines a question about drivers.",
    },
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
      "The hard part was making the generation agent intent-aware and wiring a serverless PDF pipeline that stays fast under presigned-URL upload and download without a server in the loop.",
    ],
    images: [
      { src: "/projects/ascend-generation-diagram.png", alt: "Ascend generation service system design diagram" },
      { src: "/projects/ascend-frontend-screenshot.png", alt: "Ascend frontend product UI" },
    ],
    featured: true,
  },
  {
    slug: "chesscom-stats-mcp",
    title: "chesscom-stats-mcp",
    status: "complete",
    statusLabel: "Published on npm",
    kicker: "Independent · open source",
    stack: "TypeScript · MCP SDK · Node.js · Chess.com API",
    summary:
      "An MCP server that lets Claude, Cursor or any MCP client answer \"how did I do on Chess.com this month?\" It pulls a month of games and works out my record, rating change per time control, how my wins and losses ended, streaks, best win and worst loss, and how each opening is scoring. It installs with one line through npx and needs no API key.",
    body: [
      "A month of raw PGNs is thousands of tokens and LLMs are bad at counting over them, so the server aggregates the archives upfront and returns a few hundred tokens of typed stats instead.",
    ],
    link: "https://github.com/patrick-oreilly/chesscom-stats-mcp",
    secondaryLink: { label: "npm →", href: "https://www.npmjs.com/package/chesscom-stats-mcp" },
    video: {
      src: "/projects/chesscom-mcp-demo.mp4",
      poster: "/projects/chesscom-mcp-demo-poster.jpg",
      label: "Screen recording: I ask Claude Code how I did on Chess.com this month, it calls the MCP server, and it answers with my record, rating changes and openings.",
    },
    featured: true,
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
  {
    slug: "chess-blunder-risk",
    title: "Chess Blunder Risk",
    status: "in-progress",
    statusLabel: "In progress",
    kicker: "CT4101 Machine Learning coursework",
    stack: "Python · scikit-learn · Stockfish",
    summary:
      "Can a model predict whether a player is about to blunder on their next move? A binary classifier trained on ~4,300 of my own Chess.com games (~250k board positions), labelled with Stockfish 16. I play chess with a casual club team on Chess.com, and this one started as a question about my own games before it became coursework.",
    link: "https://github.com/patrick-oreilly/chess-blunder-risk",
    secondaryLink: { label: "Chess.com →", href: "https://www.chess.com/member/patrickoreilly2" },
    featured: false,
  },
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
];

export type ToolkitGroup = {
  label: string;
  items: string;
};

export const toolkit: ToolkitGroup[] = [
  {
    label: "Languages",
    items: "Python · C# · Java · C · TypeScript · Swift · SQL (PostgreSQL)",
  },
  {
    label: "Backend & cloud",
    items:
      "Docker · Kubernetes · AWS (Lambda, DynamoDB, S3) · GCP · Spring Boot · FastAPI · React · REST · OAuth · CI/CD",
  },
  {
    label: "AI & ML",
    items:
      "Agentic AI · Multi-agent systems · RAG · MCP · LangGraph · Google ADK · scikit-learn · Vector search · LLM evaluation · Langfuse",
  },
  {
    label: "Practices",
    items:
      "TDD (PyTest) · Agile · System design · SOLID · Data pipelines · Production monitoring · Regression testing",
  },
];

export const references = {
  resume: "/resume/Patrick_OReilly_CV.pdf",
  email: "oreilllypatrick@gmail.com",
  linkedin: "https://www.linkedin.com/in/patrick-o-reilly-79a6662a9",
  github: "https://github.com/patrick-oreilly",
};
