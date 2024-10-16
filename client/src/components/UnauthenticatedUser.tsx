import { Button, Link } from "@nextui-org/react"

export const UnauthenticatedUser = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <p className="text-4xl font-extrabold">401 Unauthorised</p>
      <p>You are not logged in yet. Please create an account or log in to view this page :)</p>
      <div className="flex flex-row gap-4">
        <Link href="/register"><Button color="primary">Sign Up</Button></Link>
        <Link href="/login"><Button color="primary">Log In</Button></Link>
      </div>
    </div>
  )
}