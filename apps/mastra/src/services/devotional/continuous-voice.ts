import { createHash } from "node:crypto"

import type { ElevenVoiceSettings, SpokenWord } from "./elevenlabs-voiceover"

/**
 * CONTINUOUS READ on Eleven v4 (owner, 2026-10-05, Bartimaeus): the narration
 * used to be voiced one sentence at a time, so the model never heard what came
 * before or after and every sentence landed on the same flat contour. Here a
 * run of reflection cards in one voice is read in ONE call, with optional v4
 * audio tags ("[thoughtful]") opening a paragraph, and the audio is then cut
 * back into the per-card segments by the word times. Pauses inside the run are
 * the model's own; cards still get the render's gap between them.
 */

export const CONTINUOUS_MODEL = "eleven_v4"

/** `DEVO_V4_SPEED` overrides the reading speed (ElevenLabs caps it at 1.2);
 *  the owner asked for a slightly quicker read on The Rich Fool (2026-10-21). */
const READ_SPEED = Math.min(1.2, Number(process.env.DEVO_V4_SPEED) || 1.15)

/** Bumped whenever the settings below change, so an old take is not replayed.
 *  A non-default speed is part of it, so a faster take never reuses a slower one. */
const VERSION = READ_SPEED === 1.15 ? "c1" : `c1-s${READ_SPEED}`

/** Calm, natural v4 delivery (no whisper, no big emotion), a touch quick. */
const READ: ElevenVoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.85,
  style: 0.35,
  use_speaker_boost: true,
  speed: READ_SPEED,
}

/** The close (takeaway, verse, question and prayer) stays unhurried. */
const CLOSE: ElevenVoiceSettings = { ...READ, speed: 1.02 }

export function continuousSettings(id: string): ElevenVoiceSettings {
  return id === "conclusion" || id === "scripture" || id === "questions"
    ? CLOSE
    : READ
}

export type RunSegment = {
  id: string
  voice: string
  /** What is spoken (after speakify). */
  text: string
  /** v4 audio tag(s) said before this segment, never shown. */
  direction?: string
}

export type VoiceRun = { voice: string; segments: RunSegment[] }

const isReflection = (id: string) => /^reflection-\d+$/.test(id)

/** Consecutive reflection cards in one voice form one run; every other
 *  segment (hook, steps, close) is read whole on its own. */
export function planRuns(segments: readonly RunSegment[]): VoiceRun[] {
  const runs: VoiceRun[] = []
  for (const s of segments) {
    const last = runs[runs.length - 1]
    const prev = last?.segments[last.segments.length - 1]
    if (
      last &&
      prev &&
      isReflection(prev.id) &&
      isReflection(s.id) &&
      last.voice === s.voice
    )
      last.segments.push(s)
    else runs.push({ voice: s.voice, segments: [s] })
  }
  return runs
}

export function runText(run: VoiceRun): string {
  return run.segments
    .map((s) => (s.direction ? `${s.direction.trim()} ${s.text}` : s.text))
    .join(" ")
}

/** The cache take of every segment in a run: the whole run's text decides it,
 *  because changing one sentence changes how its neighbours are read. */
export function runTake(run: VoiceRun): string {
  const h = createHash("sha1")
    .update(`${VERSION}|${run.voice}|${runText(run)}`)
    .digest("hex")
    .slice(0, 8)
  return `v4c-${h}`
}

const wordCount = (t: string) => t.split(/\s+/).filter(Boolean).length

/** Level of the run's audio in fixed steps (dBFS RMS per step). */
export type AudioEnvelope = { stepSec: number; db: readonly number[] }

/** Below this a step counts as silence when snapping a cut. */
const SILENCE_DB = -50

/**
 * The middle of the longest silence in [fromSec, toSec), or undefined when
 * the stretch has none. Used to put a cut in the real pause between two
 * cards: the alignment pads word ends, so the midpoint between one word's
 * `endSec` and the next word's `startSec` can fall AFTER the next word's
 * real onset, and that onset then plays at the end of the earlier card,
 * alone, before the render's pause (Transfiguration EN, 2026-11-03: 13 of 28
 * cards ended in a 0.05-0.1 s fragment of the next word).
 */
export function quietestCut(
  envelope: AudioEnvelope,
  fromSec: number,
  toSec: number,
): number | undefined {
  const { stepSec, db } = envelope
  const a = Math.max(0, Math.ceil(fromSec / stepSec))
  const b = Math.min(db.length, Math.floor(toSec / stepSec))
  let best: [number, number] | undefined
  let runStart = -1
  for (let i = a; i <= b; i++) {
    const quiet = i < b && db[i]! <= SILENCE_DB
    if (quiet && runStart < 0) runStart = i
    if (!quiet && runStart >= 0) {
      if (!best || i - runStart > best[1] - best[0]) best = [runStart, i]
      runStart = -1
    }
  }
  return best ? ((best[0] + best[1]) / 2) * stepSec : undefined
}

/**
 * Where to cut each segment out of the run, from the run's word times.
 * Returns undefined when the alignment does not have exactly the run's words
 * (a cut by guesswork would put one card's words on another). With the run's
 * `envelope`, each cut between two cards moves into the real silence between
 * them (see `quietestCut`); without it, or when that stretch has no silence,
 * the cut stays in the middle of the aligned pause.
 */
export function sliceRun(
  run: VoiceRun,
  words: readonly SpokenWord[],
  envelope?: AudioEnvelope,
): { fromSec: number; toSec: number; words: SpokenWord[] }[] | undefined {
  const counts = run.segments.map((s) => wordCount(s.text))
  if (counts.reduce((a, b) => a + b, 0) !== words.length) return undefined
  const out: { fromSec: number; toSec: number; words: SpokenWord[] }[] = []
  let i = 0
  // Cuts fall in the MIDDLE of the voice's own pause between two cards, so
  // the two halves played back to back (no extra gap: the manifest gives
  // cards of one run a zero tail) rebuild the pause the model made.
  let prevCut: number | undefined
  counts.forEach((n, k) => {
    const own = words.slice(i, i + n)
    i += n
    const next = words[i]
    const start = own[0]!.startSec
    const last = own[own.length - 1]!
    const fromSec = prevCut ?? Math.max(0, start - 0.05)
    // The silence is searched from the last word's START: its padded end may
    // already run into the pause.
    const toSec =
      k === counts.length - 1
        ? last.endSec + 0.3
        : ((envelope && quietestCut(envelope, last.startSec, next!.startSec)) ??
          (last.endSec + next!.startSec) / 2)
    prevCut = toSec
    const len = toSec - fromSec
    out.push({
      fromSec,
      toSec,
      words: own.map((w) => ({
        word: w.word,
        startSec: Math.min(w.startSec - fromSec, len),
        endSec: Math.min(w.endSec - fromSec, len),
      })),
    })
  })
  return out
}
