import React from 'react';
import { cookies } from 'next/headers'
import { Navbar } from '../../../components/Navbar';

import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthenticatedUser } from '@/components/UnauthenticatedUser';
import { ImagingOverview } from '@/components/ImagingOverview';

export default function Page({ params }: { params: { id: string } }) {
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
          <Navbar researcherId={params.id} />
          <div className="flex flex-col w-full ml-20 items-center">
            <ImagingOverview researcherId={researcherId} imagingId={params.id} />
          </div>
        </>
      ) : (
        <UnauthenticatedUser />
      )}
    </div>
  )
}