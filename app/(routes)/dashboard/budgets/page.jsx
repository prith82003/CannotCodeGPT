"use client"
import React from 'react'
import BudgetList from './_components/BudgetList'
import Chat from '../Chatbot/Chat'

function budgets() {
  return (
    <>
      <div className='p-10'>
        <h2 className='font-bold text-3xl'>My Budgets</h2>
        <BudgetList />
      </div>
      <Chat />
    </>
  )
}

export default budgets