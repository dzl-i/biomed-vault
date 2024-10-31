"use client"
import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import BiomeDataIcon from "../assets/biomedata-logo.png";

import { Tooltip } from "@nextui-org/tooltip";

import {
  ShieldCheckIcon,
  HospitalIcon,
  UsersIcon,
  SyringeIcon,
  DnaIcon,
  BrainIcon,
  ActivityIcon,
  CircleUserIcon,
  LogOutIcon,
} from "lucide-react";
import { Logout } from "./Logout";
import { Privacy } from "./Privacy";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";

export const Navbar = ({ researcherId }: { researcherId: string }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoadingLogout, setIsLoadingLogout] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleLogoutClick = async () => {
    try {
      setIsLoadingLogout(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("API Error: ", response.statusText);
      }
    } catch (error) {
      console.error("Token refresh failed: ", error);
    } finally {
      setIsLoadingLogout(false);
    }
  };

  return (
    <nav className="fixed flex flex-col items-center justify-between w-20 h-screen gap-4 p-4" style={{ backgroundColor: "#f8f8fa" }}>
      <div className="flex items-center justify-center h-10 p-2">
        <Image
          src={BiomeDataIcon}
          alt="BiomeData Icon"
          width={33}
          height={33}
        />
      </div>
      <div className="flex flex-col h-full w-full" style={{ borderTop: "2px solid #e0e0e0" }}>
        <div className="flex flex-col items-center py-3">
          <Tooltip placement="right" content="Privacy and Safety" color="primary" closeDelay={0} showArrow={true}>
            <ShieldCheckIcon strokeWidth={1.5} className={`h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover`} onClick={onOpen} />
          </Tooltip>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <Privacy onClose={onClose} />
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>

      <div className="flex flex-col gap-3 h-screen justify-center ">
        <Link href={"/dashboard"}>
          <Tooltip placement="right" content="Dashboard" color="primary" closeDelay={0} showArrow={true}>
            <HospitalIcon strokeWidth={1.5} className={`h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover ${pathname.startsWith("/dashboard") ? "bg-biomedata-active" : ""}`} />
          </Tooltip>
        </Link>
        <Link href={"/patients"}>
          <Tooltip placement="right" content="Patients" color="primary" closeDelay={0} showArrow={true}>
            <UsersIcon strokeWidth={1.5} className={`h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover ${pathname.startsWith("/patients") ? "bg-biomedata-active" : ""}`} />
          </Tooltip>
        </Link>
        <Link href={"/phenotypes"}>
          <Tooltip placement="right" content="Phenotypes" color="primary" closeDelay={0} showArrow={true}>
            <SyringeIcon strokeWidth={1.5} className={`h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover ${pathname.startsWith("/phenotypes") ? "bg-biomedata-active" : ""}`} />
          </Tooltip>
        </Link>
        <Link href={"/genomics"}>
          <Tooltip placement="right" content="Genomics" color="primary" closeDelay={0} showArrow={true}>
            <DnaIcon strokeWidth={1.5} className={`h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover ${pathname.startsWith("/genomics") ? "bg-biomedata-active" : ""}`} />
          </Tooltip>
        </Link>
        <Link href={"/imaging"}>
          <Tooltip placement="right" content="Imaging" color="primary" closeDelay={0} showArrow={true}>
            <BrainIcon strokeWidth={1.5} className={`h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover ${pathname.startsWith("/imaging") ? "bg-biomedata-active" : ""}`} />
          </Tooltip>
        </Link>
        <Link href={"/signals"}>
          <Tooltip placement="right" content="Signals" color="primary" closeDelay={0} showArrow={true}>
            <ActivityIcon strokeWidth={1.5} className={`h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover ${pathname.startsWith("/signals") ? "bg-biomedata-active" : ""}`} />
          </Tooltip>
        </Link>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col py-4 items-center">
          <Link href={`/profile/${researcherId}`}>
            <Tooltip placement="right" content="Profile" color="primary" closeDelay={0} showArrow={true}>
              <CircleUserIcon strokeWidth={1.5} className={`h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover ${pathname.startsWith("/profile") ? "bg-biomedata-active" : ""}`} />
            </Tooltip>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Tooltip placement="right" content="Log Out" color="primary" closeDelay={0} showArrow={true}>
            <LogOutIcon strokeWidth={1.5} className="h-12 w-12 p-3 rounded-lg hover:bg-biomedata-hover" onClick={() => setShowLogoutConfirmation(true)} />
          </Tooltip>
        </div>
      </div>

      {showLogoutConfirmation && (
        <Logout
          onConfirm={handleLogoutClick}
          onCancel={() => setShowLogoutConfirmation(false)}
          isLoadingLogout={isLoadingLogout}
        />
      )}
    </nav >
  )
}