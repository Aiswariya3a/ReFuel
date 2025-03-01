import { useNavigate } from "react-router-dom";
import GetStarted from "../../assets/images/getStarted.png";
import { useEffect } from "react";
import LoginLight from "../../assets/images/loginLight.jpg";

function Index() {
  const navigate = useNavigate();
  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(45deg,rgba(0,0,0, 0.75),rgba(0,0,0, 0.75)),url(${LoginLight})`,
        backgroundPosition: `50% 50%`,
        backgroundSize: `cover`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="h-[45%] flex justify-center items-center" style={{ marginBottom: "1rem" }}>
        <img src={GetStarted} alt={"Get Started"} />
      </div>
      <div className="text-white flex flex-col gap-10">
        <div className="header">
          <h1 className="text-center text-[54px]">Let's Started</h1>
          <p>Get Fuel on your doorstep.</p>
        </div>
        <div className="actions w-full flex flex-col gap-4">
          <button
            className="bg-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
            onClick={() => {
              navigate("user/auth/login");
            }}
          >
            User
          </button>
          <button
            className="bg-transparent border border-[#fe6f2b] hover:bg-[#F59337] text-white font-bold py-2 px-4 rounded-full"
            onClick={() => {
              navigate("seller/auth/login");
            }}
          >
            Seller
          </button>
        </div>
      </div>
    </div>
  );
}

export default Index;
