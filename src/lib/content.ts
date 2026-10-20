export const meta = {
  kicker: "Final-Year CS Student · AI Intern at HPE",
  headline: "I build practical agentic workflows and production AI systems.",
  sub: "First Class Honours CS student at University of Galway, currently interning at HPE on the innovation team.",
  availability: "Working part-time at HPE",
  location: "Galway, IE",
};

export const about = {
  body: "Outside of college and work, I build things I'm curious about. Can an LLM answer questions about 1.79 billion NYC taxi trips without making up numbers? I built Taxi Chat to find out: it answered 30 of 33 questions correctly and declined all 12 it shouldn't answer. Now I'm investigating two more questions: can a model tell when I'm about to blunder at chess, and can a team of specialist agents running open-source local models diagnose bugs as well as a single frontier model?",
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
    summary: "Building AI agents and a retrieval service for internal tools.",
    bullets: [
      "Develop and demo AI prototypes to senior leadership, including CTOs, to help decide what gets built next. One made it onto the product roadmap within two months.",
      "Built an MCP retrieval service on PostgreSQL with vector schemas that serves context to downstream internal tools.",
      "Replaced a manual spreadsheet workflow with an AI tool that automates the analysis end-to-end.",
      "Containerised microservices with Docker on Kubernetes, secured service-to-service traffic with token-based OAuth, and run staging-to-production releases with regression tests and compliance checks.",
    ],
    stack: "Python · LangGraph · Google ADK · MCP · PostgreSQL · Docker · Kubernetes · OAuth · Langfuse",
  },
  {
    id: "swe-intern",
    org: "Hewlett Packard Enterprise",
    role: "Software Engineer Intern",
    dates: "Jun 2025 — Aug 2025",
    current: false,
    summary: "LangGraph agent for Kubernetes diagnosis, and a RAG chatbot for internal docs.",
    bullets: [
      "Built a LangGraph agent on my own that scans Kubernetes logs and diagnoses why workloads fail.",
      "Co-developed a chatbot that answers questions from HPE's internal documentation using RAG.",
    ],
    stack: "Python · LangGraph · Kubernetes · RAG",
  },
  {
    id: "university",
    org: "University of Galway",
    role: "B.Sc. Computer Science & Information Technology",
    dates: "Sept 2023 — May 2027",
    current: true,
    summary:
      "First Class Honours (Years 1–3). Excellence Scholarship (2023–24) and University Scholar (2024–25) for exam results.",
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
  question?: string;
  status: "in-progress" | "complete";
  statusLabel: string;
  kicker: string;
  stack: string;
  summary: string;
  body?: string[];
  link?: string;
  demo?: { label: string; href: string };
  secondaryLink?: { label: string; href: string };
  relatedNote?: { label: string; href: string };
  images?: { src: string; alt: string }[];
  video?: { src: string; poster: string; label: string };
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "taxi-chat",
    title: "Taxi Chat",
    question: "Can an LLM answer questions about data without making up numbers?",
    status: "complete",
    statusLabel: "Complete",
    kicker: "Evaluation · Data systems",
    stack: "Python · DuckDB · Jev (TypeSafe) · DeepSeek · FastAPI · React · deck.gl",
    summary:
      "A chatbot over all 1.79 billion NYC taxi and rideshare trips from 2019 to 2025. On 46 questions it had never seen, it got 30 of the 33 it answered right and declined all 12 it couldn't answer.",
    body: [
      "A classification model, [Jev](https://docs.typesafe.ai), picks the question type, place and dates with a confidence for each, and anything below a tuned threshold is declined with the reason. Code turns those choices into SQL, and the language model only phrases the result. A checker rejects any number in the reply that isn't in the query result. The median answer takes 1.4 seconds.",
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
    slug: "chess-coach",
    title: "Chess Coach",
    question: "Which of my chess mistakes keep happening, and can I train them out?",
    status: "complete",
    statusLabel: "Complete",
    kicker: "Algorithms · Engine analysis",
    stack: "TypeScript · Next.js · Stockfish 18 · DeepSeek · SQLite · Chessground",
    summary:
      "A coach that runs on my laptop. It pulls my Chess.com games, checks every move with Stockfish, and turns each big mistake into a puzzle I have to solve again until I get it right. It also flags blunders I made with under 4 seconds thought, and shows where each of my openings is losing games.",
    body: [
      "DeepSeek writes a short explanation of each mistake. Without an API key it falls back to Stockfish's own lines.",
    ],
    link: "https://github.com/patrick-oreilly/chess-coach",
    images: [
      {
        src: "/projects/chess-coach-screenshot.png",
        alt: "Chess Coach game review showing Stockfish 18 evaluation, move diff arrows, and coaching diagnosis",
      },
    ],
    featured: true,
  },
  {
    slug: "ascend",
    title: "Ascend",
    status: "complete",
    statusLabel: "Complete · team of 3",
    kicker: "Agent workflows · Cloud microservices",
    stack: "Java · Spring Boot · AWS (Lambda, DynamoDB, S3) · Google ADK · React · TypeScript",
    summary:
      "A study app my team of three built for lecture PDFs. Upload one, press a button to get notes or a quiz, or ask the chatbot about it.",
    body: [
      "I built two of the five backend services and their frontend. The notes service runs Spring Boot on AWS Lambda: it stores rich-text notes and takes PDF uploads through S3 presigned URLs, reading them with Apache PDFBox. The generation service is a Google ADK agent that writes the notes and quizzes from a PDF and answers questions about it in the chat.",
    ],
    images: [
      { src: "/projects/ascend-generation-diagram.png", alt: "Ascend generation service system design diagram" },
      { src: "/projects/ascend-frontend-screenshot.png", alt: "Ascend frontend product UI" },
    ],
    featured: true,
  },
  {
    slug: "fyp-multi-agent-diagnosis",
    title: "Multi-Agent Diagnosis",
    question: "How close can a free, local AI tool get to Claude Code at finding bugs?",
    status: "in-progress",
    statusLabel: "In progress · FYP",
    kicker: "Local AI · Multi-agent systems",
    stack: "Python · LangGraph · Ollama · Docker · tree-sitter",
    summary:
      "A bug-finding tool that runs entirely on a laptop. Point it at a repo and a team of agents on a small open-weight model looks for bugs and security problems, and your code never leaves the machine. My final year project measures how close that gets to Claude Code.",
    body: [
      "I'm comparing four setups on about 20 copies of a Java app and a Python app with bugs I've planted: one local agent on its own, a fixed team of specialist agents, an orchestrator that decides which agents to spawn, and Claude Code. The agents are my own LangGraph nodes, and every repo runs in a locked-down Docker container.",
    ],
    featured: true,
  },
  {
    slug: "chess-blunder-risk",
    title: "Chess Blunder Risk",
    question: "Can a model tell when I'm about to blunder?",
    status: "in-progress",
    statusLabel: "In progress",
    kicker: "CT4101 Machine Learning coursework",
    stack: "Python · scikit-learn · Stockfish",
    summary:
      "A classifier trained on about 250,000 positions from 4,300 of my own Chess.com games, labelled with Stockfish. I play with a casual club team on Chess.com, and this started as a question about my own games before it became coursework.",
    link: "https://github.com/patrick-oreilly/chess-blunder-risk",
    secondaryLink: { label: "Chess.com →", href: "https://www.chess.com/member/patrickoreilly2" },
    featured: false,
  },
  {
    slug: "chesscom-stats-mcp",
    title: "Chess.com MCP",
    status: "complete",
    statusLabel: "Published on npm",
    kicker: "MCP server · npm package",
    stack: "TypeScript · MCP SDK · Node.js · Chess.com API",
    summary:
      "An MCP server that lets Claude, Cursor or any MCP client answer \"how did I do on Chess.com this month?\" Rather than handing the model a month of raw games, it works out your record, rating changes, streaks and openings first and passes over a few hundred tokens of stats. Install is one npx line, and no API key is needed.",
    link: "https://github.com/patrick-oreilly/chesscom-stats-mcp",
    secondaryLink: { label: "npm →", href: "https://www.npmjs.com/package/chesscom-stats-mcp" },
    video: {
      src: "/projects/chesscom-mcp-demo.mp4",
      poster: "/projects/chesscom-mcp-demo-poster.jpg",
      label: "Screen recording: I ask Claude Code how I did on Chess.com this month, it calls the MCP server, and it answers with my record, rating changes and openings.",
    },
    featured: false,
  },
  {
    slug: "what-next",
    title: "What Next?",
    status: "complete",
    statusLabel: "Complete",
    kicker: "Multiplayer iOS · Serverless",
    stack: "Swift · iOS · Vercel (Serverless) · Generative AI",
    summary:
      "An iOS party game for 2–10 players where an LLM tells the story and everyone votes on what happens next. I built the serverless backend that tracks game state, with quorum voting and host-side timestamps so votes don't collide when everyone submits at once.",
    link: "https://github.com/patrick-oreilly/whatNext",
    images: [{ src: "/projects/whatnext-screenshot.png", alt: "What Next? app screenshot" }],
    featured: false,
  },
  {
    slug: "the-finals-curse",
    title: "The Finals Curse",
    status: "complete",
    statusLabel: "Complete",
    kicker: "Game engineering",
    stack: "Unity 6 (URP) · C#",
    summary:
      "A 2D puzzle-platformer where a cursed basketball player has to get through five levels and escape before the NBA Finals. I built it on my own, including the ball-throw physics, a gravity-flip ability, and enemy AI using state machines.",
    link: "https://github.com/patrick-oreilly/theFinalsCurse",
    images: [{ src: "/projects/finals-curse-banner.png", alt: "The Finals Curse game banner" }],
    featured: false,
  },
];

export type ToolkitGroup = {
  label: string;
  items: string;
};

export const toolkit: ToolkitGroup[] = [
  {
    label: "Languages",
    items: "Python · TypeScript · Java · C# · C · SQL",
  },
  {
    label: "Web & cloud",
    items:
      "Docker · Kubernetes · AWS (Lambda, DynamoDB, S3) · GCP · Spring Boot · FastAPI · Next.js · React · OAuth · CI/CD",
  },
  {
    label: "AI & ML",
    items: "LangGraph · Google ADK · MCP · RAG · Vector search · Ollama · scikit-learn · LLM evaluation · Langfuse",
  },
  {
    label: "Data & practices",
    items: "PostgreSQL · DuckDB · TDD (PyTest) · System design · Regression testing · Production monitoring",
  },
];

export const references = {
  resume: "/resume/Patrick_OReilly_CV.pdf",
  email: "oreilllypatrick@gmail.com",
  linkedin: "https://www.linkedin.com/in/patrick-o-reilly-79a6662a9",
  github: "https://github.com/patrick-oreilly",
};
