import { MouseEventHandler } from "react"

export const Privacy = ({ onClose }: { onClose: MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-xl rounded-2xl z-10 flex flex-col gap-6 p-8 max-w-2xl w-full">
        <p className="text-3xl text-center">Privacy and Safety</p>
        <p className="flex justify-center">
          BiomeData takes the privacy of researchers and patients seriously. BiomeData is designed to ensure compliance with relevant privacy and security regulations, such as the Australian Privacy Act and data ethics standards.
        </p>

        <p className="flex justify-center">
          For researchers, sensitive data such as passwords are hashed before sending it to the server during registration and log in, to ensure safety from packet sniffing. Additionally, data transfers are completed through a secure HTTPS (HTTP Secure) connection. Accounts will also be locked if there are three failed log in attempts to prevent bruteforce attacks. Tokens are also utilised for secure user sessions which are also used for authentication and authorisation, to prevent misuse of the web application.
        </p>

        <p className="flex justify-center">
          BiomeData also adheres to HIPAA Privacy Rule to protect patient&apos;s data. Patients are viewed anonymously by researchers unless the patient is affiliated to the researcher. Only data that are relevant to the research (such as diagnostic and treatment information, genomic data, phenotype data, etc.) are shown and visible to all researchers with an account, however, confidential data such as patient name and date of birth are hidden to the public. However, should a researcher wish to get more information about a specific patient, the researcher would be able to contact the lead researcher to obtain more details.
        </p>

        <p className="flex justify-center">
          Logging is also implemented in the application. Every action performed, whether uploading, viewing, or editing data, is logged to ensure data integrity and provide an audit trail. This audit trail is only visible to system admins, where they can view audit trail as a whole, or based on any given researcher.
        </p>
        <button color="primary" onClick={onClose} className="bg-biomedata-blue py-3 rounded-2xl text-white hover:opacity-85">Close</button>
      </div>
    </div>
  )
}