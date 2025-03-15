import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './CSS/App.css'
import Chat from './Chat'

function App() {
  const [count, setCount] = useState(0)
  const chatAssistantRef = useRef(null)

  // after 5 seconds, call notifySpending with a message
  // setTimeout(() => {
  //   chatAssistantRef.current.sendProgrammaticMessage('PURCHASE:$10.00;REASON:Food')
  // }, 5000)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <Chat ref={chatAssistantRef} />
    </>
  )
}

export default App
