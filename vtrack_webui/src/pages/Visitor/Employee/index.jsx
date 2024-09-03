import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAccessCard, useAppDispatch, useAuth } from "../../../hooks";
import { CancelButton, NextButton } from "../../../components";
import { API, Browser } from "../../../constants";
import { useAppSelector } from "../../../hooks";
import Axios from "../../../services/axios";
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { setAccessCardId } from "../../../features/VisitorSlice";
import { setVisitorType } from "../../../features/VisitorSlice";

import { AccessCardSelect } from "../../../components";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    tempAccessCard: "",
    meetingPerson: "",
  });

  const Auth = useAuth();
  const Access = useAccessCard();
  const navigate = useNavigate();

  const selector = useAppSelector((state) => state.media);
  const visitorTypeData = useAppSelector((state) => state.visitor);
  const userData = useAppSelector((state) => state.auth);
  console.log(selector, "this is media data->");
  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  useEffect(() => {
    Access.getAccessCard();
  }, []);

  const handleSubmit = async (e) => {
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
    if (!formData.tempAccessCard.trim()) {
      newErrors.tempAccessCard = "Temp Access Card not selected";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      name: formData.firstName + " " + formData.lastName,
      phone: formData.phoneNo,
      access_card: formData.tempAccessCard,
    };
    try {
      const response = await Axios.patch(`${API.V1.VISITOR_DETAILS}${userData.userId}/`, payload);
      if (response.status === 401) {
        console.log(response.data, "something went strongly wrong");
      }
      const AccessToken = response.data.token;
      if (response.status === 200) {
        dispatch(setVisitorType({ visitorName: payload.name, visitorType: visitorTypeData.visitorData.visitorType }));
        dispatch(setAccessCardId({ accessCardId: formData.tempAccessCard }));
        navigate(Browser.HOSTDETAIL); // Adjust the path accordingly
      }
    } catch (error) {
      console.log(error, "something went wrong while logging in");
    }
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
              options={Access?.access || []}
              error={submitted && errors.tempAccessCard ? errors.tempAccessCard : ""}
            />
          </div>

          <div className="flex gap-2">
            <CancelButton />
            <NextButton name={"Submit"} type={"submit"} icons={<MdOutlineCheckCircleOutline />} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
