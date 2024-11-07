import React from 'react';
import { cookies } from 'next/headers'
import { Navbar } from '../../../components/Navbar';

import { UnauthenticatedUser } from '@/components/UnauthenticatedUser';
import { PatientOverview } from '@/components/PatientOverview';

export default function Page({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const validUser = cookieStore.has("accessToken") || cookieStore.has("refreshToken");

  return (
    <div className='flex min-h-screen w-full'>
      {validUser ? (
        <>
          <Navbar researcherId={params.id} />
          <div className="flex flex-col w-full ml-20 items-center">
            <PatientOverview patientId={params.id} />
          </div>
        </>
      ) : (
        <UnauthenticatedUser />
      )}
    </div>
  )
}