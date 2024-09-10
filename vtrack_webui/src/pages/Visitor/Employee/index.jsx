import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CancelButton, NextButton } from "../../../components";
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { toast } from "react-toastify"; // Assuming you're using react-toastify for toast messages
import "react-toastify/dist/ReactToastify.css";
import { AccessCardSelect } from "../../../components";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    tempAccessCard: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.phoneNo.trim() || !/^\d{10}$/.test(formData.phoneNo.trim())) {
      newErrors.phoneNo = "Please enter a valid 10-digit phone number";
    }
    if (!formData.tempAccessCard.trim()) {
      newErrors.tempAccessCard = "Temp Access Card not selected";
    }

    // Check if there are errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Display a toast message
      toast.error("Please fill all the required fields correctly.");
      return;
    }

    // If form is valid, navigate to another page
    navigate("/nextPage"); // Replace '/nextPage' with your actual route
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen align-middle">
      <div className="form-shadow p-10 rounded-2xl w-full lg:w-1/2 xl:w-1/2">
        <div className="flex flex-row justify-between gap-6 md:gap-28">
          <h1 className="text-xl md:text-2xl font-bold mb-6">Employee Details Form</h1>
          <img src="../images/innova.png" alt="Company Logo" className="h-7 w-auto" />
        </div>
        <form className="mx-auto rounded-2xl" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col lg:w-1/2">
                <label className="text-gray-700">First Name:*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`border rounded-md p-2 ${errors.firstName ? "border-red-500" : ""}`}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>

              <div className="flex flex-col lg:w-1/2">
                <label className="text-gray-700">Last Name:*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`border rounded-md p-2 ${errors.lastName ? "border-red-500" : ""}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Phone No.:*</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className={`border rounded-md p-2 ${errors.phoneNo ? "border-red-500" : ""}`}
              />
              {errors.phoneNo && <p className=" text-sm text-red-500">{errors.phoneNo}</p>}
            </div>

            {/* Use AccessCardSelect component here */}
            <AccessCardSelect
              value={formData.tempAccessCard}
              onChange={handleChange}
              options={[]} // Update this if there are dynamic options
              error={errors.tempAccessCard ? errors.tempAccessCard : ""}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <CancelButton />
            <NextButton name={"Submit"} type={"submit"} icons={<MdOutlineCheckCircleOutline />} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
