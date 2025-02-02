"use client"
import React, { useState, useMemo, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { getHash } from "../../utils/crypto";
import BiomeDataIcon from "../../assets/biomedata-logo.png";

import "dotenv/config";
import { passwordStrength } from "check-password-strength";

import { Button, Card, CardBody, Divider, Input, Link, Spinner } from "@nextui-org/react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { NavbarGuest } from "@/components/NavbarGuest";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

  const isInvalidEmail = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const validatePassword = (password: string) => password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()-_=+\[\]\{\},.]/.test(password);

  const isInvalidPassword = useMemo(() => {
    if (password === "") return false;

    return validatePassword(password) ? false : true;
  }, [password]);

  const readyToSubmit = useMemo(
    () => validateEmail(email) && validatePassword(password),
    [email, password]
  );

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogIn = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (passwordStrength(password).value !== "Strong") {
        setErrorMessage("Password must have a lowercase and uppercase letter, a symbol, and a number.");
      } else {
        // Get the hash of the password before sending it to the backend
        const hashedPassword = getHash(password);

        // Construct an object with the input values
        const userData = {
          email,
          password: hashedPassword
        };

        // Send the userData to using fetch
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          // Redirect to the "/dashboard" route upon successful register
          router.push("/dashboard");

          const responseData = await response.json();
          sessionStorage.setItem("username", responseData.researcherUsername);
          sessionStorage.setItem("name", responseData.researcherName);
        } else {
          // Handle error response from the API
          const errorData = await response.json();
          setErrorMessage(errorData.error);  // Set the error message received from backend
        }
      }
    } catch (error) {
      // Handle any other errors
      setErrorMessage("An unexpected error occurred. Please try again later.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-blue-200">
      <NavbarGuest />
      <div className="flex flex-grow w-full items-center justify-center">
        <Card style={{ border: "0.1rem solid rgba(255, 255, 255, 0.4)" }} className="flex items-center flex-col w-[500px] p-8">
          <form className="w-full">
            <CardBody className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-5 items-center">
              <div className="flex flex-row gap-3">
                <Image
                  src={BiomeDataIcon}
                  alt="BiomeData Icon"
                  width={33}
                  height={33}
                />
                <h2 className="text-3xl font-black bg-gradient-to-r from-biomedata-blue to-biomedata-purple inline-block text-transparent bg-clip-text">BiomeData</h2>
              </div>
              <Input isRequired size="md" type="email" label="Email" placeholder="Enter your email" isInvalid={isInvalidEmail} color={isInvalidEmail ? "danger" : "default"} errorMessage="Please enter a valid email" onChange={handleEmailChange} />
              <Input isRequired size="md" type="password" label="Password" placeholder="Enter your password" isInvalid={isInvalidPassword} color={isInvalidPassword ? "danger" : "default"} errorMessage="Password must contain at least 8 characters, and include uppercase, lowercase, numerical, and special characters" onChange={handlePasswordChange} />
              <ErrorMessage message={errorMessage} onClose={() => setErrorMessage(null)} />
              <div className="flex flex-row w-full justify-between">
                <Link href="/">
                  <Button color="danger">Back</Button>
                </Link>
                <Button type="submit" color="primary" variant="solid" onClick={handleLogIn} onSubmit={handleLogIn} disabled={isLoading || !readyToSubmit} className="disabled:bg-transparent disabled:border disabled:border-black disabled:text-black disabled:cursor-not-allowed disabled:opacity-50 justify-center flex-wrap">
                  {isLoading ? <Spinner size="md" color="default" /> : "Log In"}
                </Button>
              </div>
            </CardBody>
          </form>
          <Divider className="mt-2" />
          <CardBody>
            <p style={{ textAlign: "center" }}>
              No account yet?{" "}
              <Link href="/register" className="underline">Sign Up</Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}