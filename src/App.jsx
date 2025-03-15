import { useState } from 'react'
import GamblingTab from "./components/GamblingTab";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <GamblingTab />

  )
}

export default App
