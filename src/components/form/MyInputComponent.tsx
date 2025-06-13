import { useForm } from "@/context/FormContext";
import { useEffect, useState } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string
};

export default function MyInputComponent({ label, name, value, className, onChange, type = "text", placeholder }:InputFieldProps) {

  const {errorDetails} = useForm()
  const [inputError, setInputError] = useState<string | null>(null)

  useEffect(() => {
    if (name in errorDetails) {
      setInputError(errorDetails[name])
    }
  }, [errorDetails])

  return (
    <div>
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <input 
        type={type}
        name={name} 
        id={name}
        value={value}
        onChange={onChange}    
        className={`bg-transparent px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none  w-full ${className}`} 
        placeholder={placeholder}
      />
      {inputError && (
        <span className="text-red-500 text-sm mt-1">{inputError}</span>
      )}
    </div>
  )
}