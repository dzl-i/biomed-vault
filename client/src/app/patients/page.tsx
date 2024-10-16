import React from 'react';
import { cookies } from 'next/headers'
import { Navbar } from '../../components/Navbar';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import jwt, { JwtPayload } from "jsonwebtoken";

export default function Page() {
  const cookieStore = cookies();
  const validUser = cookieStore.has("accessToken") || cookieStore.has("refreshToken");
  const token = cookieStore.get("refreshToken")?.value || "no token";
  const tokenDecoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET as string) as JwtPayload;
  const researcherId = tokenDecoded.researcherId as string;

  return (
    <div className='flex min-h-screen w-full'>
      {validUser ? (
        <>
          <Navbar researcherId={researcherId} />
          <div className="flex flex-col w-full justify-center items-center pl-20">
            <p>This is BiomeData&apos;s patient dataset page</p>
            <p>If you can see this, congratulations! You are a valid user that has logged in. Enjoy!</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center w-full gap-4">
          <p>If you see this, you are not logged in yet. Please create an account or log in to view the patient dataset page :)</p>
          <div className="flex flex-row gap-4">
            <Link href="/register"><Button color="primary">Sign Up</Button></Link>
            <Link href="/login"><Button color="primary">Log In</Button></Link>
          </div>
        </div>
      )}
    </div>
  )
}