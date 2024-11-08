import React from 'react';
import { cookies } from 'next/headers'
import { Navbar } from '../../components/Navbar';

import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedUser } from '@/components/UnauthenticatedUser';
import { GenomicList } from '@/components/GenomicList';

export default function Page() {
  // Cookie settings
  const cookieStore = cookies();
  const token = cookieStore.get("refreshToken")?.value || "";
  const validUser = cookieStore.has("refreshToken");
  let researcherId = "";
  if (token !== "") {
    const tokenDecoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET as string) as JwtPayload;
    researcherId = tokenDecoded.researcherId as string;
  }

  return (
    <div className='flex min-h-screen w-full'>
      {validUser ? (
        <>
          <Navbar researcherId={researcherId} />
          <div className="flex flex-col w-full ml-20 items-center">
            <GenomicList />
          </div>
        </>
      ) : (
        <UnauthenticatedUser />
      )}
    </div>
  )
}