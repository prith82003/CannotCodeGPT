"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Budgets } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import { db } from '@/utils/dbConfig'

function CreateBudget({refreshData}) {
    const [emojiIcon, setEmojiIcon] = useState('🙂')
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [open, setOpen] = useState(false)
    const { user } = useUser()

    const resetForm = () => {
        setName('')
        setAmount('')
        setEmojiIcon('🙂')
        setOpen(false)
        setOpenEmojiPicker(false)
    }

    const onCreateBudget = async () => {
        const result = await db.insert(Budgets)
            .values({
                name: name,
                amount: amount,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                icon: emojiIcon
            }).returning({ insertedId: Budgets.id })

        if (result) {
            refreshData()
            toast('New Budget Created')
            resetForm()
        }
    }

    return (
        <div className='w-full h-full'>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className='w-full h-full'>
                    <div className='bg-slate-100 p-10 rounded-md
                    items-center flex flex-col border-2 border-dashed
                    cursor-pointer hover:shadow-md'>
                        <h2 className='text-3xl'>+</h2>
                        <h2>Create New Budget</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                        <DialogDescription>
                            Create a new budget to track your expenses
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
                                value={name}
                                placeholder="e.g Eating Out"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className='mt-2'>
                            <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                            <Input
                                value={amount}
                                type="number"
                                placeholder="e.g 1000"
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <Button
                            disabled={!(name && amount)}
                            onClick={() => onCreateBudget()}
                            className='mt-5 w-full'
                        >
                            Create Budget
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateBudget