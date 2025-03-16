"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { SavingsGoals } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";

function Savings() {
  const [emojiIcon, setEmojiIcon] = useState("💸");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const { user } = useUser();
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");

  useEffect(() => {
    if (user) {
      fetchSavingsGoals();
    }
  }, [user]);

  const fetchSavingsGoals = async () => {
    try {
      const result = await db
        .select({
          id: SavingsGoals.id,
          name: SavingsGoals.name,
          amount: SavingsGoals.amount,
          savedAmount: SavingsGoals.savedAmount, // Include savedAmount
          icon: SavingsGoals.icon,
          createdBy: SavingsGoals.createdBy,
        })
        .from(SavingsGoals)
        .where(eq(SavingsGoals.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(SavingsGoals.id));

      console.log("Fetched Savings Goals:", result);
      setSavingsGoals(result);
    } catch (error) {
      console.error("Error fetching savings goals:", error);
    }
  };

  const addSavingsGoal = async (e) => {
    e.preventDefault();
    if (!goalName || !goalAmount) {
      console.log("Missing input: Goal Name or Amount is empty");
      return;
    }

    console.log("Adding Savings Goal:", goalName, goalAmount);
    await db.insert(SavingsGoals).values({
      name: goalName,
      amount: parseFloat(goalAmount),
      savedAmount: 0, // Initialize savings at 0
      icon: emojiIcon,
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });

    console.log("Goal successfully added!");
    setGoalName("");
    setGoalAmount("");
    setEmojiIcon("💸");
    fetchSavingsGoals();
  };

  const addSavings = async (goalId) => {
    const amountToAdd = prompt("Enter the amount to add to savings:");

    if (!amountToAdd || isNaN(amountToAdd)) {
      alert("Please enter a valid number.");
      return;
    }

    try {
      const goal = savingsGoals.find((g) => g.id === goalId);
      const newSavedAmount = (parseFloat(goal.savedAmount) || 0) + parseFloat(amountToAdd);

      await db
        .update(SavingsGoals)
        .set({ savedAmount: newSavedAmount })
        .where(eq(SavingsGoals.id, goalId));

      fetchSavingsGoals(); // Refresh the UI
    } catch (error) {
      console.error("Error updating savings:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="font-bold text-3xl">Savings Goals</h2>
      <p className="text-gray-500">Save up for a treat! Or something bigger 👀.</p>

      <form onSubmit={addSavingsGoal} className="mt-4 flex gap-4">
        <Input
          type="text"
          placeholder="Goal Name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Goal Amount"
          value={goalAmount}
          onChange={(e) => setGoalAmount(e.target.value)}
        />

        <div className="relative">
          <button
            type="button"
            className="p-2 border rounded-lg text-1xl"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
          >
            {emojiIcon}
          </button>
          {openEmojiPicker && (
            <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-lg z-10">
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setEmojiIcon(emoji.emoji);
                  setOpenEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>

        <Button type="submit">Add Goal</Button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold text-xl">Your Savings Goals</h3>
        <ul className="mt-2 space-y-2">
          {savingsGoals.map((goal) => {
            const progressPercentage = (goal.savedAmount / goal.amount) * 100;

            return (
              <li key={goal.id} className="p-4 border rounded-lg flex flex-col items-center gap-2">
  {/* Top Row: Icon and Name/Amount */}
  <div className="flex items-center w-full">
    {/* Emoji on the left */}
    <span className="text-5xl mr-4">{goal.icon}</span>

    {/* Name & Amount in a column */}
    <div className="flex flex-col flex-grow">
      <p className="font-semibold">{goal.name}</p>
      <p className="text-gray-600">Amount: ${goal.amount}</p>
      <p className="text-green-600">Saved: 
      <span className="font-semibold">${goal.savedAmount}</span>
      </p>
    </div>
  </div>

  {/* Progress Bar in the Center */}
  <div className="w-2/3 flex items-center gap-2">
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-primary h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
      ></div>
    </div>
    <span className="text-sm font-semibold text-gray-700">
      {Math.min(progressPercentage, 100)}%
    </span>
  </div>
  {/* Add Savings Button */}
    <Button
      className="bg-primary text-white px-3 py-1 rounded-lg"
      onClick={() => addSavings(goal.id)}>
      Add Savings
    </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Savings;
