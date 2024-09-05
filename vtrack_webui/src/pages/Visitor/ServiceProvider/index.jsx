import React, { useEffect, useState } from "react";
import {
  useAccessCard,
  useAppDispatch,
  useAppSelector,
  useCategory,
} from "../../../hooks";
import {
  AccessCardSelect,
  CancelButton,
  CategoryDropdown,
} from "../../../components";
import { setAccessCardId, setCategoryId } from "../../../features/VisitorSlice";
import { useNavigate } from "react-router-dom";

const ServiceProvider = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    companyEmail: "",
    purposeOfVisit: "",
    meetingPerson: "",
    tempAccessCard: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const Category = useCategory();
  const Access = useAccessCard();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    Category.getCatergory();
    Access.getAccessCard();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "purposeOfVisit") {
      dispatch(setCategoryId({ categoryId: e.target.value }));
    }

    // Clear validation errors while typing
    if (submitted) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);

    // Validation
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.phoneNumber.trim() || !/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }
    if (!formData.purposeOfVisit.trim()) {
      newErrors.purposeOfVisit = "Purpose of Visit is required";
    }
    if (!formData.meetingPerson.trim()) {
      newErrors.meetingPerson = "Meeting Person is required";
    }
    if (!formData.tempAccessCard.trim()) {
      newErrors.tempAccessCard = "Temp Access Card is required";
    }

    // If there are errors, update the state and prevent navigation
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // If no errors, proceed to navigate to the next page
    dispatch(setAccessCardId({ accessCardId: formData.tempAccessCard }));

    // Navigate to the next page
    navigate("/host-details"); // Adjust the path accordingly
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl h-screen align-middle">
      <div className="form-shadow p-10 rounded-2xl">
        <div className=" flex flex-row justify-between gap-28">
          <h1 className="text-2xl font-bold mb-4">Service Provider Form</h1>
          <img
            src="../images/innova.png"
            alt="Company Logo"
            className="h-7 w-auto"
          />
        </div>
        <div className="flex flex-col md:flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col mb-2 md:w-1/2">
              <label className="text-gray-700">First Name:*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`border rounded-md p-2 ${
                  errors.firstName ? "border-red-500" : ""
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="flex flex-col mb-2 md:w-1/2">
              <label className="text-gray-700">Last Name:*</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`border rounded-md p-2 ${
                  errors.lastName ? "border-red-500" : ""
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="relative z-0 w-full mb-2 group flex flex-col">
            <label className="text-gray-700">Phone Number*:</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`border rounded-md p-2 ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {submitted && errors.phoneNumber && (
              <p className="text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          <AccessCardSelect
            value={formData.tempAccessCard}
            onChange={handleChange}
            options={Access?.access || []}
            error={
              submitted && errors.tempAccessCard ? errors.tempAccessCard : ""
            }
          />

          <CategoryDropdown
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            submitted={submitted}
          />
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-2 w-full"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <CancelButton />
      </div>
    </div>
  );
};

export default ServiceProvider;
