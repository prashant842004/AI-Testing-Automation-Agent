# 🤖 AutoTest AI — AI-Powered Browser Test Automation

> Connect your GitHub repo, let AI analyze your code, generate test cases, and run them in a real cloud browser — all automatically.

---

## 🚀 What Is This?

**AutoTest AI** is a full-stack Next.js application that automates the entire QA testing lifecycle for your web projects. It reads your GitHub repository's source code, uses **Google Gemini AI** to intelligently generate relevant test cases, then executes them in a real cloud browser powered by **Browserbase** + **Playwright** — returning pass/fail results with full console logs and session recordings.

No manual test writing. No local browser setup. Just connect, generate, and run.

---

## ✨ Features

- 🔗 **GitHub Integration** — Connect any GitHub repository via OAuth App
- 🧠 **AI-Powered Test Generation** — Gemini 2.5 Flash analyzes your source code and generates 5–10 smart, context-aware test cases
- ☁️ **Cloud Browser Execution** — Tests run in real Chromium browsers on Browserbase's cloud infrastructure
- 📊 **Live Execution Dashboard** — Real-time status updates, console terminal output, and pass/fail tracking
- 🎬 **Session Recordings** — Watch every test run replayed via the Browserbase session URL
- ⚡ **Script Caching** — Generated Playwright scripts are saved to your database and reused for faster subsequent runs
- 🔄 **AI Regeneration Mode** — Force Gemini to regenerate a fresh Playwright script on demand
- 🛠️ **Custom Run Instructions** — Override AI behavior at runtime with custom prompts merged into the generation context
- 🗃️ **Persistent Storage** — All test cases, scripts, logs, and results stored in **Neon PostgreSQL** via **Drizzle ORM**

---

## 🏗️ Architecture & Workflow

```
Workspace
   │
   ▼
Connect GitHub Repo  ──►  Setup GitHub App  ──►  Select Repo
                                                       │
                                                       ▼
                                             Scan Repo using AI
                                                       │
                                                       ▼
                                                   AI Model
                                                       │
                                                       ▼
                                            Generate Test Cases
                                                       │
                                                       ▼
                                      Run Test in Real Browser (Cloud)
                                            │              │
                                            ▼              ▼
                                       BrowserBase    Return Result
```

### Test Case Generation Flow (`/api/test-cases/generate`)

```
Read Repo Content
      │
      ├──► getRepoTree()     ──►  readFileContent()
      │         │                        │
      │    (GitHub API)            (File Content + AI Prompt)
      │                                  │
      └──────────────────────────────────┘
                                         │
                                         ▼
                                      AI Model
                                    (Gemini 2.5)
                                         │
                                         ▼
                              Test Case { Title, Desc,
                              Type, Priority, Route,
                              Files, ExpectedResult }
                                         │
                                  ┌──────┴──────┐
                                  ▼             ▼
                               Title          Desc
                                         │
                                         ▼
                              Browserbase Script
                              (saved to Neon DB)
                                         │
                                         ▼
                         Run test in actual cloud browser
                                         │
                                         ▼
                              Return: Fail or Pass
```

### Test Execution Flow (`/api/test-cases/run`)

```
Run Test Case
      │
      ▼
Is Script Cached in DB?
      │               │
     Yes             No
      │               │
      ▼               ▼
 Mark Running    Generate Script
      │          (Gemini AI)
      └────────────────┘
                │
                ▼
    Create Browserbase Session
                │
                ▼
    Run Script & Log Results
                │
          ┌─────┴─────┐
          ▼           ▼
        Pass        Fail
    (Save logs,  (Save logs,
     sessionId)   sessionId)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| AI Model | Google Gemini 2.5 Flash (`@google/genai`) |
| Browser Automation | Playwright + Browserbase SDK |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Auth | GitHub OAuth App |
| UI | React, Tailwind CSS, shadcn/ui, Lucide Icons |
| HTTP Client | Axios |

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── test-cases/
│   │   │   ├── generate/route.ts   # AI test case generation endpoint
│   │   │   └── run/route.ts        # Browserbase execution endpoint
│   │   └── ...
│   └── ...
├── components/
│   ├── TestExecutionModal.tsx      # Cloud test runner UI dashboard
│   ├── UserRepoList.tsx            # Repository & test case listing
│   └── ...
├── configs/
│   ├── db.ts                       # Drizzle DB connection
│   └── schema.ts                   # TestCasesTable schema
└── ...
```

---

## ⚙️ Environment Variables

Create a `.env.local` file at the root of your project:

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Browserbase Cloud Browser
BROWSERBASE_API_KEY=your_browserbase_api_key
BROWSERBASE_PROJECT_ID=your_browserbase_project_id

# Neon PostgreSQL (Drizzle ORM)
DATABASE_URL=your_neon_postgres_connection_string

# GitHub OAuth App
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_SECRET=your_github_app_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Browserbase](https://browserbase.com) account and project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- A GitHub OAuth App configured for your domain

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/autotest-ai.git
cd autotest-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your keys in .env.local

# 4. Push database schema
npx drizzle-kit push

# 5. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

```typescript
export const TestCasesTable = pgTable("test_cases", {
  id: serial("id").primaryKey(),

  // Repository context
  userId:     varchar("user_id", { length: 255 }).notNull(),
  repoId:     varchar("repo_id", { length: 255 }),
  repoName:   varchar("repo_name", { length: 255 }).notNull(),
  repoOwner:  varchar("repo_owner", { length: 255 }).notNull(),
  branch:     varchar("branch", { length: 100 }).default("main"),

  // Test case metadata
  title:          varchar("title", { length: 500 }).notNull(),
  description:    text("description").notNull(),
  type:           varchar("type", { length: 100 }).notNull(),   // ui | auth | api | form | integration | edge-case
  priority:       varchar("priority", { length: 50 }).notNull(), // low | medium | high

  // Execution metadata
  targetRoute:        varchar("target_route", { length: 500 }),
  targetFiles:        jsonb("target_files").$type<string[]>().default([]),
  expectedResult:     text("expected_result"),
  browserbaseScript:  text("browserbase_script"),
  status:             varchar("status", { length: 100 }).default("generated"),

  // Session tracking
  sessionId:  varchar("session_id", { length: 255 }),
  sessionUrl: varchar("session_url", { length: 500 }),
  logs:       jsonb("logs").$type<string[]>().default([]),

  createdAt: timestamp("created_at").defaultNow(),
});
```

---

## 📡 API Reference

### `POST /api/test-cases/generate`

Scans a GitHub repository and generates AI-powered test cases.

**Request Body:**
```json
{
  "userId": "user_123",
  "repoId": "repo_456",
  "owner": "your-github-username",
  "repo": "your-repo-name",
  "branch": "main",
  "githubToken": "ghp_xxxxxxxxxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Test cases generated successfully",
  "count": 7,
  "testCases": [ ... ]
}
```

---

### `POST /api/test-cases/run`

Executes a test case in a Browserbase cloud browser session.

**Request Body:**
```json
{
  "testCaseId": 42,
  "baseUrl": "https://your-app.vercel.app",
  "mode": "generate",
  "customPrompt": "Wait 1s after every click"
}
```

| Field | Values | Description |
|---|---|---|
| `mode` | `"cache"` / `"generate"` | Use cached script or force AI regeneration |
| `customPrompt` | string | Additional instructions merged into the AI prompt |

**Response:**
```json
{
  "success": true,
  "status": "passed",
  "sessionId": "abc123",
  "sessionUrl": "https://www.browserbase.com/sessions/abc123",
  "logs": ["[SYSTEM] Connected...", "[BROWSER] Navigating to /sign-in..."],
  "browserbaseScript": "await page.goto(...)"
}
```

---

## 🖥️ UI Components

### `TestExecutionModal`

The main cloud test runner dashboard. Features:

- **Execution Queue** — Lists all selected test cases with live status badges (`Queued`, `Generating...`, `Running`, `Passed`, `Failed`)
- **Target URL Input** — Set the base URL of your application under test
- **Execution Options** — Toggle between `Run Cached` and `AI Regenerate` modes
- **Custom Instructions** — Add runtime-specific instructions to the AI prompt
- **Terminal Output** — Color-coded live console logs (`[SYSTEM]`, `[BROWSER]`, `[ERROR]`)
- **Generated Code Viewer** — Inspect the Playwright script that was run
- **Watch Recording** — Opens the Browserbase session replay in a new tab

---

## 🔍 How AI Test Generation Works

1. **Repo Tree Scan** — Fetches the full file tree from the GitHub API recursively
2. **Smart File Filtering** — Keeps only useful source files (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`, `.md`) from important paths (`app/`, `components/`, `api/`, etc.) while ignoring `node_modules`, `dist`, images, and lock files
3. **Content Reading** — Reads up to 25 source files (first 5,000 characters each)
4. **Gemini Prompt** — Sends the file context to Gemini 2.5 Flash with a structured schema requiring: `title`, `description`, `type`, `priority`, `targetRoute`, `targetFiles`, `expectedResult`
5. **DB Storage** — Saves all generated test cases to Neon PostgreSQL

---

## 🧪 Test Case Types

| Type | Description |
|---|---|
| `ui` | Visual and layout checks |
| `auth` | Login, logout, session management |
| `api` | API endpoint response validation |
| `form` | Form inputs, validation, submission |
| `integration` | Multi-step cross-component flows |
| `edge-case` | Boundary conditions and error states |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev/) — AI model for test case and script generation
- [Browserbase](https://browserbase.com) — Cloud browser infrastructure
- [Playwright](https://playwright.dev/) — Browser automation framework
- [Neon](https://neon.tech) — Serverless PostgreSQL
- [Drizzle ORM](https://orm.drizzle.team/) — TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com/) — UI component library
