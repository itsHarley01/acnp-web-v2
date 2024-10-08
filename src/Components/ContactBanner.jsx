import React, { useEffect, useState } from "react";
import { FaPhone, FaEnvelope, FaFacebook } from "react-icons/fa";
import { fetchContactInfo } from "../Services/Api";

const ContactBanner = () => {
  const [contactInfo, setContactInfo] = useState({
    phoneNumber: "",
    email: "",
    fbLink: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getContactInfo = async () => {
      try {
        const data = await fetchContactInfo();
        console.log("this is a", data[0].contactNumber);
        setContactInfo({
          phoneNumber: data[0].contactNumber || "N/A",
          email: data[0].email || "N/A",
          fbLink: data[0].fbLink || "N/A",
        });
      } catch (error) {
        console.error("Error fetching contact info:", error);
        setError("Failed to load contact information.");
      } finally {
        setLoading(false);
      }
    };

    getContactInfo();
  }, []);

  if (loading) {
    return <p className="text-white">Loading contact information...</p>;
  }

  if (error) {
    return <p className="text-white">{error}</p>;
  }

  return (
    <div className="bg-[#0592DBFF] w-full my-20 flex">
      <div className="px-5 flex py-8 mx-auto">
        <p className="text-7xl text-white font-bold">Get in Touch with Us</p>
        <div className="ml-16 flex-col flex gap-2">
          <div className="flex items-center rounded-lg">
            <FaPhone className="text-white mr-2" />
            <p className="font-semibold text-white">
              {contactInfo.phoneNumber}
            </p>
          </div>
          <div className="flex items-center rounded-lg">
            <FaEnvelope className="text-white mr-2" />
            <p className="font-semibold text-white">{contactInfo.email}</p>
          </div>
          <div className="flex items-center rounded-lg">
            <FaFacebook className="text-white mr-2" />
            <p className="font-semibold text-white">{contactInfo.fbLink}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBanner;
