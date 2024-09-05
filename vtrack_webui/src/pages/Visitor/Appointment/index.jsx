import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../assets/main.css";
import {
  useAccessCard,
  useAppDispatch,
  useCategory,
} from "../../../hooks";
import {
  AccessCardSelect,
  CancelButton,
  CategoryDropdown,
} from "../../../components";
import { useSelector } from "react-redux";
import { Browser } from "../../../constants";
import { setAccessCardId, setCategoryId } from "../../../features/VisitorSlice";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    purposeOfVisit: "",
    tempAccessCard: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const Access = useAccessCard();
  const dispatch = useAppDispatch();
  const visitorTypeData = useSelector((state) => state.visitor);
  const userData = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "purposeOfVisit") {
      dispatch(setCategoryId({ categoryId: e.target.value }));
    }
    setErrors({ ...errors, [e.target.name]: "" });
  };

  useEffect(() => {
    Access.getAccessCard();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

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
    if (!formData.purposeOfVisit.trim()) {
      newErrors.purposeOfVisit = "Purpose of Visit is required";
    }
    if (!formData.tempAccessCard.trim()) {
      newErrors.tempAccessCard = "Temp Access Card must be selected";
    }

    // If there are errors, update the state and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill out all required fields correctly.");
      return;
    }

    // If no errors, navigate to the next page
    dispatch(setAccessCardId({ accessCardId: formData.tempAccessCard }));
    toast.success("Details are valid, proceeding to the next step.");
    navigate(Browser.HOSTDETAIL); // Adjust the path accordingly
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen align-middle">
      <div className="form-shadow p-10 rounded-2xl">
        <div className="flex flex-row justify-between gap-28">
          <h1 className="text-2xl font-bold mb-6">Visitor Details Form</h1>
          <img
            src="../images/innova.png"
            alt="Company Logo"
            className="h-7 w-auto"
          />
        </div>
        <form className="max-w-md mx-auto rounded-2xl" onSubmit={handleSubmit}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col mb-4 md:w-1/2">
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

            <div className="flex flex-col mb-4 md:w-1/2">
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

          <div className="relative flex flex-col z-0 w-full mb-5 group">
            <label className="text-gray-700">Phone Number:*</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className={`border rounded-md p-2 ${
                errors.phoneNo ? "border-red-500" : ""
              }`}
            />
            {submitted && errors.phoneNo && (
              <p className="text-red-500">{errors.phoneNo}</p>
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

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-2 w-full"
          >
            Submit
          </button>
          <CancelButton />
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
