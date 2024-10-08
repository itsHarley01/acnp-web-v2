import React, { useEffect, useState } from "react";
import sym from "../assets/aboutadd.svg";
import ab from "../assets/about.png";
import { FaRuler, FaHammer, FaDumbbell } from "react-icons/fa";
import { fetchAboutDescription } from "../Services/Api";

const About = () => {
  const [aboutDescription, setAboutDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAboutDescription = async () => {
      try {
        const description = await fetchAboutDescription();
        setAboutDescription(description[0].description);
      } catch (error) {
        console.error("Error fetching the about description:", error);
      } finally {
        setLoading(false);
      }
    };

    getAboutDescription();
  }, []);

  return (
    <div className="bg-white my-20">
      <div className="flex">
        <div className="p-20 w-[50%] my-32 flex flex-col">
          <div className="flex">
            <div className="flex flex-col w-[60%]">
              <p className="text-5xl font-bold text-gray-800">Who We Are</p>
              <img src={sym} className="w-auto h-auto" alt="Description" />
            </div>
            <div className="flex w-[40%]"></div>
          </div>

          {loading ? (
            <p className="my-10 text-lg">Loading...</p>
          ) : (
            <p className="my-10 text-lg">{aboutDescription}</p>
          )}
        </div>

        <div className="pt-20 px-20  w-[50%] relative">
          <div className="flex flex-col border rounded-lg absolute left-16 z-10 transform -translate-x-1/2 -translate-y-[-50%] bg-white shadow-lg shadow-gray-500 ">
            <p className="text-center pt-2 text-xl font-bold text-blue-500">
              We provide
            </p>
            <div className="flex items-center mt-2 bg-[#F0FAFFFF] m-2 rounded-lg py-4 px-9 mx-3 ">
              <FaRuler className="text-blue-500 mr-2" />
              <p className="font-semibold text-blue-500">Precision</p>
            </div>
            <div className="flex items-center mt-2 bg-[#FDF1F5FF] m-2 rounded-lg py-4 px-9 mx-3 ">
              <FaHammer className="text-pink-500 mr-2" />
              <p className="font-semibold text-pink-500">Customization</p>
            </div>
            <div className="flex items-center mt-2 bg-[#FEF9EEFF] m-2 rounded-lg py-4 px-9 mx-3 mb-5">
              <FaDumbbell className="text-yellow-600 mr-2" />
              <p className="font-semibold text-yellow-600">Durability</p>
            </div>
          </div>

          <div className="relative w-full h-full rounded-t-full overflow-hidden">
            <img src={ab} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
