'use client'

import { useEffect, useState } from 'react'

export interface ChatMessage {
  agent: 'buyer' | 'merchant'
  text: string
}

interface AgentChatProps {
  messages: ChatMessage[]
  position: 'left' | 'right'
  /** Total time per visible message before the next one appears, in ms. */
  stepMs?: number
  /** Pause at the end before the conversation restarts, in ms. */
  pauseMs?: number
  /** Optional title shown above the bubbles. */
  label?: string
}

/**
 * Looping animation of two agents exchanging messages.
 * Pure client component, fixed-position, hidden on narrow screens via CSS.
 * Decorative — pointer-events disabled.
 */
export function AgentChat({
  messages,
  position,
  stepMs = 1600,
  pauseMs = 2400,
  label = 'agent ↔ agent',
}: AgentChatProps) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      setVisibleCount((current) => {
        if (current >= messages.length) {
          // Pause at the end, then reset.
          timer = setTimeout(() => setVisibleCount(0), pauseMs)
          return current
        }
        timer = setTimeout(tick, stepMs)
        return current + 1
      })
    }

    timer = setTimeout(tick, stepMs)
    return () => clearTimeout(timer)
  }, [messages.length, stepMs, pauseMs])

  return (
    <aside className={`agent-chat agent-chat-${position}`} aria-hidden="true">
      <div className="agent-chat-label">{label}</div>
      <div className="agent-chat-stream">
        {messages.slice(0, visibleCount).map((msg, i) => (
          <div key={`${visibleCount}-${i}`} className={`bubble bubble-${msg.agent}`}>
            <span className="bubble-tag">{msg.agent === 'buyer' ? 'buyer' : 'merchant'}</span>
            <span className="bubble-text">{msg.text}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}
