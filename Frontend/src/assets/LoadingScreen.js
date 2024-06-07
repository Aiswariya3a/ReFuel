// src/components/LoadingScreen.js
import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../loading-screen.json";

const LoadingScreen = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <Lottie
        animationData={loadingAnimation}
        style={{ width: 300, height: 300, color: "black"}}
      />
    </div>
  );
};

export default LoadingScreen;
