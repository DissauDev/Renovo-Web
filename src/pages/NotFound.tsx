import { Outlet } from "react-router-dom";
import animationData from "../assets/lotties/Animation 6.json"; // o usa una URL remota
import Lottie from "lottie-react";
const NotFound = () => (
  <div className="p-6 flex items-center justify-center">
    <div className="flex flex-col justify-center items-center w-full h-auto ">
      <h2 className="font-ArialBold text-center text-6xl font-varien-italic text-persian-red-800 mt-6">
        Error 404
      </h2>
      <Lottie
        animationData={animationData}
        loop
        className="w-full max-w-[200px] h-auto"
      />
    </div>
    <Outlet />
  </div>
);

export default NotFound;
