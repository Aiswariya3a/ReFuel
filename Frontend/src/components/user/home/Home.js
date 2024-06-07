import LoginLight from "../../../assets/images/loginLight.jpg";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import { useEffect, useState } from "react";
import LoadingScreen from "../../../assets/LoadingScreen.js";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/user/auth/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getResponse = async () => {
    try {
      await AuthService.getUserInfo(user.userId).then(
        (response) => {
          setName(response.data.name);
        },
        (error) => {
          console.error(error.response.data.message);
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getResponse();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div
          className="w-screen h-screen flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.5)), url(${LoginLight})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex flex-col items-center justify-center gap-8 w-full h-full p-8 lg:flex-row lg:gap-16 lg:p-16">
            <div className="text-center lg:w-1/2">
              <h1 className="text-white text-4xl lg:text-6xl font-bold mb-4 animate-fadeIn">
                {"Hey, " + name.split(" ")[0]}
              </h1>
              <p className="text-white text-lg lg:text-2xl mb-6 animate-fadeIn delay-1s">
                Welcome to your dashboard
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6 lg:w-1/2">
              <Link
                to="/user/order"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">Order Fuel</h5>
              </Link>
              <Link
                to="/user/orderHistory"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">
                  Order History</h5>
              </Link>
              <Link
                to="/user/Profile"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">
                  Profile</h5>
              </Link>
              <Link
                to="/user/logout"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">
                  Log Out</h5>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
