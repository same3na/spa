import { setupInterceptors } from "@/api";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

export default function ErrorMessage() {
  const {logout} = useAuth()
  const [message, setMessage] = useState<string>("")
  const [statusCode, setStatusCode] = useState<number>()
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setStatusCode(0)
    setupInterceptors(setMessage, setStatusCode)
  }, [location])

  useEffect(() => {
    if (statusCode === 401) {

      logout()
      navigate('/login')
    }
    setStatusCode(0)
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