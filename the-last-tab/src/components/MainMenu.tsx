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

    const handlers: Record<string, () => void> = {
      begin: onBegin,
      continue: onContinue,
      endings: onEndings,
      settings: onSettings,
      credits: onCredits,
    }

    doc.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((el) => {
      const action = el.dataset.action ?? ''

      if (action === 'continue') {
        if (hasSave) {
          el.disabled = false
          el.removeAttribute('disabled')
        } else {
          el.disabled = true
          return
        }
      }

      if (action === 'begin' && hasSave) el.textContent = 'New Game'

      el.addEventListener(
        'click',
        (e) => {
          e.preventDefault()
          e.stopImmediatePropagation()
          handlers[action]?.()
        },
        true,
      )
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