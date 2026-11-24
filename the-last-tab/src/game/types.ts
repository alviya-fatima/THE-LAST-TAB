export type CharId = 'eli' | 'maya' | 'dev' | 'halloran'
export type Speaker = CharId | 'you' | 'narrator' | 'system'
export type EndingId = 'last_message' | 'forgotten' | 'replacement' | 'truth' | 'other_side'
export type Mood = 'calm' | 'uneasy' | 'tense' | 'dread' | 'ending'
export type SfxId = 'ping' | 'type' | 'glitch' | 'hum' | 'thud' | 'static'

export type Condition =
  | { t: 'flag'; id: string }
  | { t: 'notFlag'; id: string }
  | { t: 'clue'; id: string }
  | { t: 'notClue'; id: string }
  | { t: 'trust'; who: CharId; gte?: number; lte?: number }
  | { t: 'rel'; who: CharId; gte?: number; lte?: number }
  | { t: 'suspicion'; gte?: number; lte?: number }
  | { t: 'counter'; key: string; gte?: number; lte?: number }
  | { t: 'decision'; id: string; is: string }
  | { t: 'visited'; id: string }
  | { t: 'all'; of: Condition[] }
  | { t: 'any'; of: Condition[] }
  | { t: 'not'; of: Condition }

export type Effect =
  | { t: 'setFlag'; id: string }
  | { t: 'clearFlag'; id: string }
  | { t: 'clue'; id: string }
  | { t: 'trust'; who: CharId; by: number }
  | { t: 'rel'; who: CharId; by: number }
  | { t: 'suspicion'; by: number }
  | { t: 'counter'; key: string; by: number }

export interface Line {
  who: Speaker
  text: string
  if?: Condition
  fx?: Effect[]
  sfx?: SfxId
  glitch?: boolean
}

export interface Choice {
  id: string
  text: string
  next: string
  if?: Condition
  lockedHint?: string // if set, choice shows greyed out with this hint when `if` fails
  fx?: Effect[]
  once?: boolean // hidden after being picked (for investigation hubs)
}

export interface Route {
  if?: Condition
  to: string
}

export interface Scene {
  id: string
  chapter: 1 | 2 | 3 | 4 | 5
  title?: string
  mood?: Mood
  lines: Line[]
  choices?: Choice[]
  route?: Route[] // auto-advance when there are no choices; first match wins
  onEnter?: Effect[]
  resolveEnding?: boolean // go to ending_<resolved id>
  ending?: EndingId // marks this scene as an ending scene
}

export type CharNumbers = Record<CharId, number>

export interface GameState {
  chapter: number
  sceneId: string
  lineIdx: number[] // which lines of the scene were shown (deterministic on load)
  trust: CharNumbers
  rel: CharNumbers
  suspicion: number
  clues: string[]
  flags: Record<string, boolean>
  counters: Record<string, number>
  decisions: Record<string, string> // sceneId -> choiceId
  taken: string[] // "sceneId:choiceId"
  visited: string[]
}