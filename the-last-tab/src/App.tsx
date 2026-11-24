import { useState } from 'react'
import MainMenu from './components/MainMenu'

type Screen = 'menu' | 'game' | 'endings' | 'settings' | 'credits'

const SAVE_KEY = 'lasttab:save'

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu')
  const hasSave = !!localStorage.getItem(SAVE_KEY)

  const back = () => setScreen('menu')

  return (
    <>
      {screen === 'menu' && (
        <MainMenu
          hasSave={hasSave}
          onBegin={() => {
            localStorage.removeItem(SAVE_KEY)
            setScreen('game')
          }}
          onContinue={() => setScreen('game')}
          onEndings={() => setScreen('endings')}
          onSettings={() => setScreen('settings')}
          onCredits={() => setScreen('credits')}
        />
      )}

      {screen !== 'menu' && (
        <div className="h-full grid place-items-center">
          <div className="text-center">
            <p className="font-mono text-muted uppercase tracking-widest">
              {screen} (coming soon)
            </p>
            <button
              onClick={back}
              className="mt-6 border border-line px-5 py-2 font-mono text-sm uppercase hover:border-blood"
            >
              Back
            </button>
          </div>
        </div>
      )}

      <div className="fx-overlay" />
    </>
  )
}