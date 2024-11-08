import { Button, ModalBody, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react"
import { MouseEventHandler } from "react"

export const Logout = ({ onConfirm, onCancel, isLoadingLogout }: { onConfirm: MouseEventHandler<HTMLButtonElement>, onCancel: MouseEventHandler<HTMLButtonElement>, isLoadingLogout: boolean }) => {
  return (
    <>
      <ModalHeader className="flex flex-col gap-1 text-center">Log Out</ModalHeader>
      <ModalBody>
        <p className="text-center">Are you sure you want to log out?</p>
      </ModalBody>
      <ModalFooter className="flex justify-center">
        <Button onClick={onCancel} color="danger" variant="solid">Cancel</Button>
        <Button onClick={onConfirm} color="success" variant="solid" disabled={isLoadingLogout}>
          {isLoadingLogout ? <Spinner color="default" /> : "Log Out"}
        </Button>
      </ModalFooter>
    </>
  )
}