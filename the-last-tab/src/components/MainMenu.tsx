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

  const handlers: Record<string, () => void> = {
    begin: onBegin,
    continue: onContinue,
    endings: onEndings,
    settings: onSettings,
    credits: onCredits,
  }

  const wire = () => {
    const doc = frameRef.current?.contentDocument
    if (!doc) {
      console.error('landing.html: cannot access iframe document')
      return
    }

    doc.querySelectorAll<HTMLElement>('[data-requires-save]').forEach((el) => {
      el.style.display = hasSave ? '' : 'none'
    })

    if (hasSave) {
      const begin = doc.querySelector<HTMLElement>('[data-action="begin"]')
      if (begin) begin.textContent = 'New Game'
    }

    const buttons = doc.querySelectorAll<HTMLElement>('[data-action]')
    if (buttons.length === 0) {
      console.warn('landing.html: no [data-action] buttons found')
    }

    buttons.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        handlers[el.dataset.action ?? '']?.()
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