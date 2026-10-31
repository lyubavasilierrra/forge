# Story session brief (Daily Bible Pause)

Every devotional runs in its own session, started by the Calendar session as a nested session
(Lyuba, 2026-10-31). The Calendar session's start message names the story, passage, film and
chapter, the long-form date and the Shorts slots; this file is the rest of the brief.

Talk to Lyuba in Russian, plainly, without jargon. Files, commits and docs stay in English.

1. Name this session "✍️ <Story> <d/m>" with `mcp__ccd_session_mgmt__set_session_title` on
   "self", where <d/m> is the long-form date without the year, e.g. "✍️ Boy with a Spirit 4/11"
   (Lyuba, Oct 31). The stage emoji then moves ✍️ → 🎬 → 📱 → ✅; keep the date when you rename. Write `session: <this session's id>` into the
   story's doc in the calendar's `stories` collection (id = slug of the story).
2. A JESUS-film (1979) story is built the way the JESUS version of Bartimaeus was built (folder
   ~/Desktop/Social Media/Bartimaeus, README line 1: JESUS film ch. 32): the LUMO steps (segment,
   source key, scroll captions, x1.05) do not apply, the credits name the JESUS film, and the
   YouTube description mentions "the JESUS film" in its first two lines. Check the chapter
   against the film itself. Stories follow Luke in order: open by tying back to the previous
   episode where it fits.
3. Follow the recipe in /Users/mac/Forge/.claude/worktrees/devo-lab/docs/handoffs/devotional-new-story-kickoff.md exactly, and work in that worktree. It covers the film source, the storyteller writer, the checks, the RU script and the folder layout. Also follow the memory notes in /Users/mac/.claude/projects/-Users-mac-Forge/memory/ (MEMORY.md is the index), especially:
   - the storyteller path, opening rules, one insight explained, no source names aloud, no dashes, no worn moves;
   - the closing verse from elsewhere (pick one verified BSB verse yourself, no options since 2026-10-30);
   - RU gender-neutral address and the RU playbook.
     If the kickoff doc does not exist yet, stop and tell Lyuba in Russian that the recipe is missing.

4. Hard limits before Lyuba approves:
   - no voice recording, no ElevenLabs calls, no renders, nothing that costs money;
   - no publishing, and nothing in YouTube or Meta.
     Stop with the EN script and the RU script saved in the story folder, plus README.txt with the status line "script draft, waiting for Lyuba's edits".

5. End with one short Russian message to Lyuba:
   - the story and its planned date;
   - where the two scripts are;
   - the closing verse you picked (no options; she asks if she wants another);
   - anything you were unsure about.
     Do not ask "should I continue?". After her approval everything runs on its own, in this same session (Lyuba, 2026-10-31): voice and render, the three covers, the captions, and READY TO PUBLISH to the Publishing session once she approves the video and cover; then the Shorts she approved. Ask her only for approvals.
6. Calendar rows this story owns (added by the Calendar session, 2026-10-22): query the content calendar (ArtifactData query, url https://claude.ai/artifact/BUdriP79dkGFDPR89MY1dt, collection "posts", where story == <this story>) and add every planned row to README.txt as a to-do list. Since Oct 27 that includes a YouTube Community post (kind "post", cut post-verse / post-poll / post-fact) on the day AFTER the long form, 10:00, YouTube EN + RU only. Format: post-verse = verse image, post-poll = a poll, post-fact = a story or language fact with an image; the story may swap formats within its week if Lyuba agrees, but each week keeps one of each (tell the Calendar session local_44bbf027-2d85-47da-a007-99399f6735f4 (Calendar) if you swap). This session makes the post (text + image, EN + RU) with its captions file, logs it as READY TO PUBLISH, and Publishing posts or schedules it (Saturday posts are scheduled by Friday). Do not make it before the script is approved.

7. Open decisions on the content page: whenever you wait on Lyuba (script approval, verse choice, topic choice, cover approval, opening/closing lines), write it into the calendar's `stories` collection, doc id = slug of the story (e.g. "lost-sheep"): { todo: [{ piece, lang, stage, text, options, link }] } — recipe in docs/content-calendar/README.md, section "Content view and open decisions". Remove items once she has decided. This is the only collection a story session writes.

8. Shorts (Lyuba, 2026-10-22): at most 4 Shorts per story, 3 is fine. Intro and film-verse are always made; insight, verse and reflection only when this story has a strong one. From 2026-10-30 the review doc is split by language (Intro, Русский, English, Review): each language tab = long-form script, then the 3-4 Shorts (exact spoken/on-screen words per Short, then a visual line, dividers between them), then Captions. No verse options: pick the verse yourself. See docs/handoffs/devotional-new-story-kickoff.md step 8. Once she approves, make only what she approves, and tell the Calendar session (local_44bbf027-2d85-47da-a007-99399f6735f4 (Calendar)) which planned Short rows to drop. Details: docs/devotional-shorts-playbook.md, section 0.

9. Reflection OR verse Short, never both (Lyuba, 2026-10-22): they alternate story to story. Look up this story's turn in docs/content-calendar/README.md, "Reflection / verse rotation", and offer only that one in the Shorts table.

10. Previews on the calendar page (Lyuba, 2026-10-23): whenever you send Lyuba a video to approve, also upload it to the calendar artifact and put it in your stories todo item as "video": "/\_blob/<id>" so she can watch and press Approve / Needs changes there. Shorts as they are; long forms as a light 480p preview under 20 MB made in your scratchpad (no copies on the Desktop). Her answers reach you via the Calendar session. Recipe: docs/content-calendar/README.md, "Content view and open decisions".
