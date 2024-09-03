import React, { useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { GrLinkNext } from "react-icons/gr";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { setUserData } from "../../../features/userMediaSlice";
import { API, Browser } from "../../../constants";
import { CancelButton } from "../../../components";
import { useNavigate } from "react-router-dom";
import Axios from "../../../services/axios";

const PageInteraction = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [showCaptureButton, setShowCaptureButton] = useState(false);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(false);
  const [ProfilePhotoRaw, setProfilePhotoRaw] = useState(null);
  const [signatureBlob, setSignatureBlob] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const userData = useAppSelector((state) => state.auth);

  // Ensure the custom hook is aware of isFormDirty state

  const videoRef = useRef(null);
  const signatureRef = useRef(null);

  useEffect(() => {
    // Mark form as dirty if there is existing profile photo or signature
    if (profilePhoto || signature) {
      console.log("this is being called--->", isFormDirty);
      setIsFormDirty(true);
    }
    if (userData.userPhoto || userData.userSignature) {
      setIsFormDirty(true);
    }
  }, [profilePhoto, signature]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Use the front camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCaptureButton(true); // Show the capture button after starting the camera
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleProfilePhotoClick = () => {
    startCamera();
    setShowCaptureButton(true);
    setProfilePhoto(null);
  };

  function removeImageDataPrefix(encodedString) {
    if (encodedString.startsWith("data:image/png;base64,")) {
      return encodedString.slice("data:image/png;base64,".length);
    } else {
      return encodedString;
    }
  }

  const handleCapturePhoto = async () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    setIsFormDirty(true);
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

      // Convert the canvas content to base64 data URL
      const dataURL = canvas.toDataURL("image/png");
      setProfilePhoto(dataURL);
      const removeDataURL = removeImageDataPrefix(dataURL);
      setProfilePhotoRaw(removeDataURL);

      // Stop the camera stream
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());

      // Hide the capture button after photo is captured
      setShowCaptureButton(false);
      setIsPhotoCaptured(true);
    }
  };

  const handleSignatureClear = () => {
    signatureRef.current.clear();
    setSignature(null); // Clear the signature state
  };

  const handleBase64InputChange = (base64String) => {
    // Convert Base64 to binary
    const binaryString = decodeURIComponent(base64String);

    // Create an array buffer from the binary string
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the array buffer
    const newBlob = new Blob([arrayBuffer], { type: "image/jpeg" });
    return newBlob;
  };

  const handleSignatureSave = () => {
    setIsFormDirty(true);
    const dataURL = signatureRef.current.toDataURL();
    const blobSignature = handleBase64InputChange(dataURL);
    const removeDataURL = removeImageDataPrefix(dataURL);

    setSignature(removeDataURL);
    setSignatureBlob(blobSignature);
  };

  const handleSignatureEnd = () => {
    handleSignatureSave();
  };

  const handleMedia = async () => {
    try {
      const formData = new FormData();
      formData.append("photo", ProfilePhotoRaw);
      formData.append("signature", signature);

      dispatch(setUserData({ profilePhoto, signature }));
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = await Axios.patch(`${API.V1.VISITOR_DETAILS}${userData.userId}/`, formData, config);
      const data = response.data;
      if (response.status === 200) {
        navigate(Browser.NIDTYPE);
      }
    } catch (error) {
      console.log("Error in submitting the details!", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-10 rounded-2xl form-shadow justify-center overflow-x-hidden h-svh">
      <div className="flex flex-col form-shadow justify-center items-center p-8 rounded-2xl max-w-screen-md gap-x-5 mx-auto w-full">
        <div>
          <img src="./images/vtrack-login" alt="" />
        </div>

        <div className="flex flex-row justify-between w-full">
          <h1 className="text-2xl font-bold mb-4">Employee Check-In</h1>
          <img src="../images/innova.png" alt="Company Logo" className="h-7 w-auto" />
        </div>

        <div className="flex object-cover items-center rounded-full h-52 w-52 overflow-hidden justify-center">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <div>
              {!showCaptureButton && (
                <img src="/images/profile-photo.png" alt="Dummy Profile" className="object-cover w-52 h-52" />
              )}
              {showCaptureButton && (
                <video ref={videoRef} className="rounded-full w-52 h-52 object-cover" autoPlay={true} />
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <>
            {showCaptureButton && (
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded form-shadow left-0 mt-2 ml-2 z-10"
                onClick={handleCapturePhoto}
              >
                Capture Photo
              </button>
            )}
            {!showCaptureButton && (
              <>
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded bottom-0 z-10 mt-2"
                  onClick={handleProfilePhotoClick}
                >
                  {!isPhotoCaptured ? "Click for Profile Photo" : "Retake Photo"}
                </button>
              </>
            )}
          </>
        </div>

        <div className="mb-8">
          <label className="block text-xl font-medium text-gray-700 mb-2">Signature</label>
          <SignatureCanvas
            ref={signatureRef}
            canvasProps={{ className: "border rounded", width: "400%", height: "160%" }}
            onEnd={handleSignatureEnd}
          />
        </div>

        {signature && (
          <div className="mb-2">
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold form-shadow py-2 px-4 rounded"
              onClick={handleSignatureClear}
            >
              Clear Signature
            </button>
          </div>
        )}

        <div className="flex w-full gap-x-5">
          <CancelButton />
          <button
            className={`bg-green-500 ${
              profilePhoto != null && signature != null ? "hover:bg-green-700 bg-green-600 cursor-pointer" : ""
            } text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center gap-1`}
            onClick={handleMedia}
            disabled={profilePhoto == null || signature == null}
          >
            Next
            <i>
              <GrLinkNext />
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageInteraction;
