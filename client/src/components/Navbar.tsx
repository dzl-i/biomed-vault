import React from "react";
import Image from "next/image";
import BiomeDataIcon from "../assets/biomedata-logo.png";

import {
  BookOpenIcon,
  ShieldCheckIcon,
  BarsArrowUpIcon,
  UserCircleIcon,
  MoonIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

export const Navbar = () => {
  return (
    <nav className="fixed flex flex-col items-center w-20 h-screen gap-4 p-4" style={{ backgroundColor: "#f5f5f5" }}>
      <div className="flex items-center justify-center h-10 p-2">
        <Image
          src={BiomeDataIcon}
          alt="BiomeData Icon"
          width={33}
          height={33}
        />
      </div>
      <div className="flex flex-col h-full w-full" style={{ borderTop: "2px solid #e0e0e0" }}>
        <div className="flex flex-col gap-3 items-center py-3">
          <BookOpenIcon className="h-12 w-12 p-3 text-black-600" />
          <ShieldCheckIcon className="h-12 w-12 p-3 text-black-600" />
        </div>
      </div>

      <div className="flex flex-col py-6 items-center">
        <div className="flex flex-col gap-3 py-4 items-center">
          <BarsArrowUpIcon className="h-12 w-12 p-3 text-black-600 rotate-90" />
          <UserCircleIcon className="h-12 w-12 p-3 text-black-600" />
          <MoonIcon className="h-12 w-12 p-3 text-black-600" />
        </div>
        <div className="flex flex-col items-center gap-6">
          <ArrowRightEndOnRectangleIcon className="h-12 w-12 p-3 text-black-600" />
        </div>
      </div>
    </nav >
  )
}