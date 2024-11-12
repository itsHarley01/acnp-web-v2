import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchServices } from "../Services/Api";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 text-gray-800 rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      <IoIosArrowBack className="text-3xl" />
    </div>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute right-[-50px] top-1/2 transform -translate-y-1/2  text-gray-800 rounded-full p-2 cursor-pointer z-10"
      onClick={onClick}
    >
      <IoIosArrowForward className="text-3xl" />
    </div>
  );
};

const ServiceCard = ({ image, title, description, price, loading }) => {
  const navigate = useNavigate(); // Use navigate

  const scrollWithOffset = (el) => {
    const yOffset = -150; // Adjust as needed
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const handleGoClick = () => {
    navigate(`/book-appointment?service=${title}`);
    setTimeout(() => {
      const bookingElement = document.querySelector("#booking");
      if (bookingElement) {
        scrollWithOffset(bookingElement);
      }
    }, 100);
  };

  return (
    <div className="m-2 rounded-lg flex flex-col text-left">
      {loading ? (
        <div className="w-full h-48 bg-gray-300 animate-pulse rounded-md"></div>
      ) : (
        <img
          src={image}
          alt={title}
          className="w-full h-58 object-cover rounded-md"
        />
      )}
      <h2
        className={`text-2xl font-semibold mt-3 ${
          loading ? "bg-gray-300 h-6 animate-pulse w-3/4 rounded-md" : ""
        }`}
      >
        {loading ? "" : title}
      </h2>
      <p
        className={`text-gray-600 mt-2 ${
          loading ? "bg-gray-200 h-4 animate-pulse w-full rounded-md" : ""
        }`}
      >
        {loading ? "" : description}
      </p>
      <p
        className={`text-xl font-bold text-gray-700 mt-2 ${
          loading ? "bg-gray-300 h-6 animate-pulse w-1/4 rounded-md" : ""
        }`}
      >
        {loading ? "" : `₱${price}`}
      </p>
      {!loading && (
        <button
          className="mt-4 border border-blue-700 text-blue-700 w-[50%] px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white"
          onClick={handleGoClick} // Handle click to navigate
        >
          Go
        </button>
      )}
    </div>
  );
};

const Services = () => {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const getServices = async () => {
      try {
        const data = await fetchServices();
        setServicesData(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };
    getServices();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const placeholders = new Array(6).fill({}); // Create 6 placeholders for loading

  return (
    <div className="bg-white flex flex-col">
      <div className="flex flex-col mt-10 text-gray-800 mx-10">
        <p className="text-5xl font-bold">Services Offered</p>
        <p className="mt-2 text-lg">Explore the range of services we offer.</p>
      </div>

      <div className="mt-10 mx-32 relative mb-20">
        <Slider {...settings}>
          {loading
            ? placeholders.map((_, index) => (
                <ServiceCard key={index} loading={true} />
              ))
            : servicesData.map((service, index) => (
                <ServiceCard
                  key={index}
                  image={service.image}
                  title={service.name}
                  description={service.description}
                  price={service.price}
                />
              ))}
        </Slider>
      </div>
    </div>
  );
};

export default Services;
