import React from "react";
import { useNavigate } from "react-router-dom";
import { Browser } from "../../constants";

function ThankYou() {
  const navigate = useNavigate();

  const handleHomeButtonClick = () => {
    navigate(Browser.HOME);
  };

  const handlePrintButtonClick = () => {
    // Implement print functionality or any other logic here
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-2 md:p-20 xl:p-8 bg-gray-100 ">
      <div className="text-center bg-white p-10 rounded-xl shadow-md flex flex-col justify-between ">
        <img src="/images/thanks-innova.png" alt="Thank You" className="w-2/4 mx-auto mb-6" />
        {/* <h1 className=" font-bold mb-4 text-4xl">Thank You!</h1> */}
        {/* <p className="text-gray-700 mb-6 text-xl font-semibold">Submission successful. Thank you!</p> */}
        <div className="flex mt-4 space-x-4 justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleHomeButtonClick}
          >
            Home
          </button>
          {/* <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePrintButtonClick}
          >
            Print
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
