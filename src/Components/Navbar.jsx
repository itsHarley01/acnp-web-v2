import React from "react";
import { HashLink } from "react-router-hash-link";
import logo2 from "../assets/logo2.png";

const scrollWithOffset = (el) => {
  const yOffset = el.id === "about" ? -150 : -200;
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
  window.scrollTo({ top: y, behavior: "smooth" });
};

const Navbar = () => {
  return (
    <nav className="bg-white sticky top-0 z-50 w-full border-b shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center">
          <HashLink to="/">
            <img src={logo2} alt="Logo" className="h-20" />
          </HashLink>
          <ul className="flex space-x-6 ml-6">
            <li className="flex gap-10">
              <HashLink
                smooth
                to="/#about"
                scroll={(el) => scrollWithOffset(el)}
                className="text-blue hover:text-blue-300"
              >
                Who we are
              </HashLink>
              <HashLink
                smooth
                to="/#services"
                scroll={(el) => scrollWithOffset(el)}
                className="text-blue hover:text-blue-300"
              >
                What we offer
              </HashLink>
              <HashLink
                smooth
                to="/#projectgallery"
                scroll={(el) => scrollWithOffset(el)}
                className="text-blue hover:text-blue-300"
              >
                Project Gallery
              </HashLink>
            </li>
          </ul>
        </div>
        <div className="mr-8">
          <HashLink
            smooth
            to="/book-appointment/#booking"
            scroll={(el) => scrollWithOffset(el)}
            className="bg-blue-500 text-white px-6 py-4 rounded hover:bg-blue-600"
          >
            Book Now
          </HashLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
