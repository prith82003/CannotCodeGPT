import React from 'react'
import Image from 'next/image'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

function Hero() {
  return (
    <section className="bg-white flex items-center flex-col">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Manage your Expenses
            <strong className="font-extrabold text-primary sm:block"> Control your Money </strong>
          </h1>

          <p className="mt-4 sm:text-xl/relaxed">
            Take control of your spending today, and watch your future self thank you tomorrow!
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-secondary focus:outline-none focus:ring active:bg-primry sm:w-auto"
              >
                Get Started
              </Link>
            </SignedIn>
            
            <SignedOut>
              <Link
                href="/sign-in"
                className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-secondary focus:outline-none focus:ring active:bg-primry sm:w-auto"
              >
                Get Started
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
      <Image 
        src={'/dashboard.png'} 
        alt='dashboard'
        width={1000}
        height={700}
        className='mt-9 rounded-xl border-2'
      />
    </section>
  )
}

export default Hero