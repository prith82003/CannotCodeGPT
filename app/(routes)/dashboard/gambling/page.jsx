"use client";
import { useState } from "react";
import GamblingTab from "./_components/GamblingTab";
import './gambling.css'
import Chat from '../Chatbot/Chat';

function Gambling() {
  const [count, setCount] = useState(0);

  return (
    <>
    <GamblingTab />
    <Chat />
    </>
  )
}

export default Gambling;
