import React from 'react';
import { cookies } from 'next/headers'
import { Navbar } from '../../components/Navbar';

import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedUser } from '@/components/UnauthenticatedUser';

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
          <div className="flex flex-col w-full justify-center items-center pl-20">
            <p>This is BiomeData&apos;s signal dataset page</p>
            <p>If you can see this, congratulations! You are a valid user that has logged in. Enjoy!</p>
          </div>
        </>
      ) : (
        <UnauthenticatedUser />
      )}
    </div>
  )
}