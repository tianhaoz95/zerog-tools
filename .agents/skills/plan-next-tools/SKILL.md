---
name: plan-next-tools
description: Research, brainstorm, and plan the next N client-side tools for ZeroG Toolbox, writing a research-backed, checkbox-tracked backlog to ./todo.md. Use when asked to plan the next batch of tools, refresh the roadmap, or generate a new todo backlog. Argument: N = number of tools to plan (default 100).
---

# ZeroG Toolbox — Plan Next Tools

Produce a research-backed backlog of the next **N** tools (default 100) and
write it to `./todo.md`. The backlog is the work queue that build agents
execute one checkbox at a time, so every entry must be concrete, deduplicated,
and buildable under this project's constraints.

Reference example of a finished, fully-executed backlog:
[archive/2026-07-02/todo.md](file:///Users/tianhaozhou/experimental/toolbox/archive/2026-07-02/todo.md)

---

## Step 0 — Archive any previous plan

If `./todo.md` already exists:
* **Fully complete** (all boxes checked): move it to `./archive/<today's date>/todo.md`
  (`git mv` if tracked) per the "Archive of Past Plan Executions" convention in
  `CLAUDE.md`.
* **Partially complete**: ask the user whether to carry unfinished items into the
  new plan or archive as-is. Carried-over items keep their checkbox state.

## Step 1 — Inventory what already exists (dedupe baseline)

The #1 failure mode is planning a tool that already shipped.

1. Extract every shipped tool from the registry:
   ```bash
   grep -E "^\s+(id|title):" src/tools.data.js
   ```
   Note the total count and skim titles/ids by category.
2. Check `./archive/*/todo.md` for previously planned batches — anything listed
   there has either shipped or was already considered.
3. Build the candidate list against this inventory: a candidate is valid only if
   it does not duplicate a shipped tool **or** an obvious variant of one
   (e.g. don't plan "JSON Prettifier" when `json-formatter` exists; a
   *meaningfully different* take — like a JSON-diff or JSONPath tester — is fine).

## Step 2 — Research

Ground the plan in real demand and real client-side feasibility. Use web search
across at least these angles, and keep the source URLs for the output's
"Research Sources" section:

* **Competitor utility sites** — what do IT-Tools, OmniTools, TinyWow, 10015.io,
  SmallDev.tools, etc. offer that we don't?
* **In-browser AI capability** — current Transformers.js / WebGPU / ONNX-runtime
  task list (vision, audio, NLP, multimodal); each supported pipeline task is a
  potential "AI …" tool.
* **Browser platform APIs** — recently-shipped APIs that unlock new tools
  (WebCodecs, File System Access, Web Serial/MIDI/Bluetooth, OPFS, WebGPU,
  Compression Streams…).
* **Trend/keyword demand** — "best free online X tool" roundups, CSS/design
  generator trends, current-year listicles.
* **Heavy-compute WASM ports** — ffmpeg.wasm, sql.js, pyodide, resvg, imagemagick-wasm:
  what conversions/editors become possible fully client-side?

## Step 3 — Brainstorm and filter

Generate **~1.5×N raw candidates**, then filter down to N using these hard
constraints (from `CLAUDE.md` and the `add-new-tool` skill):

* **100% client-side** — no server round-trips; external API calls are forbidden
  (public CORS-friendly read-only endpoints like DNS-over-HTTPS are the rare,
  explicitly-justified exception).
* **Feasible with the existing stack** — vanilla JS + Web Workers + WASM/WebGPU;
  a new heavy dependency must be worth its bundle cost.
* **Fits a category** whose ads can be targeted: prefer existing
  `AD_TOPICS_BY_CATEGORY` keys (`Graphics`, `Audio`, `Text`, `Developer`,
  `Security`, `Calculators`); a genuinely new category is allowed but note that
  it requires a new `AD_TOPICS_BY_CATEGORY` entry.
* **AI tools** must be runnable on-device (WebGPU/WASM) and will carry the
  "AI Powered" badge automatically when the title starts with `AI`.
* **One tool = one focused job** — split multi-purpose ideas into separate entries.

Rank survivors by (demand × feasibility ÷ effort) and keep the top N.

## Step 4 — Write ./todo.md

Match the structure of the example exactly:

```markdown
# 🚀 ZeroG Toolbox — <N> Tools To Build Next

A research-backed backlog of client-side, serverless, browser-native tools to add to ZeroG Toolbox.
All tools must run **entirely client-side** (no server round-trips), follow the project design system, and
AI-powered tools must carry the `.tool-badge.ai` badge per workspace rules.

**Progress:** 0 / <N> complete

> Agent: check the box `[x]` after each tool is built, tested (Playwright), and merged.
> Avoid duplicating the ~<count> tools already shipped (see `src/tools.data.js`).

---

## <emoji> <Category Name> (<start>–<end>)

- [ ] 1. **Tool Name** — One-line pitch of what it does, fully client-side
- [ ] 2. **Next Tool** — …

<more category sections; numbering is continuous across sections>

---

### 📚 Research Sources
- [Source title](url) — one-line note on what it informed
```

Formatting rules:
* Continuous numbering `1…N` across all category sections; section headers show
  their range, e.g. `## 🧑‍💻 Developer & Code (1–20)`.
* Every entry: `- [ ] <n>. **<Name>** — <one-line description>` — the name is
  what the build agent implements from, so make the description specific enough
  to scope the tool (inputs → outputs, key mechanism).
* Group into 5–10 themed categories, largest first.
* All boxes unchecked (`[ ]`) on a fresh plan; carried-over completed items keep `[x]`.
* End with the `📚 Research Sources` list gathered in Step 2.

## Step 5 — Sanity check

* Count the entries — must equal N, numbered without gaps.
* Spot-check ~10 entries against `src/tools.data.js` for duplicates.
* Confirm the "Progress" line and the shipped-tool count in the blockquote are accurate.

Building the tools themselves is **not** part of this skill — that's the
`add-new-tool` skill, executed one checkbox at a time.
