# Portfolio copy draft

Draft copy for review/edit before the UI build. Edit anything, leave notes inline, and I'll fold changes in before handoff to the design phase.

---

## Hero

**Patrick O'Reilly**
Graduate Software Engineer — AI & Agentic Systems

First Class Honours Computer Science student at the University of Galway, currently building agentic AI services at HPE. I like systems that reason, not just respond — multi-agent architectures, evals, and the unglamorous plumbing that makes LLMs reliable in production.

*(CTA buttons: View Projects / Download Resume)*

**Availability line (shown under the CTAs):** Available for graduate software engineering roles from September 2027

---

## About

I'm a final-year Computer Science student at the University of Galway (First Class Honours, Excellence Scholarship, University Scholar), graduating in 2027. I've spent the last two internships at HPE building agentic AI systems — the kind of work where "the demo worked" and "it survives production" are very different bars, and I care about closing that gap.

Outside of coursework and internships, I build things that start from a question I actually want answered: can a model predict when I'm about to blunder at chess, can a group of specialist agents out-diagnose a single generalist one, can an AI game master run a coherent story for ten people at once. I play competitive chess for the Connacht team on Chess.com, and I've run the Great Limerick Run half marathon — both of which, not entirely coincidentally, show up in my project list.

*(Photos: headshot.png for the portrait, speaking.jpg for a "presenting" secondary shot — e.g. giving a tech talk to 100+ students at ATU)*

**Note for Patrick:** confirm you're happy with "graduating in 2027" — your CV says "Seeking a graduate role from September 2027," want to double check that's still accurate before this goes live.

---

## Experience

### Hewlett Packard Enterprise — Innovation Engineering AI Intern
*Jan 2026 – Present (part-time from Sept 2026) · Galway*

Python, LangGraph, Google ADK, MCP, PostgreSQL, Docker, Kubernetes, OAuth, Langfuse

- Prototype AI proofs of concept and present them directly to executive leadership, including CTOs, before production handoff.
- Co-built an AI tool that turned a manual spreadsheet process into customer upgrade insights in seconds — now being productised.
- Key contributor to the innovation team's fastest-ever proof of concept to reach the product roadmap.
- Designed autonomous multi-agent systems and tool-augmented LLM workflows to automate complex processes.
- Containerised microservices with Docker on Kubernetes, securing service-to-service traffic with token-based OAuth.
- Built an MCP data retrieval service on PostgreSQL with vector schemas, serving low-latency context downstream.
- Owns staging-to-production releases: regression suites, compliance checks, zero live regressions.

### Hewlett Packard Enterprise — Software Engineer Intern
*June 2025 – Aug 2025 · Galway*

Python, LangGraph, Kubernetes, RAG

- Co-developed a LangGraph agent for Kubernetes workload failure remediation, extracting actionable insights from cluster logs.
- Extended the workflow with RAG and persistent memory for context-aware, multi-turn troubleshooting conversations.

---

## Projects

### Full case study — Multi-Agent Software Diagnosis System
*Final Year Project · In Progress · 2026/27*

**Research question:** Can a team of specialist AI agents diagnose problems in a software system more effectively than a single general-purpose coding agent?

Most AI coding agents are generalists — one agent, one context window, trying to hold architecture, tests, performance, and documentation in its head at once. This project tests whether splitting that up into specialist agents (architecture, code quality, testing, performance, usability, accessibility, documentation) coordinated by a reviewing agent actually produces better diagnoses — not just different ones.

**Approach:**
1. **Foundations** — build on SWE-agent or mini-SWE-agent's existing agent-computer interface rather than reinventing tool use and environment interaction from scratch.
2. **Benchmark playground** — turn a supervisor-provided PetClinic assignment set (1 reference repo, ~70 student submissions with real bugs) into a diagnosis benchmark, with precision/recall and severity-ranking metrics defined up front.
3. **Baseline** — run the general-purpose agent across all 70 repos; this is the number to beat.
4. **Multi-agent system** — build the specialist agents plus a coordinator that aggregates, cross-checks, and ranks findings.
5. **Retest** — rerun the full benchmark with the multi-agent system and compare directly against the baseline.

**What's novel here:** the benchmark itself (repurposing real student repos into a scored diagnosis benchmark), the baseline evaluation, the multi-agent architecture, and the empirical result proving — or disproving — that specialists beat a generalist.

*Status: in progress — baseline and benchmark harness underway. This section will be updated with results as the project develops.*

*(Visual: none yet — candidate for a simple architecture diagram once the agent pipeline exists)*

---

### Full case study — Ascend: AI-Powered Study Platform
*Team of 3 engineers*

Java, Spring Boot, AWS (Lambda, DynamoDB, S3), Google ADK, React, TypeScript

Ascend is a study platform that turns PDFs and lecture notes into structured notes, auto-generated quizzes, and a conversational study assistant — built as a microservices application across a 5-service backend and a shared React frontend.

**What I built** (2 of 5 services, plus the corresponding frontend):

- **Notes service** — a serverless backend (Spring Boot on AWS Lambda) handling rich-text note CRUD, module organisation, and PDF ingestion. PDFs are stored in S3 behind presigned URLs and parsed with Apache PDFBox, following clean architecture throughout (controller/service/repository/model separation).
- **Generation service** — a Google ADK agent that takes a PDF snapshot plus a natural-language request ("test my knowledge of DB systems with a hard quiz") and returns structured markdown notes, multiple-choice quizzes, or a tutoring conversation, depending on intent.
- **Frontend** — the React/TypeScript views for both of the above, integrated into Ascend's wider app (rich-text editor, calendar, auth via AWS Cognito).

The interesting problem wasn't the AI call itself — it was making the generation agent intent-aware (notes vs. quiz vs. conversation from the same free-text input) and wiring a serverless PDF pipeline that stays fast under presigned-URL upload/download without a server in the loop.

*(Visuals: ascend-generation-diagram.png — system design; ascend-frontend-screenshot.png — product UI)*

---

### Brief card — Chess Blunder Risk
*In progress · CT4101 Machine Learning coursework*

Can a machine learning model predict whether a player is about to blunder on their next move? A binary classifier trained on ~4,300 of my own Chess.com games (~250k board positions), labelled with Stockfish 16, defining a blunder as a 200+ centipawn evaluation drop. I play competitive chess for the Connacht team — this one started as a question about my own games before it became coursework.

*Status: in progress — data pipeline and baseline stage. Results to follow as the module progresses.*

*(Visual: none committed yet — chart/figure to be added once results exist; use a text-forward card treatment for now)*

[GitHub →](https://github.com/patrick-oreilly/chess-blunder-risk)

---

### Brief card — Route Scouter
*Independent*

Python, Google Cloud, Google Maps API, Conversational AI

A conversational agent that recommends running routes by distance and location from plain-language requests ("surprise me with a cool 10k route in Galway"). Built off the back of training for the Great Limerick Run half marathon — wanted route discovery that didn't involve scrolling Strava segments by hand.

*(Visual: route-scouter-screenshot.png)*

[GitHub →](https://github.com/patrick-oreilly/route-scouter)

---

### Brief card — What Next?
*Independent, built with my brother (and dad)*

Swift, iOS, Vercel (Serverless), Generative AI

An AI game master for 2–10 players: gather your group, and an LLM dynamically narrates a branching turn-based story based on everyone's choices. Built a serverless state API to keep game state and story progression in sync across concurrent players, with quorum-based voting and host-side timestamp verification to stop race conditions when everyone submits their choice at once.

*(Visual: whatnext-screenshot.png)*

[GitHub →](https://github.com/patrick-oreilly/whatNext) *(private — confirm whether to make public before linking, or omit the link and keep this card text/image only)*

---

## Resume

Download: `/resume/Patrick_OReilly_CV.pdf`

---

## Contact

- Email: oreilllypatrick@gmail.com
- LinkedIn: https://www.linkedin.com/in/patrick-o-reilly-79a6662a9
- GitHub: https://github.com/patrick-oreilly

---

## Open items

All resolved — graduating 2027 confirmed, whatNext repo public, LinkedIn added, chess-blunder-risk shipping as "in progress" with no visual for now.
