import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { BiLogoFlutter } from "react-icons/bi";
import GetData from "@/utility/GetData";

async function getFooterData() {
  const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;

  const res = await fetch(`${baseUrl}/api/v1/home/footer`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch footer data");
  }

  const json = await res.json();
  return json.data.footer; // FIXED
}

export default async function Footer() {
  const footerData = await getFooterData();

  const socialIcons = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    youtube: FaYoutube,
  };

  return (
    <div>
      {/* Top curve */}
      <div className="w-full overflow-hidden">
        <div className="w-full bg-black rounded-t-[100%]"></div>
      </div>

      <footer className="relative bg-[#212121] text-white">
        <section className="footer-bg">
          <div className="main_container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[30%_70%] xl:grid-cols-[25%_75%] py-10 px-4 gap-x-4">
              {/* LEFT SIDE = LOGO + ADDRESS + SOCIAL */}
              <div className="flex flex-col items-center xl:items-start">
                {/* Logo */}
                <Image
                  src={GetData({ url: footerData.image.src })}
                  width={200}
                  height={120}
                  alt={footerData.image.alt}
                  className="w-70 mb-4"
                  unoptimized
                />

                {/* Address */}
                <div className="text-white text-center md:text-left">
                  <div className="font-medium text-md">Official Address</div>
                  <div className="font-light text-[14px] w-[280px] break-words leading-7">
                    {footerData.officialAddress.address.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))}
                  </div>
                </div>

                {/* Social */}
                <div className="font-semibold text-md text-[#c41e3a] mt-4 md:text-left">
                  {footerData.socialMedia.heading}
                </div>
                <div className="flex space-x-4 mt-2 items-center">
                  {footerData.socialMedia.links.map((social, index) => {
                    const Icon = socialIcons[social.platform];
                    return (
                      <Link
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit our ${social.platform} page`}
                        className="inline-flex"
                      >
                        <Icon
                          className="w-8 h-8 p-2 text-[#c41e3a] bg-white hover:text-white hover:bg-[#c41e3a] rounded-full"
                          aria-hidden="true"
                        />
                        <span className="sr-only">
                          {`Visit our ${social.platform} page`}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT SIDE = ALL SECTIONS */}

              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 pl-4 lg:pl-0 gap-y-6 gap-x-6">
                {footerData.sections.map((section, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-start mt-8 ${
                      index === 0 ? "xl:row-span-2" : ""
                    }`}
                  >
                    <h3 className="font-normal text-lg mb-4 text-[#c41e3a]">
                      {section.title}
                    </h3>

                    <div className="flex flex-col text-white space-y-2">
                      {section.items.map((item, i) => (
                        <Link
                          key={i}
                          href={
                            item.url && item.url.trim() !== "" ? item.url : ""
                          }
                          className="flex items-center text-[14px] tracking-wide"
                        >
                          <BiLogoFlutter className="transform scale-x-[-1] mr-2" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Bar */}
        <div className="bg-[#76777a] py-4">
          <div className="main_container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-center md:text-left">
              <div className="text-white">{footerData.bottomBar.madeWith}</div>
              <div>{footerData.bottomBar.copyright}</div>
              <div>{footerData.bottomBar.developerNote}</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
