import type { EndingId, Scene } from '../types'

const endingStub = (id: EndingId): Scene => ({
  id: `ending_${id}`,
  chapter: 5,
  mood: 'ending',
  ending: id,
  lines: [{ who: 'narrator', text: `[ending stub: ${id}]` }],
})

export const SCENES: Record<string, Scene> = {
  c1_start: {
    id: 'c1_start',
    chapter: 1,
    mood: 'calm',
    lines: [
      { who: 'narrator', text: 'Just another evening. Your screen glows. A notification slides in.' },
      { who: 'eli', text: "I've been trying to reach you for a while.", sfx: 'ping' },
    ],
    choices: [
      { id: 'ask_who', text: 'Who is this?', next: 'c1_end', fx: [{ t: 'suspicion', by: 1 }] },
      { id: 'ignore', text: '(Ignore it)', next: 'c1_end', fx: [{ t: 'counter', key: 'forget', by: 1 }] },
      { id: 'ask_how', text: 'How did you get my contact?', next: 'c1_end', fx: [{ t: 'suspicion', by: 2 }] },
    ],
  },
  c1_end: {
    id: 'c1_end',
    chapter: 1,
    lines: [{ who: 'narrator', text: '[stub: end of demo]' }],
    resolveEnding: true,
  },
  ending_last_message: endingStub('last_message'),
  ending_forgotten: endingStub('forgotten'),
  ending_replacement: endingStub('replacement'),
  ending_truth: endingStub('truth'),
  ending_other_side: endingStub('other_side'),
}