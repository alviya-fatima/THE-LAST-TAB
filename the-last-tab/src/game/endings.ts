import type { Condition, EndingId } from './types'

export interface EndingMeta {
  id: EndingId
  title: string
  kind: 'good' | 'bad'
  hidden?: boolean
  blurb: string
}

export const ENDINGS: Record<EndingId, EndingMeta> = {
  last_message: {
    id: 'last_message',
    title: 'The Last Message',
    kind: 'bad',
    blurb: 'You understood too late. The chat is still open.',
  },
  forgotten: {
    id: 'forgotten',
    title: 'Forgotten',
    kind: 'bad',
    blurb: 'What you erased, erased you back.',
  },
  replacement: {
    id: 'replacement',
    title: 'The Replacement',
    kind: 'bad',
    blurb: 'Every answer was already written.',
  },
  truth: {
    id: 'truth',
    title: 'The Truth',
    kind: 'good',
    blurb: 'You found what happened, and you got out.',
  },
  other_side: {
    id: 'other_side',
    title: 'The Other Side',
    kind: 'good',
    hidden: true,
    blurb: 'Some messages are worth staying online for.',
  },
}

export const ENDING_ORDER: EndingId[] = [
  'other_side',
  'truth',
  'replacement',
  'forgotten',
  'last_message',
]

const has = (...ids: string[]): Condition => ({
  t: 'all',
  of: ids.map((id) => ({ t: 'clue', id }) as Condition),
})

// Checked top to bottom, first match wins. Last one is the fallback.
export const ENDING_RULES: { id: EndingId; if: Condition }[] = [
  {
    id: 'other_side',
    if: {
      t: 'all',
      of: [
        has('eli_drafts', 'last_draft', 'timestamp', 'quarry_photo'),
        { t: 'flag', id: 'stayed_online' },
        { t: 'notFlag', id: 'deleted_logs' },
        { t: 'trust', who: 'eli', gte: 3 },
        { t: 'counter', key: 'obey', lte: 1 },
      ],
    },
  },
  {
    id: 'truth',
    if: {
      t: 'all',
      of: [
        has('chat_log', 'timestamp', 'quarry_photo'),
        { t: 'suspicion', gte: 4 },
        { t: 'counter', key: 'obey', lte: 2 },
        { t: 'notFlag', id: 'deleted_logs' },
      ],
    },
  },
  { id: 'replacement', if: { t: 'counter', key: 'obey', gte: 3 } },
  {
    id: 'forgotten',
    if: {
      t: 'any',
      of: [
        { t: 'flag', id: 'deleted_logs' },
        { t: 'counter', key: 'forget', gte: 2 },
      ],
    },
  },
  { id: 'last_message', if: { t: 'all', of: [] } },
]