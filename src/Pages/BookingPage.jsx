import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNavigate } from "react-router-dom";
import {
  createAppointment,
  getDateByAppointment,
  fetchServices,
} from "../Services/Api";
import { useLocation } from "react-router-dom";

function BookingPage() {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [bookedDates, setBookedDates] = useState({});
  const [checkbox, setCheckbox] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const [isServicesLoading, setIsServicesLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedService = params.get("service"); // Get service from URL
    if (selectedService) {
      setPurpose(selectedService); // Pre-select service if available
    }
  }, [location.search]);

  async function fetchBookedDates() {
    try {
      const appointments = await getDateByAppointment();
      const formattedDates = {};
      appointments.forEach((app) => {
        const dateKey = new Date(app.preferredDate);
        if (app.status === "accepted") {
          dateKey.setDate(dateKey.getDate() - 1);
          const formattedDateKey = dateKey.toISOString().split("T")[0];
          formattedDates[formattedDateKey] = "booked";
        }
      });
      setBookedDates(formattedDates);
    } catch (error) {
      console.error("Error fetching booked dates:", error);
      setError((prev) => ({
        ...prev,
        general: "Failed to load booked dates.",
      }));
    }
  }
  useEffect(() => {
    fetchBookedDates();
  }, []);

  // Fetch services and populate dropdown
  useEffect(() => {
    const getServices = async () => {
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsServicesLoading(false);
      }
    };

    getServices();
  }, []);

  useEffect(() => {
    fetchBookedDates();
  }, []);

  const handleDateChange = (date) => {
    const formatted = date.toISOString().split("T")[0];
    if (bookedDates[formatted]) {
      alert("This date is already booked. Please select another date.");
      return;
    }
    setDate(date);
    setFormattedDate(formatted);
  };

  const validateStep = () => {
    let valid = true;
    const newErrors = {};

    if (step === 1 && !purpose) {
      newErrors.purpose = "Purpose is required.";
      valid = false;
    }
    if (step === 2) {
      if (!name) {
        newErrors.name = "Name is required.";
        valid = false;
      }
      if (!address) {
        newErrors.address = "Address is required.";
        valid = false;
      }
      if (!phone) {
        newErrors.phone = "Phone number is required.";
        valid = false;
      }
    }
    if (step === 3) {
      if (!formattedDate) {
        newErrors.date = "Date is required.";
        valid = false;
      }
      if (!time) {
        newErrors.time = "Preferred time is required.";
        valid = false;
      }
    }
    if (step === 5 && !checkbox) {
      newErrors.checkbox = "You must agree to the terms and conditions.";
      valid = false;
    }

    setError(newErrors);
    return valid;
  };

  const SuccessModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
          <p className="mb-4">Your booking has been successfully submitted.</p>
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Okay
          </button>
        </div>
      </div>
    );
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsLoading(true);

    const appointmentData = {
      service: purpose,
      name: name,
      email: email,
      address: address,
      contactNumber: phone,
      preferredDate: formattedDate,
      preferredTime: time,
      note: additionalInfo,
      status: "pending",
    };

    try {
      const response = await createAppointment(appointmentData);
      setSuccess(true);
      setError({});
      setShowModal(true);
    } catch (err) {
      setError((prev) => ({
        ...prev,
        general: "Failed to create appointment. Please try again.",
      }));
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleModalClose = () => {
    setShowModal(false);
    navigate("/"); // Navigate to the homepage only when the modal is closed
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Purpose of Booking
            </label>
            <select
              value={purpose} // The service will be pre-selected
              onChange={(e) => setPurpose(e.target.value)}
              className={`w-full border px-3 py-2 ${
                error.purpose ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              required
            >
              <option value="" disabled>
                {isServicesLoading ? "Loading services..." : "Select a service"}
              </option>
              {services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>

            {error.purpose && (
              <p className="text-red-500 text-sm">{error.purpose}</p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border px-3 py-2 ${
                error.name ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              required
            />
            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
            <label className="block text-gray-700 mb-2 mt-4">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Optional"
              className="w-full border px-3 py-2 border-gray-300 rounded-md"
            />
            <label className="block text-gray-700 mb-2 mt-4">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full border px-3 py-2 ${
                error.address ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              required
            />
            {error.address && (
              <p className="text-red-500 text-sm">{error.address}</p>
            )}
            <label className="block text-gray-700 mb-2 mt-4">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full border px-3 py-2 ${
                error.phone ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              required
            />
            {error.phone && (
              <p className="text-red-500 text-sm">{error.phone}</p>
            )}
          </div>
        );
      case 3:
        return (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Date</label>
            <Calendar
              onChange={handleDateChange}
              minDate={new Date()} // Prevent past date selection
              tileClassName={({ date }) => {
                const dateString = date.toISOString().split("T")[0];
                return bookedDates[dateString] ? "custom-red" : null;
              }}
            />
            {error.date && <p className="text-red-500 text-sm">{error.date}</p>}
            <label className="block text-gray-700 mb-2 mt-4">
              Preferred Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full border px-3 py-2 ${
                error.time ? "border-red-500" : "border-gray-300"
              } rounded-md`}
              required
            />
            {error.time && <p className="text-red-500 text-sm">{error.time}</p>}
          </div>
        );
      case 4:
        return (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows="4"
              className="w-full border px-3 py-2 border-gray-300 rounded-md"
            />
          </div>
        );
      case 5:
        return (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Terms and Agreement
            </label>
            <div className="relative border border-gray-300 rounded-md h-48 overflow-y-scroll mb-4 bg-white p-4">
              <p className="text-sm text-gray-600">
                {/* Add your contract or terms and agreement text here. */}
                By proceeding with this booking, you agree to the following
                terms and conditions. Please make sure to read through the
                entirety of the agreement, which covers cancellation policies,
                privacy practices, and guidelines for service use. Failure to
                comply with the terms may result in penalties or restrictions.
                {/* Additional placeholder text to simulate a long contract */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                id nulla at lacus vestibulum consequat. Cras aliquam, lorem nec
                condimentum vehicula, lorem justo feugiat nisl, nec aliquam mi
                nisl ut mi. Duis consectetur orci sit amet nisl varius, et
                pulvinar velit efficitur. Proin dapibus metus at lectus cursus,
                nec vulputate nisi ornare. In suscipit, velit a laoreet pretium,
                orci ex bibendum orci, nec vestibulum quam odio eget odio.
                Aliquam erat volutpat. Phasellus eget purus at erat eleifend
                vestibulum.
                {/* Repeat as necessary */}
              </p>
              {/* Gradient overlay to indicate scrollable content */}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Scroll down to read more...
            </p>
            <label className="block text-gray-700 mb-2">
              <input
                type="checkbox"
                checked={checkbox}
                onChange={(e) => setCheckbox(e.target.checked)}
              />{" "}
              I have read and agree to the terms and conditions
            </label>
            {error.checkbox && (
              <p className="text-red-500 text-sm">{error.checkbox}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex bg-white w-[800px] p-6 shadow-lg rounded-lg">
        {/* Stepper Section */}
        <div className="relative w-1/3 mr-4">
          <h2 className="text-2xl font-bold mb-4">Booking Steps</h2>
          <div className="flex flex-col">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className={`flex items-center mb-4 relative`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === index + 1
                      ? "bg-blue-500 text-white"
                      : step > index + 1
                      ? "bg-green-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">
                    {index === 0 && "Purpose of Booking"}
                    {index === 1 && "Personal Information"}
                    {index === 2 && "Select Date and Time"}
                    {index === 3 && "Additional Information"}
                    {index === 4 && "Terms and Conditions"}
                  </h3>
                  {index < step - 1 && (
                    <p className="text-gray-500">Completed</p>
                  )}
                  {index === step - 1 && (
                    <p className="text-blue-500">Current Step</p>
                  )}
                </div>
                {index < 4 && ( // Add the line only if it's not the last step
                  <div
                    className={`absolute left-4 top-10 w-1 h-16 ${
                      step > index + 1 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Form Section */}
        <div className="w-2/3">
          <h2 className="text-2xl font-bold mb-4">Booking Form</h2>
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            {error.general && (
              <p className="text-red-500 text-sm mb-4">{error.general}</p>
            )}
            {success && (
              <p className="text-green-500 text-sm mb-4">
                Appointment successfully created!
              </p>
            )}
            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleNext}
                  disabled={isLoading} // Disable button when loading
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className={`bg-green-500 text-white px-4 py-2 rounded ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading} // Disable button when loading
                >
                  {isLoading ? (
                    <span className="loader">Loading...</span> // Show loading animation when processing
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {showModal && <SuccessModal onClose={handleModalClose} />}
    </div>
  );
}

export default BookingPage;
