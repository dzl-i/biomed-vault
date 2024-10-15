"use client"
import Image from "next/image";
import Link from 'next/link';

import { NavbarGuest } from "@/components/NavbarGuest";

import { TypeAnimation } from "react-type-animation";
import { Button } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavbarGuest />
      <main className="flex flex-grow w-full">
        <div className="w-full grid grid-cols-2">
          <div className="flex flex-col items-center justify-center ml-32 gap-4">
            <h1 className="text-5xl font-black text-center">Welcome to BiomeData</h1>
            <TypeAnimation
              sequence={["Empowering Biomedical Research Through Unified Data Management"]}
              wrapper="span"
              speed={50}
              repeat={0}
              className="text-3xl inline-block italic text-center min-h-20"
            />

            <Link href="/register" className="mt-4"><Button color="primary" size="lg">Register Now</Button></Link>
          </div>
          <div className="flex items-center justify-center">
            <Image src={"/assets/bioinformatics-cartoon.jpg"} alt="Bioinformatics Cartoon" width={600} height={600} />
          </div>
        </div>
      </main>
    </div>
  );
}
