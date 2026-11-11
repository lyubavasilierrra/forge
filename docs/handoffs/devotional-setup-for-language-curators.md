# Daily Bible Pause: how Claude is set up, and how to set it up yourself

For the language curators (Thai, Chinese) who will run the Daily Bible Pause
workflow. No keys or credentials are in this document. Checked against the
working setup on 2026-11-11.

## 1. Two ways a devotional gets made today

|                       | Local pipeline (Lyuba's machine)                                                                        | JF Studio (Studio Manager)                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Used for              | the long-form devotionals and most Shorts                                                               | editable vertical videos and Shorts a person can fix in the editor |
| Where it runs         | Lyuba's Mac: Mastra scripts + Remotion render                                                           | `manager.jesusfilm.org`, server-side render                        |
| How Claude reaches it | runs repo scripts in a terminal                                                                         | the Forge Shorts MCP + the `shorts-creator` skill                  |
| Needs                 | ElevenLabs and OpenRouter keys, public-domain corpora, film cue files, whisper, ffmpeg, all outside git | your own JF account with Shorts access                             |
| Recommended for you   | no (not portable yet)                                                                                   | **yes**                                                            |

Start with JF Studio. The local pipeline is described in section 5 only so you
know what exists.

## 2. What Claude uses with JF Studio

- **MCP connection**: `forge-shorts`, a remote HTTP server at
  `https://manager.jesusfilm.org/mcp`, authenticated with your own account via
  OAuth (scopes: read, edit, render, and narration only if you will generate
  voice).
- **Skill `shorts-creator`** (by the Studio team): the rules for working in
  Studio (approved voices only, narration limits, render and review handoff).
  Download `shorts-creator.zip` from the Shorts projects page in Studio.
- **Devotional kit** (built for Daily Bible Pause):
  - 18+ visual components already registered in Studio (opening captions,
    step line, verse scroll, verse callout, reflection lines, takeaway,
    closing verse, prayer block, backdrop blur, brand mark, font packs);
  - a generator, `make-devotional-project.py`, that turns a script JSON into
    the Studio create + apply operations;
  - the recipe `docs/studio-devotional-recipe.md` (timeline, components,
    steps, house rules).

  The kit is on the branch `feat/devotional-video-pipeline-handoff` of
  https://github.com/lyubavasilierrra/forge (folder
  `apps/mastra/studio-components/`), and a copy is stored as Studio assets
  named "DBP kit …". It is not merged into JesusFilm/forge `main` yet
  (PR #2207).

- **Team skills** (Daily Bible Pause rules, folder `team-skills/` on the same
  branch, one folder each): `dbp-script` (English master script),
  `dbp-language-adaptation` (adapting the master into your language),
  `dbp-shorts`, `dbp-covers`, `daily-bible-pause-captions`,
  `dbp-publishing`, `dbp-community`.

## 3. Set it up on your machine (Claude Code)

1. Install Claude Code and sign in with your Jesus Film Claude seat.
2. Skill: extract `shorts-creator.zip` into `~/.claude/skills/shorts-creator/`.
3. MCP:
   ```sh
   claude mcp add --transport http --scope user forge-shorts https://manager.jesusfilm.org/mcp
   ```
   then run `/mcp` in Claude Code and sign in through OAuth with your own JF
   account. If you get no Shorts tools, ask Tatai for Shorts access.
4. Kit and recipe:
   ```sh
   git clone https://github.com/lyubavasilierrra/forge.git
   cd forge && git checkout feat/devotional-video-pipeline-handoff
   ```
   Read `docs/studio-devotional-recipe.md` first. The generator needs only
   Python 3.9+ (no install, no fonts).
5. Team skills: copy each `team-skills/<name>/` folder into
   `~/.claude/skills/`, or zip the folder and upload it in claude.ai
   (Customize → Skills → Upload a skill).
6. Test: in a new Claude Code conversation, ask it to list the `forge-shorts`
   tools, then to open an existing project read-only. Only then create one.

## 4. What Claude does and what a person does

| Claude does (with the skills)                                               | A person does                                                             |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| drafts the English master script by the rules; adapts it into your language | approves the English master (Lyuba) and your language version (you)       |
| finds and captures the film footage                                         | picks the story and checks the script is literally true to the passage    |
| builds the Studio project with the generator, applies it, fits timings      | imports the voice presets in the editor (Claude must not create voices)   |
| asks for a narration quote and, with your OK, generates the voice           | approves the cost before narration; one pass + one correction per project |
| requests a render and inspects frames                                       | reviews in the editor, fixes small details, approves                      |
| writes captions, titles, descriptions; makes covers                         | publishes (Studio cannot publish yet)                                     |

## 5. Before Thai and Chinese work

Known gaps, so nobody is surprised:

- **Fonts**: the kit's font packs and the cover fonts (Inter, Literata,
  Montserrat) cover Latin and Cyrillic only. Thai and Chinese text needs new
  font packs in Studio (for example Noto Sans Thai, Noto Sans SC / Noto Serif
  SC) and the same fonts added to `dbp-covers`.
- **Voices**: Studio only offers presets from the JFP ElevenLabs account.
  Thai and Chinese voices have to be added there first, then imported in the
  editor.
- **Scripture**: each language needs a Bible translation whose licence allows
  text-to-audio. Check before the first episode.
- **Language rules**: `dbp-language-adaptation` has Russian rules only.
  Write `references/thai.md` / `chinese.md` in the same format and have
  Lyuba approve one sample episode.
- **Long forms in Studio**: the kit is vertical (1080x1920). The horizontal
  long form is not built in Studio yet; it is an open question for Tatai.

## 6. The local pipeline (for reference)

On the same branch, run from `apps/mastra`: `compose-storyteller.ts` (script:
researcher, one writer, fact checks), `render-one-devotional.ts` (Remotion
render), `cut-devotional-shorts.ts` (Shorts). It also needs gitignored data
(BSB, Ryle and other corpora; the narration cache; the whisper model) and
keys in `apps/mastra/.env.local`. The full recipe is
`docs/handoffs/devotional-new-story-kickoff.md`. It is not set up to run on
another machine yet.

## Who to ask

- Studio access, renders, voices in Studio: Tatai.
- The Daily Bible Pause rules and approvals: Lyuba.
