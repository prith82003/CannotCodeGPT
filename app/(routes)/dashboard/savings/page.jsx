"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { SavingsGoals } from "@/utils/schema";
import { eq, desc, getTableColumns } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Savings() {
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
      createdBy: user?.primaryEmailAddress?.emailAddress,
    });
    console.log("Goal successfully added!");
    setGoalName("");
    setGoalAmount("");
    fetchSavingsGoals();
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
        <Button type="submit">Add Goal</Button>
      </form>

      <div className="mt-6">
        <h3 className="font-bold text-xl">Your Savings Goals</h3>
        <ul className="mt-2 space-y-2">
          {savingsGoals.map((goal) => (
            <li key={goal.id} className="p-4 border rounded-lg">
              <p className="font-semibold">{goal.name}</p>
              <p className="text-gray-600">Amount: ${goal.amount}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Savings;
