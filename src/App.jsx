import { useState, useEffect } from 'react'

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']

function App() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [won, setWon] = useState(false)
  const [bestTime, setBestTime] = useState(localStorage.getItem('bestTime') || '-')

  useEffect(() => {
    initGame()
  }, [])

  useEffect(() => {
    let interval
    if (isPlaying && !won) {
      interval = setInterval(() => {
        setTimer(t => t + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, won])

  useEffect(() => {
    if (matched.length === emojis.length) {
      setWon(true)
      setIsPlaying(false)
      const currentBest = localStorage.getItem('bestTime')
      if (!currentBest || timer < parseInt(currentBest)) {
        localStorage.setItem('bestTime', timer)
        setBestTime(timer)
      }
    }
  }, [matched, timer])

  const initGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, isFlipped: false }))
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTimer(0)
    setIsPlaying(true)
    setWon(false)
  }

  const handleCardClick = (index) => {
    if (flipped.length === 2) return
    if (flipped.includes(index)) return
    if (matched.includes(cards[index].emoji)) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [first, second] = newFlipped
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setMatched(m => [...m, cards[first].emoji])
          setFlipped([])
        }, 500)
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="game-container">
      <h1>🎮 Emoji Memory</h1>
      
      <div className="stats">
        <div className="stat">⏱️ {formatTime(timer)}</div>
        <div className="stat">🎯 {moves} Züge</div>
        <div className="stat">🏆 {bestTime !== '-' ? formatTime(bestTime) : '-'}</div>
      </div>

      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${flipped.includes(index) || matched.includes(card.emoji) ? 'flipped' : ''} ${matched.includes(card.emoji) ? 'matched' : ''} ${index === 3 ? 'highlighted-card' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            {flipped.includes(index) || matched.includes(card.emoji) ? (
              card.emoji
            ) : (
              <span className="card-back">❓</span>
            )}
          </div>
        ))}
      </div>

      <button className="btn" onClick={initGame}>
        🔄 Neues Spiel
      </button>

      {won && (
        <>
          <div className="overlay" onClick={() => setWon(false)} />
          <div className="win-message">
            <h2>🎉 Gewonnen!</h2>
            <p>Du hast es in {moves} Zügen und {formatTime(timer)} geschafft!</p>
            <button className="btn" onClick={initGame}>
              🔄 Nochmal spielen
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
