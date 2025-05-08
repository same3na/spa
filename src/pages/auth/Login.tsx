import { login as loginapi, Token } from "@/api/auth"
import MyButtonComponent from "@/components/form/MyButtonComponent";
import MyInputComponent from "@/components/form/MyInputComponent";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Login() {

  const { login } = useAuth();

  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async () => {
    const token:Token = await loginapi({username, password})
    login(token.token)

    navigate('/dashboard');
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <div className="space-y-4 md:space-y-6">
              <MyInputComponent 
                label={"Username"} 
                name={"username"} 
                value={username} 
                className={""} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"   
              />

              <MyInputComponent 
                label={"Password"} 
                name={"password"} 
                value={password}
                type="password"
                className={""} 
                onChange={(e) => setPassword(e.target.value)}  
                placeholder="••••••••"  
              />

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                  </div>
                </div>
                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
              </div>
              <MyButtonComponent
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
              >
                Submit
              </MyButtonComponent>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}