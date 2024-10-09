import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchProductsByType } from "../Services/Api";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-0 left-0 flex items-center h-full z-50 cursor-pointer"
      onClick={onClick}
    >
      <FaArrowLeft className="text-gray-800 text-3xl" />
    </div>
  );
};

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="absolute top-0 right-0 flex items-center h-full cursor-pointer"
      onClick={onClick}
    >
      <FaArrowRight className="text-gray-800 text-3xl" />
    </div>
  );
};

const ProductCard = ({ image, name, loading, isActive }) => {
  return (
    <div
      className={`m-2 rounded-lg flex flex-col text-center transition-transform duration-300 ${
        isActive
          ? "transform scale-100 opacity-100"
          : "transform scale-[0.6] opacity-50"
      }`}
    >
      {loading ? (
        <div className="w-full h-96 bg-gray-300 animate-pulse rounded-md"></div>
      ) : (
        <img
          src={image}
          alt={name}
          className="w-full h-96 object-cover rounded-md"
        />
      )}
      <h2
        className={`text-xl font-semibold mt-3 ${
          loading
            ? "bg-gray-300 h-6 animate-pulse w-3/4 mx-auto rounded-md"
            : ""
        }`}
      >
        {loading ? "" : name}
      </h2>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentType, setCurrentType] = useState("glass");
  const [activeSlide, setActiveSlide] = useState(0); // Track the active slide

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProductsByType(currentType);
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [currentType]); // Refetch when type changes

  const handleFilterClick = (type) => {
    setCurrentType(type);
  };

  const [settings, setSettings] = useState({
    infinite: true,
    lazyLoad: true,
    speed: 300,
    slidesToShow: 3,
    dots: true,
    centerMode: true,
    centerPadding: 0,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current, next) => setActiveSlide(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  });

  useEffect(() => {
    const handleResize = () => {
      const slidesToShow = window.innerWidth <= 768 ? 1 : 3;
      setSettings({ ...settings, slidesToShow });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const placeholders = new Array(3).fill({}); // 3 placeholders for loading

  return (
    <div className="flex flex-col my-20">
      <div className="mt-10 mx-28 relative mb-20">
        <Slider {...settings}>
          {loading
            ? placeholders.map((_, index) => (
                <ProductCard key={index} loading={true} isActive={false} />
              ))
            : products.map((product, index) => (
                <ProductCard
                  key={index}
                  image={product.image}
                  name={product.name}
                  isActive={index === activeSlide}
                />
              ))}
        </Slider>

        <div className="flex justify-center mt-10 space-x-4">
          <button
            className={`px-6 py-2 rounded-md ${
              currentType === "glass"
                ? "bg-blue-600 text-white"
                : "border border-blue-600"
            }`}
            onClick={() => handleFilterClick("glass")}
          >
            Glass
          </button>
          <button
            className={`px-6 py-2 rounded-md ${
              currentType === "frame"
                ? "bg-blue-600 text-white"
                : "border border-blue-600"
            }`}
            onClick={() => handleFilterClick("frame")}
          >
            Frame
          </button>
          <button
            className={`px-6 py-2 rounded-md ${
              currentType === "completeunit"
                ? "bg-blue-600 text-white"
                : "border border-blue-600"
            }`}
            onClick={() => handleFilterClick("completeunit")}
          >
            Others
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
