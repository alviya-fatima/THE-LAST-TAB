import { useRef } from 'react'

type Props = {
  hasSave: boolean
  onBegin: () => void
  onContinue: () => void
  onEndings: () => void
  onSettings: () => void
  onCredits: () => void
}

export default function MainMenu({
  hasSave,
  onBegin,
  onContinue,
  onEndings,
  onSettings,
  onCredits,
}: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null)

  const wire = () => {
    const doc = frameRef.current?.contentDocument
    if (!doc) return

    const detect = (el: HTMLElement): string | null => {
      const explicit = el.dataset.action
      if (explicit) return explicit
      const t = (el.textContent || '').toLowerCase()
      if (t.includes('continue')) return 'continue'
      if (t.includes('begin') || t.includes('new game') || t.includes('start') || t.includes('play')) return 'begin'
      if (t.includes('ending')) return 'endings'
      if (t.includes('setting') || t.includes('option')) return 'settings'
      if (t.includes('credit')) return 'credits'
      return null
    }

    const handlers: Record<string, () => void> = {
      begin: onBegin,
      continue: onContinue,
      endings: onEndings,
      settings: onSettings,
      credits: onCredits,
    }

    const els = doc.querySelectorAll<HTMLElement>('button, a, [role="button"], .btn, .menu-item')
    els.forEach((el) => {
      const action = detect(el)
      if (!action) return
      if (action === 'continue' && !hasSave) {
        el.style.display = 'none'
        return
      }
      if (action === 'begin' && hasSave) el.textContent = 'New Game'
      el.addEventListener('click', (e) => {
        e.preventDefault()
        handlers[action]?.()
      })
    })
  }

  return (
    <iframe
      ref={frameRef}
      title="The Last Tab"
      src="/landing.html"
      onLoad={wire}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        border: 0,
        display: 'block',
        background: '#07070a',
      }}
    />
  )
}