import LoginLight from "../../../assets/images/loginLight.jpg";
import { AiOutlineMail } from "react-icons/ai";
import { AiOutlineLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import { BsFuelPump } from "react-icons/bs";
import { useEffect, useState } from "react";
import SimpleMap from "../../map/Simple";
import authService from "../../../services/auth.service";
import LoadingScreen from "../../../assets/LoadingScreen.js"; 

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const fuelStation = AuthService.getCurrentFuelStation();
  const [pointer, setPointer] = useState(null);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [fuelInfo, setFuelInfo] = useState(null);

  const getResposne = async () => {
    try {
      await authService.getFuelStationByID(fuelStation.stationId).then(
        (response) => {
          console.log(response);
          setName(response.data.name);
          setAddress(response.data.location.address); // Set address from response
          setFuelInfo(response.data.quantity);        
        },
        (error) => {
          console.log(error.response.data.message);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getResposne();
  }, []);

  useEffect(() => {
    if (!fuelStation) {
      navigate("/seller/auth/login");
    }
  }, [fuelStation]);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
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
      <div className="flex w-full h-full flex-col gap-10 justify-evenly items-center align lg:flex-row lg:gap-0 md:gap-5">

        <div className="flex flex-col items-center justify-center gap-8 w-full h-full p-8 lg:flex-row lg:gap-16 lg:p-16">
            <div className="lg:w-1/2">
              
              <h1 className="text-center text-white text-4xl lg:text-6xl font-bold mb-4 animate-fadeIn">
              {name}</h1><br></br><br></br>
              <div className="text-white">
                  <h2 className="text-center text-3xl font-bold">Fuel Information</h2>
                  <p className="text-center text-2xl">Petrol : {fuelInfo && fuelInfo.petrol.quantity} liters available @ {fuelInfo && fuelInfo.petrol.price} INR</p>
                  <p className="text-center text-2xl">Diesel : {fuelInfo && fuelInfo.diesel.quantity} liters available @ {fuelInfo && fuelInfo.diesel.price} INR</p>
                </div><br></br><br></br><br></br>
              <p className="text-white">Located in :</p><address className="text-white">{address}</address> {/* Display address */}
          </div>
          

          <div className="flex flex-wrap justify-center gap-6 lg:w-1/2">
              <Link
                to="/seller/update-inventory"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">
                  Update Fuel
                </h5>
                </Link>

              <Link
                to="/seller/order"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">
                  Fuel Orders
                </h5>
              </Link>
              <Link
                to="/seller/orderHistory"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">
                  Order History
                </h5>
              </Link>
              <Link
                to="/seller/Profile"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">
                  Profile
                </h5>
              </Link>
              <Link
                to="/seller/logout"
                className="flex items-center justify-center w-[220px] h-[120px] bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
              >
                <h5 className="text-xl lg:text-2xl font-semibold">
                  Log out
                </h5>
              </Link>
        </div>
        </div>
      </div>
    </div>
      )
    }
    </>
  );
}
export default Home;
