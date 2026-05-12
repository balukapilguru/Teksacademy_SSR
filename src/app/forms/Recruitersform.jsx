'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast"; 
import { BRANCH_OPTIONS } from "@/utility/branches";
import { MobileOtpField } from "@/components/home-page/ui-components/MobileOtpField";


const customPaths = {
    Branches: {
        Bangalore: "/branch/best-software-training-institute-bangalore",
        HitecCity: "/branch/best-software-training-institute-hitec-city",
        Ameerpet: "/branch/best-software-training-institute-ameerpet",
        Dilsukhnagar: "/branch/best-software-training-institute-dilsukhnagar",
        Secunderabad: "/branch/best-software-training-institute-secunderabad",
        Kukatpally: "/branch/best-software-training-institute-kukatpally",
        Mehdipatnam: "/branch/best-software-training-institute-mehdipatnam",
        visakhapatnam: "/branch/best-software-training-institute-visakhapatnam",
    },
};
const Recruitersform = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', number: '', company: '', designation: '', branch: '', course_branch: '', source: "formdata" })
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState({});
    const [isOtpVerified, setIsOtpVerified] = useState(false);  
    useEffect(() => {
        setFormData(prev => ({ ...prev, }));
    }, []);
    // name
    const handleChange = (ele) => {
        const { value, name } = ele.target;
        setError((prev) => ({
            ...prev,
            [name]: ""
        }))
        if (name === "number" && value.length > 10) {
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
    // submit
    // const formSubmit = async (event) => {
    //     event.preventDefault();
    //     //name
    //     if (!formData.name.trim()) {
    //         setError((prev) => ({
    //             ...prev,
    //             name: "Please Enter the Name"
    //         }));
    //         return;
    //     } else if (/\d/.test(formData.name)) {  // Check if name contains numbers
    //         setError((prev) => ({
    //             ...prev,
    //             name: "Name should not contain numbers"
    //         }));
    //         return;
    //     } else if (formData.name.trim().length <= 3) {
    //         setError((prev) => ({
    //             ...prev,
    //             name: "Name must be atleast 3 characters"
    //         }));
    //         return;
    //     }
    //     // email
    //     if (!formData.email.trim()) {
    //         setError((prev) => ({
    //             ...prev,
    //             email: "Enter the EmailID"
    //         }))
    //         return;
    //     }
    //     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //         setError((prev) => ({
    //             ...prev,
    //             email: "Enter the valid emailID"
    //         }))
    //         return;
    //     }
    //     //number
    //     else if (!/^\d{10}$/.test(formData.number)) {

    //         setError((prev) => ({
    //             ...prev,
    //             number: "Enter the valid Mobile Number"
    //         }))
    //         return;
    //     }
    //     // company
    //     if (!formData.company.trim()) {
    //         setError((prev) => ({
    //             ...prev,
    //             company: "Please Enter the Company"
    //         }))
    //         return;
    //     }
    //     else if (/\d/.test(formData.company)) {
    //         setError((prev) => ({
    //             ...prev,
    //             company: "Enter valid Company"
    //         }));
    //         return
    //     }
    //     if (!formData.designation.trim()) {
    //         setError((prev) => ({
    //             ...prev,
    //             designation: "Please Enter the Designation"
    //         }))
    //         return;
    //     }
    //     try {
    //         const API_URL = process.env.NEXT_PUBLIC_API_URL;
    //         const { data, status } = await axios.post(`${API_URL}/lead/create`, formData);

    //         if (status === 201) {
    //             setFormData(
    //                 { name: '', email: '', number: '', company: '', designation: '', source: "formdata" }
    //             )
    //             setTimeout(() => {
    //                 router.push('/thankyou');
    //             }, 300);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //         alert("Form submitted Failed!");

    //     }
    // }

      const formSubmit = async (e) => {
        e.preventDefault();
        const { name, email, number, company, designation, branch} = formData;


        const errorMessages = {
            name: !name.trim() ? "Please Enter the Name" : /\d/.test(name) ? "Name should not contain numbers" : name.trim().length <= 3 ? "Name must be at least 3 characters" : "",
            email: !email.trim() ? "Enter the EmailID" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter the valid emailID" : "",
            number: !/^\d{10}$/.test(number) ? "Enter the valid Mobile Number" : "",
            company: !company.trim() ? "Please Enter the Company" : /\d/.test(company) ? "Enter valid Company" : "",
            designation: !designation.trim() ? "Please Enter the Designation" : "",
            branch: !branch.trim() ? "Please Select a Branch" : "",
         
        };
        const hasError = Object.entries(errorMessages).find(([key, message]) => message !== "");
        if (hasError) {
            const [fie, message] = hasError;
            setError((prev) => ({ ...prev, [fie]: message }));
            return;
        }

        if (!isOtpVerified) {
    toast.error("Please verify OTP");
    return;
  }

        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            const { status } = await axios.post(`${API_URL}/lead/create`, {
                ...formData,
                course_branch: formData.branch
            });
            if (status === 201) {
                setFormData({ name: '', number: '', email: '', company: '', designation: '', branch: '', course_branch: '', source: 'formdata' });
                router.push('/thankyou');
            }
        } catch (error) {
            console.error(error);
            alert("Form submission failed!");
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
            <form className="px-2" onSubmit={formSubmit}>
                <div className="flex justify-start items-center font-medium text-[18px] text-[#FE543D] ">Want to Hire Talent pool ?  Contact us </div>
                <div className="space-y-4">
                    {/* first name */}
                    <div className="w-full relative mt-4">
                        <input
                            id="name"
                            type="text"
                            name="name"
                            className={`border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm focus:ring-blue-400 outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-white focus:border-transparent transition-all peer placeholder-[#6C727F]`}
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="name"
                            className="text-xs text-black font-medium px-1 absolute left-2.5 -top-2.5 bg-white peer-focus:text-xs peer-focus:text-blue-400 cursor-text truncate max-w-[calc(100%-18px)]"
                        >
                            First Name <span className='text-red-600 text-md'>*</span>
                        </label>
                        <div className="text-red-600 min-h-4 text-xs ml-3">{error.name != ' ' && error.name}</div>
                    </div>
                    {/* email */}
                    <div className="w-full relative mt-4">
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm focus:ring-blue-400 outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-white focus:border-transparent transition-all peer placeholder-[#6C727F]"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="email"
                            className="text-xs text-black font-medium px-1 absolute left-2.5 -top-2.5 bg-white peer-focus:text-xs peer-focus:text-blue-400 cursor-text truncate max-w-[calc(100%-18px)]"
                        >
                            Email <span className='text-red-600 text-md'>*</span>
                        </label>
                        <div className="text-red-600 min-h-4 text-xs ml-3">{error.email != ' ' && error.email}</div>
                    </div>
                    {/* phone number */}
                    {/* <div className="w-full relative mt-4">
                        <input
                            id="number"
                            type="tel"
                            name="number"
                            className={`border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm focus:ring-blue-400 outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-white focus:border-transparent transition-all peer placeholder-[#6C727F]`}
                            placeholder="Enter your mobile number"
                            value={formData.number}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="number"
                            className="text-xs text-black font-medium px-1 absolute left-2.5 -top-2.5 bg-white peer-focus:text-xs peer-focus:text-blue-400 cursor-text truncate max-w-[calc(100%-18px)]"
                        >
                            Mobile No <span className='text-red-600 text-md'>*</span>
                        </label>
                        <div className="text-red-600 min-h-4 text-xs ml-3">{error.number != ' ' && error.number}</div>
                    </div> */}
{/* mobile start */}
                        <MobileOtpField
                            value={formData.number}
                            onChange={(e) => {
                                handleChange(e);
                                setIsOtpVerified(false);
                            }}
                            onVerified={setIsOtpVerified}
                            error={error.number}
                        />
                        {/* mobile end */}

                    {/* company */}
                    <div className="w-full relative mt-4">
                        <input
                            id="company"
                            type="text"
                            name="company"
                            className={`border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm focus:ring-blue-400 outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-white focus:border-transparent transition-all peer placeholder-[#6C727F]`}

                            placeholder="Type company name..."
                            value={formData.company}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="company"
                            className="text-xs text-black font-medium px-1 absolute left-2.5 -top-2.5 bg-white peer-focus:text-xs peer-focus:text-blue-400 cursor-text truncate max-w-[calc(100%-18px)]"
                        >
                            Company Name <span className='text-red-600 text-md'>*</span>
                        </label>
                        <div className="text-red-600 min-h-4 text-xs ml-3">{error.company != ' ' && error.company}</div>
                    </div>
                    {/* Designation */}
                    <div className="w-full relative mt-4">
                        <input
                            id="designation"
                            type="text"
                            name="designation"
                            className={`border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm focus:ring-blue-400 outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-white focus:border-transparent transition-all peer placeholder-[#6C727F]`}
                            placeholder="Enter your job title (e.g.Product Manager..."
                            value={formData.designation}
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="designation"
                            className="text-xs text-black font-medium px-1 absolute left-2.5 -top-2.5 bg-white peer-focus:text-xs peer-focus:text-blue-400 cursor-text truncate max-w-[calc(100%-18px)]"
                        >
                            Designation <span className='text-red-600 text-md'>*</span>
                        </label>
                        <div className="text-red-600 min-h-4 text-xs ml-3">{error.designation != ' ' && error.designation}</div>
                    </div>
                    {/* branch */}
                    <div className="w-full relative">
                      <select
                        id="branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="border shadow-sm text-[#6C727F] bg-white w-full rounded-lg px-3.5 py-3 text-sm focus:ring-blue-400 outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-white focus:border-transparent transition-all peer"
                      >
                        <option value="">Select a Branch</option>
                        {BRANCH_OPTIONS.map((branch) => (
                          <option key={branch.value} value={branch.value}>
                            {branch.label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="branch" className="text-xs text-black font-medium px-1 absolute left-2.5 -top-2.5 bg-white">
                        Branch <span className="text-red-600">*</span>
                      </label>
                      <div className="text-red-600 min-h-4 text-xs ml-3">{error.branch && error.branch}</div>
                    </div>
                </div>
                <div className='flex justify-center '>
                    <button onSubmit={formSubmit} type="submit" className={`w-full cursor-pointer bg-[#FE543D] text-white py-3 rounded-xl shadow transition`}>
                        Submit
                    </button>
                </div>
            </form>
            {/* {showPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 w-[50%]  shadow-lg text-center relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-xl"
                            onClick={() => setShowPopup(false)}
                        >
                        </button>
                        <Thankyou setShowPopup={setShowPopup} />    
                    </div>
                </div>
            )} */}
        </>
    )
}
export default Recruitersform;
