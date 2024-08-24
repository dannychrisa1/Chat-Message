
import { useState } from 'react'
import assets from '../assets/assets'
import { Button } from '../components/Button'
import { signUp, login } from '../config/firebase'


export const Login = () => {
    const bgstyles: React.CSSProperties = {
        backgroundImage: "linear-gradient(75deg, rgba(0,0,255,0.8),rgba(0,0,255,0.8)),url(background3.png)",
        backgroundPosition:"center"
    }

    const [currState, setCurrState] = useState<string>("Sign Up");
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("")

    const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if(currState === "Sign Up"){
        signUp(userName, email, password)
      }else{
         login(email, password)
       
      }
       
    }
    return (
        <div style={bgstyles} className="font-poppin login min-h-[100vh] bg-cover bg-no-repeat flex flex-col md:flex-row items-center justify-evenly">
            <img src={assets.logo2small} className="w-[max(20vw,200px)]" alt="logo" />
            <form onSubmit={handleSubmit} className='login-form bg-white py-[20px] px-[30px] flex flex-col gap-[20px]
            rounded-[10px]'>
                <h2 className='font-[500]'>{currState}</h2>
                {currState === "Sign Up" ?
                    <input
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        type="text" placeholder="username" className='py-[8px] px-[10px] border-solid border-[1px]
                border-[#c9c9c9] rounded-[8px] outline-[#077eff]' required /> : null
                }
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email" placeholder="Email Address" className='py-[8px] px-[10px] border-solid border-[1px]
                 border-[#c9c9c9] rounded-[8px] outline-[#077eff]' />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password" placeholder='Password' className='py-[8px] px-[10px] border-solid border-[1px]
                 border-[#c9c9c9] rounded-[8px] outline-[#077eff]' required />
                <Button>{currState === "Sign Up" ? "Create Account" : "Login now"}</Button>
                <div className='login-term flex gap-[5px] text-[12px] text-[#808080]'>
                    <input type="checkbox" />
                    <p>Agree to the terms of use and policy</p>
                </div>
                <div className='login-forgot flex flex-col gap-[5px]'>
                    {
                        currState === "Sign Up" ?
                            <p className="login-toggle text-[13px] text-[#5c5c5c]">Already have an account?
                                <span onClick={() => setCurrState("Login")} className='font-[500] text-[#077eff] cursor-pointer'> Login here</span>
                            </p> :
                            <p className="login-toggle text-[13px] text-[#5c5c5c]">Create an account
                                <span onClick={() => setCurrState("Sign Up")} className='font-[500] text-[#077eff] cursor-pointer'> Click here</span>
                            </p>
                    }


                </div>


            </form>
        </div>
    )
}