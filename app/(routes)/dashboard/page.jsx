"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
import Chat from "./Chatbot/Chat";

function Dashboard() {
  const { user, isSignedIn } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [basiqConnected, setBasiqConnected] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      getBudgetList();
      checkBasiqConnection();
    }
  }, [user]);

  /**
   * Fetch Budget List
   */
  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`COALESCE(sum(CAST(${Expenses.amount} AS decimal)), 0)`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    setBudgetList(result);
    getAllExpenses();
  };

  const getAllExpenses = async () => {
    const result = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        createdAt: Expenses.createdAt,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  };

  /**
   * Check if the user is connected to Basiq
   */
  const checkBasiqConnection = async () => {
    const response = await fetch("/api/basiq/connect", { method: "POST" });
    const data = await response.json();

    if (data.success) {
      setBasiqConnected(true);
      fetchTransactions();
    }
  };

  /**
   * Fetch user transactions from Basiq
   */
  const fetchTransactions = async () => {
    setLoading(true);
    const response = await fetch("/api/basiq/transactions");
    const data = await response.json();

    if (data.success) {
      setTransactions(data.transactions);
    }

    setLoading(false);
  };

  /**
   * Handle bank connection with Basiq
   */
  const connectBasiq = async () => {
    setLoading(true);
    const response = await fetch("/api/basiq/connect", { method: "POST" });
    const data = await response.json();

    if (data.success) {
      alert("✅ Bank account connected successfully!");
      setBasiqConnected(true);
      fetchTransactions();
    } else {
      alert("❌ Error connecting to Basiq: " + data.error);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="p-8">
        <h2 className="font-bold text-3xl">Hi, {user?.firstName} 😊</h2>
        <p className="text-gray-500">
          Here's what's happening with your money, let's manage your expenses!
        </p>

        {/* Basiq Connection Section */}
        {!basiqConnected ? (
          <button
            onClick={connectBasiq}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md my-4"
          >
            {loading ? "Connecting..." : "Connect Bank Account"}
          </button>
        ) : (
          <p className="text-green-600">✅ Bank account connected!</p>
        )}

        {/* Transaction List */}
        {basiqConnected && (
          <div className="mt-6">
            <h2 className="font-bold text-lg">Recent Transactions</h2>
            {loading ? (
              <p>Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <ul className="bg-white shadow-md rounded-lg p-4">
                {transactions.map((txn, index) => (
                  <li key={index} className="border-b py-2 flex justify-between">
                    <span>{txn.description}</span>
                    <span
                      className={`font-bold ${
                        txn.amount < 0 ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      ${Math.abs(txn.amount).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
        )}

        <CardInfo budgetList={budgetList} />
        <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
          <div className="md:col-span-2">
            <BarChartDashboard budgetList={budgetList} />
            <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetList} />
          </div>
          <div className="grid gap-5">
            <h2 className="font-bold text-lg">Latest Budgets</h2>
            {budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))}
          </div>
        </div>
      </div>
      <Chat />
    </>
  );
}

export default Dashboard;
