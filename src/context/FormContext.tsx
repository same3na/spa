import { createContext, useContext, useState } from "react";

interface FormContextType {
  errorDetails: any
  setErrorDetails: (derails:{}) => void
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({children}: {children: React.ReactNode}) {

  const [errorDetails, setErrorDetails] = useState<{}>({})

  return (
    <FormContext.Provider value={{ errorDetails, setErrorDetails }}>
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
