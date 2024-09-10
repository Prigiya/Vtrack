import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CancelButton, NextButton } from "../../../components";
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { Browser } from "../../../constants";

const HostDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const { name, email, phone } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    // Clear the error message when the user starts typing again
    setErrors({
      ...errors,
      [e.target.id]: "",
    });
  };

  const validateEmail = () => {
    const validSuffixes = ["innovasolutions.com", "acsicorp.com", "volt.com"];
    for (const suffix of validSuffixes) {
      if (email.endsWith(suffix)) {
        return true;
      }
    }
    return false;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Basic validation for the required fields
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    // Additional validation for email suffix
    if (!validateEmail()) {
      newErrors.email = "Invalid email address. Please use a valid company email.";
    }

    // If there are errors, update the state and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, navigate to the next page
    navigate(Browser.THANKYOU); // Change this to the actual route of the next page
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen align-middle p-6">
      <div className="bg-white form-shadow p-10 rounded-2xl">
        <div className="flex justify-between gap-28">
          <h1 className="font-bold text-xl mb-6">Host Detail Form</h1>
          <img className="h-7 w-auto md:ml-auto" src="/images/innova.png" alt="company_logo" />
        </div>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto rounded-2xl">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name of the person you wish to meet.
            </label>
            <input
              type="text"
              id="name"
              className={`w-full p-2 border border-gray-300 rounded-md ${errors.name ? "border-red-500" : ""}`}
              value={name}
              onChange={handleChange}
              placeholder="Enter name of the person"
              required
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address of the person.
            </label>
            <input
              type="email"
              id="email"
              className={`w-full p-2 border border-gray-300 rounded-md ${errors.email ? "border-red-500" : ""}`}
              value={email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone Number.
            </label>
            <input
              type="tel"
              id="phone"
              className={`w-full p-2 border border-gray-300 rounded-md ${errors.phone ? "border-red-500" : ""}`}
              value={phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          <div className="flex gap-4">
            <CancelButton />
            <NextButton name={"Submit"} icons={<MdOutlineCheckCircleOutline />} type={"submit"} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostDetailsForm;
