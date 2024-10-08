import React from "react";
import img from "../assets/bgimage.png";

const Hero = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="flex items-center justify-end h-full pr-10">
        <div className="flex flex-col">
          <h1 className="text-white text-4xl font-bold">
            Your future is just beyond your windows.
          </h1>
          <p className="text-white text-3xl text-right font-semibold">
            Aparece Cuts n Pieces Glass Services.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
