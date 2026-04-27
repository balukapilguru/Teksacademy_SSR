"use client";
import Heading from "@/utility/Heading";
import React, { useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { TbLetterXSmall } from "react-icons/tb";

const FeeStructure = () => {
      const [openForm, setOpenForm] = useState(false);
  const [openDiscount, setOpenDiscount] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", email: "", phone: "", course: "" });
        setOpenForm(false);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form!");
    } finally {
      setLoading(false);
    }
  };

  const heading = ["Structure for", "Program Fee"]

  return (
     <>
      <div className="main_container">
        <section className="relative py-10 overflow-hidden">
          {/* Abstract bg */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30"></div>

          <div className="relative mx-auto px-6">
            {/* Title */}
            <div className="text-start mb-4">
              <Heading data={heading}/>
             
              <div className="mt-3 text-start text-gray-600 text-lg ">
                Flexible payment plans and exclusive benefits crafted to make
                education more accessible.
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Benefits Section */}
              <div className="relative rounded-2xl shadow-lg border border-gray-100 overflow-hidden p-10 bg-white flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-semibold mb-8 text-gray-800 relative z-10 text-center">
                    Why Choose Us?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                    {[
                      "Join CV Community",
                      "Placement Support",
                      "Dedicated CV Buddy",
                      "1-on-1 Mentorship",
                      "Timely LMS & Degree",
                      "Career Advisor for Life",
                    ].map((benefit, i) => (
                      <div
                        key={i}
                        className="relative flex items-start space-x-3 p-5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md transition"
                      >
                        <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl bg-gradient-to-b from-purple-500 to-pink-500"></div>
                        <MdCheckCircleOutline className="text-purple-600 w-5 h-5 flex-shrink-0 mt-1 ml-3" />
                        <span className="text-gray-700 font-medium">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fee Section with 2 Columns and Divider */}
              <div className="space-y-8">
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100 p-0 overflow-hidden">
                  <div className="grid md:grid-cols-2 relative">
                    {/* Left Side: View Discounts */}
                     <div className="bg-gradient-to-tr from-[#002b80] via-[#002b80] to-[#c41e3a] text-white p-8 flex flex-col justify-center relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="text-base opacity-90">Starting at</div>
                      <div className="text-4xl font-bold mt-1">
                        ₹6,776{" "}
                        <span className="text-lg font-normal opacity-90">
                          /month
                        </span>
                      </div>
                      <div className="mt-2 text-sm opacity-80">
                        Program Fee: ₹20,000 – ₹31,00,000
                      </div>
                      <button
                        onClick={() => setOpenForm(true)}
                        className="mt-6 w-full bg-white text-[#002b80] px-4 py-3  cursor-pointer rounded-xl font-medium hover:bg-gray-100 transition shadow"
                      >
                        Apply Now
                      </button>
                    </div>
                    

                    {/* Center Divider */}
                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px shadow-2xl bg-gray-200"></div>

                    {/* Right Side: Apply Now */}
                   <div className="p-8 flex flex-col justify-center text-center bg-white">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 whitespace-nowrap">
                      Our Benefits By Taking Test  🎁
                      </h3>
                      <div className="text-gray-600 mb-6 text-sm leading-relaxed">
                       Take our test and get a special discount on your program fees.Click below to enroll for test

                      </div>
                      <button
                        onClick={() => setOpenDiscount(true)}
                        className="w-full bg-gradient-to-r from-[#c41e3a] to-[#002b80] cursor-pointer text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition shadow"
                      >
                        View Discounts
                      </button>
                    </div>
                  </div>
                </div>

                {/* EMI Details */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-md border border-gray-100 relative">
                  <span className="absolute top-4 right-4 bg-yellow-300 text-black text-xs font-semibold px-3 py-1 rounded-lg shadow">
                    Recommended
                  </span>
                  <h4 className="text-lg font-medium text-gray-800 mb-3">
                    💳 Flexible EMI Options
                  </h4>
                  <div className="text-gray-600 mb-5 text-sm leading-relaxed">
                    Choose from one-time, semester-wise, or annual payment
                    options. Tailored to fit your needs.
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { title: "One-time", desc: "Full Payment" },
                      { title: "Semester", desc: "Split Payments" },
                      { title: "Annual", desc: "Pay Yearly" },
                    ].map((opt, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center hover:shadow-sm transition"
                      >
                        <div className="text-sm text-gray-500">{opt.title}</div>
                        <h4 className="text-base font-semibold text-gray-800 mt-1">
                          {opt.desc}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Apply Now Popup */}
      {openForm && (
        <div
          onClick={() => setOpenForm(false)}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-10 shadow-2xl w-full max-w-md relative animate-fadeIn"
          >
            <button
              onClick={() => setOpenForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              <TbLetterXSmall size={26} />
            </button>

            <div className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Apply Now
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Mobile Number"
                required
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
              />
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
              >
                <option value="">Select Course</option>
                <option value="mba">MBA</option>
                <option value="bba">BBA</option>
                <option value="pgdm">PGDM</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#002b80] to-[#c41e3a] text-white py-3 rounded-xl font-medium hover:opacity-90 hover:scale-[1.02] transition-all shadow-md cursor-pointer"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Fees & Discount Popup */}
      {openDiscount && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 md:p-8 relative flex flex-col md:flex-row">
            <button
              onClick={() => setOpenDiscount(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={24} />
            </button>

            {/* Left: Registration
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center border-r border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Register Now</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  className="w-full p-3 border rounded-lg"
                  required
                />
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  required
                >
                  <option value="">Select Course</option>
                  <option value="mba">MBA</option>
                  <option value="bba">BBA</option>
                  <option value="pgdm">PGDM</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#c41e3a] text-white rounded-lg hover:bg-[#a01a30]"
                >
                  {loading ? "Submitting..." : "Submit Registration"}
                </button>
              </form>
            </div> */}

            {/* Right: Discount Info */}
            <div className="w-full h-96 grid grid-cols-1 justify-between">
              <div className="text-xl font-semibold mb-4">Special Discounts</div>
              <div className="space-y-2">
                <div className="text-lg text-gray-500 line-through">
                  Original Fee: ₹1,20,000
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="text-base text-blue-700 font-medium">
                    After Scholarship Test Fee: <br />
                    <span className="text-xl font-bold">₹85,000 – ₹95,000</span>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="text-base text-green-700 font-medium">
                    Normal Course Fee + Specialization: <br />
                    <span className="text-xl font-bold">₹1,05,000</span>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg">
                  <div className="text-base text-yellow-700 font-medium">
                    Limited-Time Special Discount: <br />
                    <span className="text-2xl font-bold text-[#c41e3a]">
                      Save up to ₹35,000!
                    </span>
                  </div>
                </div>
              </div>
              <button className="mt-6 w-full py-2 cursor-pointer bg-[#c41e3a] text-white rounded-lg font-semibold hover:bg-[#a01a30]">
                Take Test & Claim Discount
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default FeeStructure
