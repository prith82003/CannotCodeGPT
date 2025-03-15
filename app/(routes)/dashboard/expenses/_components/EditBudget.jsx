"use client"
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog" 
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function EditBudget({budgetInfo, refreshData}) {
    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon)
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [name, setName] = useState(budgetInfo?.name)
    const [amount, setAmount] = useState(budgetInfo?.amount)
    const [open, setOpen] = useState(false)
    const { user } = useUser()

    useEffect(()=>{
        if(budgetInfo)
        {
            setEmojiIcon(budgetInfo?.icon)
            setName(budgetInfo?.name)
            setAmount(budgetInfo?.amount)
        }
    }, [budgetInfo])

    const onUpdateBudget=async()=>{
        const result=await db.update(Budgets).set({
            name:name,
            amount:amount,
            icon:emojiIcon
        }).where(eq(Budgets.id, budgetInfo.id))
        .returning();

        if(result)
        {
            refreshData()
            toast('Budget Updated')
            resetForm()
        }
    }

    const resetForm = () => {
        setName('')
        setAmount('')
        setEmojiIcon('🙂')
        setOpen(false)
        setOpenEmojiPicker(false)
    }

  return (
    <div>
        <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                    <Button className="flex gap-2">
                        <PenBox/>Edit
                    </Button>
                </DialogTrigger>
                <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update Budget</DialogTitle>
                                <DialogDescription>
                                    Update your current budget to track your expenses
                                </DialogDescription>
                            </DialogHeader>
                            <div className='mt-5'>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="text-lg"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                                >
                                    {emojiIcon}
                                </Button>
        
                                {openEmojiPicker && (
                                    <div className='relative'>
                                        <div className='absolute z-50'>
                                            <EmojiPicker
                                                onEmojiClick={(e) => {
                                                    setEmojiIcon(e.emoji)
                                                    setOpenEmojiPicker(false)
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
        
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                    <Input
                                        placeholder="e.g Eating Out"
                                        defaultValue={budgetInfo?.name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
        
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input
                                        defaultValue={budgetInfo?.amount}
                                        type="number"
                                        placeholder="e.g $1000"
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
        
                                <Button
                                    disabled={!(name && amount)}
                                    onClick={() => onUpdateBudget()}
                                    className='mt-5 w-full'
                                >
                                    Update Budget
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
    </div>
  )
}

export default EditBudget