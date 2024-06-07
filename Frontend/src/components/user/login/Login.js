import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AiOutlineMail,
  AiOutlineEyeInvisible,
  AiOutlineEye,
  AiOutlineLock,
  AiOutlineMobile,
} from "react-icons/ai";
import authService from "../../../services/auth.service";
import { toast } from "react-toastify";
import LoadingScreen from "../../../assets/LoadingScreen"; // Adjust the path as necessary
import LoginLight from "../../../assets/images/loginLight.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const user = authService.getCurrentUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/user/");
    }
  }, [user, navigate]);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.login(email, password).then(
        (response) => {
          toast.success("Login Successful");
          navigate("/user/");
        },
        (error) => {
          toast.error(error.response.data.message);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

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
            <div className="header text-whute">
              <h1 className="text-center text-[54px]">User Login</h1>
              <p className="text-center text-[14px]">Login with your email and password</p><br></br>
            </div>
            <form className="w-full max-w-sm mt-5" onSubmit={handleLogin}>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-email"
                  >
                    Email
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="inline-email"
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abc@gmail.com"
                  />
                </div>
              </div>
              <div className="md:flex md:items-center mb-6">
                <div className="md:w-1/3">
                  <label
                    className="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4"
                    htmlFor="inline-password"
                  >
                    Password
                  </label>
                </div>
                <div className="md:w-2/3 relative flex flex-row">
                  <input
                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 pr-7 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    id="inline-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="******************"
                    minLength={8}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {showPassword ? (
                    <AiOutlineEyeInvisible
                      className="absolute top-3 right-2 text-xl text-black"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <AiOutlineEye
                      className="absolute top-3 right-2 text-xl text-black"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
              </div>
              <div className="actions w-full flex flex-col gap-4">
                <button
                  type="submit"
                  className="bg-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
                >
                  Login
                </button>
                <button
                  className="bg-transparent border border-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("../register");
                  }}
                >
                  Sign Up
                </button>
                <button
                  className="bg-transparent mb-5 border border-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/seller/");
                  }}
                >
                  Seller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
