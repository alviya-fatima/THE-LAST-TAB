import type { GameState } from './types'

export const START_SCENE_ID = 'c1_start'

export const initialState = (): GameState => ({
  chapter: 1,
  sceneId: START_SCENE_ID,
  lineIdx: [],
  trust: { eli: 0, maya: 0, dev: 0, halloran: 0 },
  rel: { eli: 0, maya: 0, dev: 0, halloran: 0 },
  suspicion: 0,
  clues: [],
  flags: {},
  counters: {},
  decisions: {},
  taken: [],
  visited: [],
})