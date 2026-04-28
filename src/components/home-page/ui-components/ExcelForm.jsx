'use client'
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { MobileOtpField } from "./ui-components/MobileOtpField"; 
import { toast, Toaster } from "react-hot-toast"; 
import { MobileOtpField } from "./MobileOtpField";
// import Excel from "./Excel";


const ExcelForm = () => {

    const router = useRouter();
    const [formValues, setFormValues] = useState({ name: '', email: '', number: '', message: '', source: 'Request Callback—Website' });
    const [showPopup, setShowPopup] = useState(false);
    const [formErrors, setFormErrors] = useState({});
     const [isOtpVerified, setIsOtpVerified] = useState(false);  

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormErrors((prev) => ({
            ...prev,
            [name]: ""
        }))
        if (name === "number" && value.length > 10) {
            return;
        }
        setFormValues((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formValues.name.trim()) {
            setFormErrors((prev) => ({
                ...prev,
                name: "Please Enter the Name"
            }));
            return;
        } else if (/\d/.test(formValues.name)) {  // Check if name contains numbers
            setFormErrors((prev) => ({
                ...prev,
                name: "Name should not contain numbers"
            }));
            return;
        } else if (formValues.name.trim().length <= 3) {
            setFormErrors((prev) => ({
                ...prev,
                name: "Name must be at least 3 characters long"
            }));
            return;
        }

        //        
        if (!formValues.email.trim()) {
            setFormErrors((prev) => ({
                ...prev,
                email: "Email is required"
            }))
            return;

        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            setFormErrors((prev) => ({
                ...prev,
                email: "Enter the valid emailID"
            }))
            return;
        }
        else if (!/^\d{10}$/.test(formValues.number)) {

            setFormErrors((prev) => ({
                ...prev,
                number: "Enter the valid Mobile Number"
            }))
            return;
        }
        if (!formValues.message.trim()) {
            setFormErrors((prev) => ({
                ...prev,
                message: "Please Enter the Message"
            }))
            return;
        }

        if (!isOtpVerified) {
    toast.error("Please verify OTP");
    return;
  }


        {/*API*/ }
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const { data, status } = await axios.post(`${API_URL}/lead/create`, formValues);

            if (status === 201) {
                setFormValues(
                    { name: '', email: '', number: '', message: '', source: 'Request Callback—Website' }
                )
                setTimeout(() => {
                    router.push('/thankyou');
                }, 300);
            }
        } catch (error) {
            console.error(error);
            alert("Form submitted Failed!");
        }
    };



    return (
        <>
          <Toaster
  position="top-right"
  reverseOrder={false}
  containerStyle={{
    zIndex: 999999, // ✅ this actually works
  }}
  toastOptions={{
    duration: 5000,
    style: {
      borderRadius: "8px",
      fontSize: "14px",
      padding: "10px 14px",
    },
    success: {
      style: {
        background: "#22c55e",
        color: "#fff",
      },
    },
    error: {
      style: {
        background: "#ef4444",
        color: "#fff",
      },
    },
  }}
/>
            <form onSubmit={handleSubmit} method="post" className="px-2" >
                <div className="sm:space-y-1 xl:space-y-4">
                    {/* first name */}
                    <div className="w-full relative mt-4">
                        <input
                            id="first-name"
                            type="text"
                            name="name"
                            className={`border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm  outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-300`}
                            placeholder="Enter your full name"
                            value={formValues.name}
                            onChange={handleChange}
                        />
                        {/* <label
                            htmlFor="first-name"
                            className="text-xs text-black font-medium px-1 absolute left-2.5 -top-2.5 bg-white peer-focus:text-xs peer-focus:text-blue-400 cursor-text truncate max-w-[calc(100%-18px)]"
                        >
                            First Name <span className='text-red-600 text-md'>*</span>
                        </label> */}
                        <div className="text-red-600 min-h-4 text-xs ml-3">{formErrors?.name ? formErrors?.name : null}</div>
                    </div>
                    {/* email */}
                    <div className="w-full relative mt-4">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm  outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-300"
                            placeholder="Enter your email address"
                            value={formValues.email}
                            onChange={handleChange}
                        />
                        {/* <label
                            htmlFor="email"
                            className="text-xs text-black font-medium px-1 absolute left-2.5 -top-2.5 bg-white peer-focus:text-xs peer-focus:text-blue-400 cursor-text truncate max-w-[calc(100%-18px)]"
                        >
                            Email <span className='text-red-600 text-md'>*</span>
                        </label> */}
                        <div className="text-red-600 min-h-4 text-xs ml-3">{formErrors.email != ' ' && formErrors.email}</div>
                    </div>
                    {/* phone number */}

<MobileOtpField
    value={formValues.number}
    onChange={(e) => {
        handleChange(e);
        setIsOtpVerified(false);
    }}
    onVerified={setIsOtpVerified}
    error={formErrors.number}
/>
                 


                    <div className="sm:col-span-10">
                        <textarea
                            id="message"
                            name="message"
                            rows="4"
                            className="border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-300 resize-none overflow-y-auto min-h-[6rem] max-h-[12rem]"
                            placeholder="Enter your message here..."
                            value={formValues.message}
                            onChange={handleChange}
                        ></textarea>
                        {formErrors.message && <div className="text-red-500 text-xs">{formErrors.message}</div>}
                    </div>

                </div>
                <div className='flex justify-center pt-4'>
                    <button onSubmit={handleSubmit} type="submit" className={`w-full cursor-pointer bg-[#FE543D] text-white py-3 rounded-lg shadow transition`}>
                        Request Call Back
                    </button>
                </div>
            </form>
        </>
    )
}
export default ExcelForm;
