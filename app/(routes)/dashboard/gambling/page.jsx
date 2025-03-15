"use client";
import { useState } from "react";
import GamblingTab from "./_components/GamblingTab";
import "./gambling.css";

function Gambling() {
  const [count, setCount] = useState(0);

  return <GamblingTab />;
}

export default Gambling;
