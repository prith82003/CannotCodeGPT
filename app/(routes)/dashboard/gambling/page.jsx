"use client"
import { useState } from 'react'
import GamblingTab from "./_components/GamblingTab";
import './Gambling.css'

function Gambling() {
  const [count, setCount] = useState(0)

  return (
    <GamblingTab />

  )
}

export default Gambling