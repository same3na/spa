import { useForm } from "@/context/FormContext";
import { useEffect, useState } from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  className: string;
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
        className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`} 
        placeholder={placeholder}
      />
      {inputError && (
        <span className="text-red-500 text-sm mt-1">{inputError}</span>
      )}
    </div>
  )
}