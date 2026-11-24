import { useRef } from 'react'
import landingHtml from '../assets/landing.html?raw'

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
    if (!doc) return

    doc.querySelectorAll<HTMLElement>('[data-requires-save]').forEach((el) => {
      el.style.display = hasSave ? '' : 'none'
    })

    if (hasSave) {
      const begin = doc.querySelector<HTMLElement>('[data-action="begin"]')
      if (begin) begin.textContent = 'New Game'
    }

    doc.querySelectorAll<HTMLElement>('[data-action]').forEach((el) => {
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
      srcDoc={landingHtml}
      onLoad={wire}
      className="h-full w-full border-0"
    />
  )
}
alajajajaajjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj