import React from "react";
import Image from "next/image";
import Link from 'next/link';

import BiomeDataIcon from "../assets/biomedata-logo.png";
import { Button } from "@nextui-org/react";

export const NavbarGuest = () => {
  return (
    <div className="bg-white shadow-xl w-full px-12 py-6 flex flex-row justify-between items-center">
      <div className="flex justify-start">
        <Link href="/" className="flex flex-row items-center gap-4">
          <Image
            src={BiomeDataIcon}
            alt="BiomeData Icon"
            width={40}
            height={40}
          />
          <p className="text-3xl font-black bg-gradient-to-r from-biomedata-blue to-biomedata-purple inline-block text-transparent bg-clip-text">BiomeData</p>
        </Link>
      </div>
      <div className="flex flex-row justify-end gap-4">
        <Link href="/login"><Button variant="bordered" color="primary">Log In</Button></Link>
        <Link href="/register"><Button variant="solid" color="primary">Sign Up</Button></Link>
      </div>
    </div>
  )
}