'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { User } from 'next-auth'
import { LogIn, LogOut } from 'lucide-react'
import Image from 'next/image'

function Navbar() {
  const { data: session } = useSession()
  const user = session?.user as User

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-300 transition">
          💬 Mystery Message
        </Link>

        {/* Centered Welcome Text */}
        {session && (
          <div className="hidden md:block flex-1 text-center text-white font-semibold text-lg truncate select-none md:mr-28 px-6">
            Welcome, <span className="text-indigo-400">{user?.username || user?.email}</span>
          </div>
        )}

        {/* Right side: avatar, dashboard, login/logout */}
        <div className="flex items-center gap-4">

          {session ? (
            <>
              {/* Avatar */}
              {user?.image && (
                <Image
                  src={user.image}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-indigo-500"
                />
              )}

              {/* Logout Button */}
              <Button
                onClick={() => signOut()}
                variant="outline"
                className="flex items-center gap-1 border-indigo-400 text-gray-900 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in" passHref>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-indigo-400 text-gray-900 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 font-medium"
              >
                <LogIn className="w-5 h-5" />
                Login
              </Button>
            </Link>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar
