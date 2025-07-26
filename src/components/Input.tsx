import React, { useCallback } from "react";

export const Input: React.FC<{
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
}> = ({ text, setText, disabled }) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setText(e.currentTarget.value);
    },
    [setText],
  );

  return (
    <input
      className="leading-[1.7] block w-full rounded-lg bg-white p-3 text-black text-sm border border-gray-300 transition-colors duration-150 ease-in-out focus:border-blue-500 outline-none"
      disabled={disabled}
      name="title"
      value={text}
      onChange={onChange}
    />
  );
};
