"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs'
import Link from 'next/link'

function Header() {
  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
        <Image src={'./logo.svg'}
        alt='logo'
        width={80}
        height={80}
        />
        <ClerkProvider>
        <SignedOut>
          <div className="border-2 border-primary bg-primary p-2 rounded-lg w-fit">
            <SignInButton className="text-white font-outfit w-full py-0.5 px-3 rounded-md hover:bg-secondary transition-all">
              Sign In
            </SignInButton>
          </div>
        </SignedOut>

        {/* User button (shown when signed in) */}
        <SignedIn>
          <UserButton />
        </SignedIn>
    </ClerkProvider>
    </div>
  )
}

export default Header