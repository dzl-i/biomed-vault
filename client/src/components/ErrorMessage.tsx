import React from 'react';
import { Card } from '@nextui-org/react';

type ErrorMessageProps = {
  message: string | null;
  onClose: () => void;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Card className="m-4 bg-[#f56565] relative px-4 py-3 flex flex-row">
      <p>
        {message}
      </p>
      <span onClick={onClose} className="cursor-pointer text-white text-2xl absolute right-6 top-[50%] translate-y-[-50%]">
        ✖
      </span>
    </Card>
  );
}