import { useEffect, useState } from "react";
import LoginLight from "../../../assets/images/loginLight.jpg";
import {
  AiOutlineMail,
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiOutlineLock,
  AiOutlineMobile
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import LoadingScreen from "../../../assets/LoadingScreen";
import {
    IoPersonOutline 
} from "react-icons/io5";
import { toast } from "react-toastify";
function Register() {
  const [showPassword,setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name,setName] = useState("");
  const [phno,setPhno] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const onHandleSignup = async (e) => {
    e.preventDefault();
    try {
      await AuthService.signup(email, password,name,phno).then(
        (response) => {
           toast.success(response.data.message)
        },
        (error) => {
          toast.error(error.response.data.message);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  const user = AuthService.getCurrentUser();

  useEffect(()=>{
    if(user){
        navigate('/user/')
    }
  },[user])

  return (
    <>
          {isLoading ? (
        <LoadingScreen />
      ) : (
        <div
          className="w-screen h-screen flex flex-col justify-center items-center bg-cover bg-center"
          style={{ backgroundImage: `url(${LoginLight})` }}
        >
        <div className="bg-black bg-opacity-75 p-10 rounded-lg">
          {/* <div className="header text-white"> */}
            <h1 className="text-center text-[54px]">Register</h1>
            <p className="text-center text-[14px]">Register with your email and password</p><br></br>
          
          <form className="w-full max-w-sm mt-5" onSubmit={onHandleSignup}>
            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/3">
                <label
                  className="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
                  htmlFor="inline-full-ownername"
                >
            Name
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-name"
            type="text"
            value={name}
            required
            onChange={(e)=>{
                setName(e.target.value)
            }}
            placeholder="First Middle Last"
          />
        </div>
      </div>
      
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-full-email"
          >
            Email
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-email"
            type="email"
            value={email}
            required
            onChange={(e)=>{
                setEmail(e.target.value)
            }}
            placeholder="abc@gmail.com"
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-full-phno"
          >
            Phno
          </label>
        </div>
        <div class="md:w-2/3">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-phno"
            type="text"
            value={phno}
            minLength={10}
            maxLength={13}
            required
            onChange={(e)=>{
                setPhno(e.target.value)
            }}
            placeholder="+91XXXXXXXXX"
          />
        </div>
      </div>
      <div class="md:flex md:items-center mb-6">
        <div class="md:w-1/3">
          <label
            class="block  text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
            for="inline-password"
          >
            Password
          </label>
        </div>
        <div class="md:w-2/3 relative flex flex-row">
          <input
            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 pr-7 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-password"
            type={`${(showPassword)?"text":"password"}`}
            placeholder="******************"
            minLength={8}
            required
            onChange={(e)=>{
                setPassword(e.target.value)
            }}
          />
            {showPassword ? (
            <AiOutlineEyeInvisible className="absolute top-3 right-2 text-xl text-black" onClick={()=>{
                setShowPassword(false)
            }}/>
          ): (
            <AiOutlineEye className="absolute top-3 right-2 text-xl  text-black" onClick={()=>{
                setShowPassword(true)
            }} />
          )
          }
        </div>
      </div>
      <div className="actions w-full flex flex-col gap-4">
        <button
          className="bg-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"

        >
          Sign Up
        </button>
        <button
                  className="bg-transparent border border-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
          onClick={((e)=>{
                e.preventDefault();
                navigate('../login')
              })}
        >
          Login
        </button>
      </div>
    </form>
    </div>
    </div>
)}
</>
  );
}
export default Register;
