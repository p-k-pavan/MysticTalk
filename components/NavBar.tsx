"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from "@/components/ui/button";

const NavBar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User

  return (
    <nav className='p-3 shadow-md bg-slate-200'>
      <div className='container mx-auto flex flex-col
      md:flex-row justify-between items-center'>
     <div>
     <Link href="/"
        className="text-xl font-bold mb-4 md:mb-0">MysticTalk</Link>
     </div>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user?.username || user?.email}</span>
            <Button onClick={() => signOut()}
              className="w-full md:w-auto">Logout</Button>
          </>
        ) : (
          <div className="md:flex  gap-5">
            <span className="text-center my-auto">Login to MysticTalk to enjoy</span>
            <Link href="/sign-in">
              <Button className="ml-5">Login</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
