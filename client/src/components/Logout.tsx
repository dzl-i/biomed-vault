import { Button, Spinner } from "@nextui-org/react"
import { MouseEventHandler } from "react"

export const Logout = ({ onConfirm, onCancel, isLoadingLogout }: { onConfirm: MouseEventHandler<HTMLButtonElement>, onCancel: MouseEventHandler<HTMLButtonElement>, isLoadingLogout: boolean }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-xl rounded-2xl z-10 gap-4 p-8">
        <p className="flex justify-center">Are you sure you want to log out?</p>

        <div className="flex flex-row gap-4 justify-center mt-4">
          <Button onClick={onCancel} color="danger" variant="solid">Cancel</Button>
          <Button onClick={onConfirm} color="success" variant="solid" disabled={isLoadingLogout}>
            {isLoadingLogout ? <Spinner size="md" color="default" /> : "Log Out"}
          </Button>
        </div>
      </div>
    </div>
  )
}