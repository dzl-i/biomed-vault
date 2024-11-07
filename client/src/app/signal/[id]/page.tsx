import React from 'react';
import { cookies } from 'next/headers'
import { Navbar } from '../../../components/Navbar';

import { UnauthenticatedUser } from '@/components/UnauthenticatedUser';

export default function Page({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const validUser = cookieStore.has("accessToken") || cookieStore.has("refreshToken");

  return (
    <div className='flex min-h-screen w-full'>
      {validUser ? (
        <>
          <Navbar researcherId={params.id} />
          <div className="flex flex-col w-full justify-center items-center pl-20">
            <p>This is BiomeData&apos;s signal overview page</p>
            <p>Signal ID is {params.id}</p>
            <p>If you can see this, congratulations! You are a valid user that has logged in. Enjoy!</p>
          </div>
        </>
      ) : (
        <UnauthenticatedUser />
      )}
    </div>
  )
}