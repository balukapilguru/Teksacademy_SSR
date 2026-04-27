import React from "react";

const Congratulations = ({ result, onClose }) => {
  const isDiscount = result !== "Better luck next time";

  const message = isDiscount
    ? `You've won a ${result} discount!`
    : "You are already registered on our portal. We will get back to you shortly.";

  return (
    <div
      className={`flex flex-col items-center p-6 text-center space-y-4 ${
        isDiscount ? "justify-between" : "justify-center"
      } h-full`}
    >
      {isDiscount ? (
        <>
          <h3 className="text-3xl font-bold text-white">CONGRATULATIONS!</h3>

          <p className="text-xl font-semibold text-white">{message}</p>

          <div className="text-3xl font-extrabold text-yellow-400 p-3 border-4 border-dashed border-yellow-700 rounded-lg">
            {result} OFF
          </div>

          <p className="text-xl font-semibold text-white">We will get back to you shortly</p>

          {/* Optional Close Button */}
          {/* <button
            onClick={onClose}
            className="w-full mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-150"
          >
            Close
          </button> */}
        </>
      ) : (
        <p className="text-xl font-semibold text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default Congratulations;

