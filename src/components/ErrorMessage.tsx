import { setupInterceptors } from "@/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function ErrorMessage() {
  const [message, setMessage] = useState<string>("")
  const [statusCode, setStatusCode] = useState<number>()
  
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(setMessage, setStatusCode)
  }, [])

  useEffect(() => {
    if (statusCode === 401) {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [statusCode])

  useEffect(() => {
    if (!message) return;

    toast.error(message)
    setMessage("")
  }, [message])

  return (
    <div>
      <ToastContainer />
    </div>
  )
}