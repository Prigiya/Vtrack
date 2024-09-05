import React, { useState } from "react";
import Axios from "../../../services/axios";
import { API, Browser } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { CancelButton, Loader, NextButton } from "../../../components";
import { MdOutlineCheckCircleOutline } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setAccessCardId, setApprovalId, setHostDetails, setVisitorType } from "../../../features/VisitorSlice";
import { setLoggedIn } from "../../../features/authSlice";

const HostDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth);
  const mediaData = useAppSelector((state) => state.media);
  const visitorData = useAppSelector((state) => state.visitor);
  const [isLoading, setIsLoading] = useState(false);
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
    // Add your custom email validation logic here
    const validSuffixes = ["innovasolutions.com", "acsicorp.com", "volt.com"];

    for (const suffix of validSuffixes) {
      if (email.endsWith(suffix)) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
      setIsLoading(false);
      return;
    }

    const payload = {
      name,
      email,
      phone,
    };

    try {
      // Step 1: Make POST API call with email to visitor-details
      const visitorPostResponse = await Axios.post(API.V1.VISITOR_DETAILS, userData.emailAddress);
      if (visitorPostResponse.status === 201) {
        // Step 2: Make PATCH API call with updated payload (You can define the payload here)
        const patchPayload = {
          // Define your payload here, e.g.,
          photo: mediaData.userData.userPhoto,
          signature: mediaData.userSignature.userSignature,
          national_id: mediaData.nationalId,
          name: visitorData.visitorData.visitorName,
          phone: visitorData.visitorData.visitorPhone,
          // company: visitorPostResponse.data.company,
          purposeOfVisit:visitorData.visitorData.purposeOfVisit,
          nid_type: mediaData.nidType,
        };

        const visitorPatchResponse = await Axios.patch(
          `${API.V1.VISITOR_DETAILS}/${visitorPostResponse.data.id}`,
          patchPayload
        );
        if (visitorPatchResponse.status === 200) {
          // Step 3: Continue with the existing API flow if the PATCH is successful
          const response = await Axios.post(API.V1.HOST_DETAILS, payload);
          const data = await response.data;
          if (response.status === 201) {
            dispatch(setHostDetails({ hostName: formData.name }));
            const approvalPayload = {
              access_card: visitorData?.AccessCardId,
              purpose_of_visit: visitorData?.CategoryId,
              visitor: userData.userId,
              host: data.id,
            };

            const responseApproval = await Axios.post(API.V1.VISITOR_APPROVALS, approvalPayload);
            if (responseApproval.status === 201) {
              dispatch(setApprovalId({ approvalId: responseApproval.data.id }));
              dispatch(setLoggedIn({ isApproved: true }));

              const currentDate = new Date();
              const isoTimestamp = currentDate.toISOString();

              const timingPayload = {
                approval: responseApproval.data.id,
                check_in: isoTimestamp,
              };
              const responseTiming = await Axios.post(API.V1.TIMING_DETAILS, timingPayload);
              if (responseTiming.status === 201) {
                navigate(Browser.THANKYOU);
              }
            }
          }
        }
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log("something went wrong", e);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className=" relative flex flex-col items-center justify-center h-screen align-middle p-6 ">
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-opacity-75 bg-gray-600 backdrop-blur-md flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className=" bg-white form-shadow p-10 rounded-2xl">
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
