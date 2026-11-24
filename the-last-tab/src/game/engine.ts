import type { Choice, Condition, Effect, EndingId, GameState, Scene } from './types'
import { ENDING_RULES } from './endings'
import { initialState, START_SCENE_ID } from './initialState'
import { SCENES } from './story.js'

const inRange = (v: number, gte?: number, lte?: number) =>
  (gte === undefined || v >= gte) && (lte === undefined || v <= lte)

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export function check(c: Condition | undefined, s: GameState): boolean {
  if (!c) return true
  switch (c.t) {
    case 'flag':
      return !!s.flags[c.id]
    case 'notFlag':
      return !s.flags[c.id]
    case 'clue':
      return s.clues.includes(c.id)
    case 'notClue':
      return !s.clues.includes(c.id)
    case 'trust':
      return inRange(s.trust[c.who], c.gte, c.lte)
    case 'rel':
      return inRange(s.rel[c.who], c.gte, c.lte)
    case 'suspicion':
      return inRange(s.suspicion, c.gte, c.lte)
    case 'counter':
      return inRange(s.counters[c.key] ?? 0, c.gte, c.lte)
    case 'decision':
      return s.decisions[c.id] === c.is
    case 'visited':
      return s.visited.includes(c.id)
    case 'all':
      return c.of.every((x) => check(x, s))
    case 'any':
      return c.of.some((x) => check(x, s))
    case 'not':
      return !check(c.of, s)
  }
}

export function applyEffects(s: GameState, fx: Effect[] = []): GameState {
  return fx.reduce<GameState>((st, e) => {
    switch (e.t) {
      case 'setFlag':
        return { ...st, flags: { ...st.flags, [e.id]: true } }
      case 'clearFlag': {
        const flags = { ...st.flags }
        delete flags[e.id]
        return { ...st, flags }
      }
      case 'clue':
        return st.clues.includes(e.id) ? st : { ...st, clues: [...st.clues, e.id] }
      case 'trust':
        return { ...st, trust: { ...st.trust, [e.who]: clamp(st.trust[e.who] + e.by, -5, 10) } }
      case 'rel':
        return { ...st, rel: { ...st.rel, [e.who]: clamp(st.rel[e.who] + e.by, -5, 10) } }
      case 'suspicion':
        return { ...st, suspicion: clamp(st.suspicion + e.by, 0, 10) }
      case 'counter':
        return { ...st, counters: { ...st.counters, [e.key]: (st.counters[e.key] ?? 0) + e.by } }
    }
  }, s)
}

export function getScene(id: string): Scene {
  const sc = SCENES[id]
  if (!sc) throw new Error(`Missing scene: ${id}`)
  return sc
}

export function enterScene(s: GameState, id: string): GameState {
  const sc = getScene(id)
  let st: GameState = {
    ...s,
    sceneId: id,
    chapter: sc.chapter,
    visited: s.visited.includes(id) ? s.visited : [...s.visited, id],
  }
  st = applyEffects(st, sc.onEnter)
  const idx: number[] = []
  sc.lines.forEach((line, i) => {
    if (check(line.if, st)) {
      idx.push(i)
      st = applyEffects(st, line.fx)
    }
  })
  return { ...st, lineIdx: idx }
}

export function shownLines(s: GameState) {
  const sc = getScene(s.sceneId)
  return s.lineIdx.map((i) => sc.lines[i])
}

export interface ChoiceView {
  choice: Choice
  locked: boolean
}

export function availableChoices(s: GameState): ChoiceView[] {
  const sc = getScene(s.sceneId)
  return (sc.choices ?? []).flatMap((choice): ChoiceView[] => {
    if (choice.once && s.taken.includes(`${sc.id}:${choice.id}`)) return []
    if (check(choice.if, s)) return [{ choice, locked: false }]
    return choice.lockedHint ? [{ choice, locked: true }] : []
  })
}

export function resolveEnding(s: GameState): EndingId {
  return ENDING_RULES.find((r) => check(r.if, s))?.id ?? 'last_message'
}

export function nextSceneId(s: GameState): string | null {
  const sc = getScene(s.sceneId)
  if (sc.resolveEnding) return `ending_${resolveEnding(s)}`
  return sc.route?.find((r) => check(r.if, s))?.to ?? null
}

export function choose(s: GameState, choiceId: string): GameState {
  const sc = getScene(s.sceneId)
  const view = availableChoices(s).find((v) => v.choice.id === choiceId && !v.locked)
  if (!view) return s
  const ch = view.choice
  let st: GameState = {
    ...s,
    decisions: { ...s.decisions, [sc.id]: ch.id },
    taken: [...s.taken, `${sc.id}:${ch.id}`],
  }
  st = applyEffects(st, ch.fx)
  return enterScene(st, ch.next)
}

export function advance(s: GameState): GameState {
  const next = nextSceneId(s)
  return next ? enterScene(s, next) : s
}

export function newGame(): GameState {
  return enterScene(initialState(), START_SCENE_ID)
}

export function currentEnding(s: GameState): EndingId | null {
  return getScene(s.sceneId).ending ?? null
} 
