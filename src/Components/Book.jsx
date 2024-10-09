import React from "react";
import img from "../assets/bintana.png";
import { NavLink } from "react-router-dom";

const Book = () => {
  return (
    <div className="h-[600px] flex">
      <div className="bg-[#0592DBFF] h-72 w-full flex flex-row justify-end my-auto relative">
        <div className="">
          <img
            src={img}
            alt=""
            className="absolute h-[800px] -left-10 top-1/2 transform -translate-y-1/2 -rotate-12"
          />
        </div>
        <div className="flex flex-col justify-center items-center text-left pr-10 w-[50%]">
          <p className="text-white text-2xl">
            Elevate your space with "Aparece Cuts n Pieces" glass services –
            we’re ready when you are!
          </p>
          <NavLink
            to="/book-appointment"
            className="bg-white w-1/2 text-[#0592DBFF] rounded-lg border mt-4 px-4 py-2 text-center"
          >
            Book now
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Book;
