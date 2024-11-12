import React, { useEffect, useState } from "react";
import logo from "../assets/Logo2.png";
import { fetchContactInfo, createMessage } from "../Services/Api";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
} from "react-icons/fa";

const Footer = () => {
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: "Loading...",
    email: "Loading...",
    fbLink: "Loading...",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    note: "",
  });
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    const getContactInfo = async () => {
      try {
        const data = await fetchContactInfo();
        setContactInfo({
          phoneNumber: data[0].contactNumber || "N/A",
          email: data[0].email || "N/A",
          fbLink: data[0].fbLink || "N/A",
        });
      } catch (error) {
        console.error("Error fetching contact info:", error);
        setError("Failed to load contact information.");
      }
    };

    getContactInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.name || !formData.email || !formData.note) {
      setFormError("All fields are required.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    setFormError("");
    setFormSuccess("");

    try {
      await createMessage(formData);
      setFormSuccess("Thank you! Your message has been submitted.");
      setFormData({
        name: "",
        email: "",
        note: "",
      });
    } catch (error) {
      setFormError("Failed to submit your message. Please try again.");
    }
  };

  return (
    <footer className="bg-[#0592DBFF] text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo Section */}
        <div className="mb-4 md:mb-0">
          <img src={logo} alt="Logo" className="h-72" />
        </div>
        {/* Contact Info Section */}
        <div className="text-left mb-4 md:mb-0">
          <p className="font-semibold text-2xl mb-5">Contact info</p>
          <div className="flex items-center mb-1 text-md">
            <FaPhone className="mr-2" />
            <span>{error ? "N/A" : contactInfo.phoneNumber}</span>
          </div>
          <div className="flex items-center mb-1 text-md">
            <FaEnvelope className="mr-2" />
            <span>{error ? "N/A" : contactInfo.email}</span>
          </div>
          <div className="flex items-center mb-1 text-md">
            <FaFacebook className="mr-2" />
            <span>{error ? "N/A" : contactInfo.fbLink}</span>
          </div>
          <div className="flex items-center mb-1 text-md">
            <FaMapMarkerAlt className="mr-2" />
            <span>Location: Bien Unido, Bohol</span>
          </div>
        </div>

        {/* Feedback/Message Form Section */}
        <div className="text-gray-800 w-[30%]">
          <h3 className="font-semibold text-white mb-4">Leave us a message</h3>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Name"
              className="p-2 text-gray-800 rounded-lg"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your Email"
              className="p-2 text-gray-800 rounded-lg"
            />
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              placeholder="Your Message"
              className="p-2 text-gray-800 rounded-lg"
              rows="4"
            />
            {formError && <p className="text-red-500">{formError}</p>}
            {formSuccess && <p className="text-green-500">{formSuccess}</p>}
            <button
              type="submit"
              className="bg-white rounded-lg w-1/2 mx-auto text-[#0592DBFF] py-2 px-4"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center w-full mt-6">
        <p>© 2024 | Aparece Cuts n Pieces Glass Services</p>
      </div>
    </footer>
  );
};

export default Footer;
