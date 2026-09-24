"use client";

export { MobileOtpField } from "./MobileOtpField";
export default function OtpVerification(props) {
  const { MobileOtpField } = require("./MobileOtpField");
  return <MobileOtpField {...props} />;
}