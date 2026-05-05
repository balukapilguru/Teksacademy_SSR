'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Icons
import { FaLocationDot } from 'react-icons/fa6';
import { IoIosCall } from 'react-icons/io';
import { IoMdMail } from 'react-icons/io';
import { TiSocialFacebook } from 'react-icons/ti';
import { FaInstagram } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { ImYoutube } from 'react-icons/im';
import { BiLogoFlutter } from 'react-icons/bi';

// Helper to build image URL from API response
import GetData from '@/utility/GetData';

// Branch data (for the top blue bar)
const branchURL = [
  { url: 'best-software-training-institute-ameerpet', address: 'Ameerpet', contact: '+91 78159 24610', mapLink: 'https://maps.app.goo.gl/DEJPLcRep2foBWXUA' },
  { url: 'best-software-training-institute-bangalore', address: 'Bangalore', contact: '+91 70754 63275', mapLink: 'https://maps.app.goo.gl/q5cKaAwGeHhYAnci9' },
  { url: 'best-software-training-institute-dilsukhnagar', address: 'Dilsukhnagar', contact: '+91 78159 24700', mapLink: 'https://maps.app.goo.gl/Qmx1zFRAAQ8xRxq6A' },
  { url: 'best-software-training-institute-hiteccity', address: 'Hitec City', contact: '+91 78159 24622', mapLink: 'https://maps.app.goo.gl/uDTBbgm23Meb4ZYTA' },
  { url: 'best-software-training-institute-kukatpally', address: 'Kukatpally', contact: '+91 86884 08352', mapLink: 'https://maps.app.goo.gl/rqc7zPPy5uFn718AA' },
  { url: 'best-software-training-institute-mehdipatnam', address: 'Mehdipatnam', contact: '+91 98660 47567', mapLink: 'https://maps.app.goo.gl/xsxXrR3icySgjRer6' },
  { url: 'best-software-training-institute-salem', address: 'Salem', contact: '+91 97885 77788', mapLink: 'https://maps.app.goo.gl/NtBxRhe4qP3c1LRX8' },
  { url: 'best-software-training-institute-secunderabad', address: 'Secunderabad', contact: '+91 92814 66365', mapLink: 'https://maps.app.goo.gl/NHgBnjTc11wp2WUQ7' },
  { url: 'best-software-training-institute-visakhapatnam', address: 'Visakhapatnam', contact: '+91 91333 08352', mapLink: 'https://maps.app.goo.gl/KKTvLKe9hmEgBhtF8' },
];

// Map API platform names to icon components
const socialIconMap = {
  facebook: TiSocialFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: ImYoutube,
  twitter: FaXTwitter,
};

export default function Footer() {
  const pathname = usePathname();
  const lastPart = pathname.split('/').pop();

  // State for branch‑specific data (top blue bar)
  const [branchAddress, setBranchAddress] = useState('Secunderabad');
  const [branchContact, setBranchContact] = useState('1800-120-4748');
  const [branchMapLink, setBranchMapLink] = useState('https://maps.app.goo.gl/NHgBnjTc11wp2WUQ7');

  // State for dynamic footer content from API
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Update branch data when URL changes
  useEffect(() => {
    const branchData = branchURL.find((branch) => branch.url === lastPart);
    if (branchData) {
      setBranchAddress(branchData.address);
      setBranchContact(branchData.contact);
      setBranchMapLink(branchData.mapLink);
    } else {
      // Default branch
      setBranchAddress('Secunderabad');
      setBranchContact('1800-120-4748');
      setBranchMapLink('https://maps.app.goo.gl/NHgBnjTc11wp2WUQ7');
    }
  }, [lastPart]);

  // 2. Fetch footer data from backend API
  useEffect(() => {
    async function fetchFooterData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_TEKSSKILL_API_URL;
        const res = await fetch(`${baseUrl}/api/v1/home/footer`, {
          next: { revalidate: 60 }, // optional, works on server but fine here
        });
        if (!res.ok) throw new Error('Failed to fetch footer data');
        const json = await res.json();
        setFooterData(json.data.footer);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFooterData();
  }, []);

  if (loading) return null; // or a skeleton loader
  if (error) return null;    // silently fail – you can add a fallback UI

  const { image, officialAddress, socialMedia, sections, bottomBar } = footerData;

  return (
    <footer className="relative bg-black text-white">
      <div>
        {/* Top Blue Bar – dynamic branch address/phone */}
        <div className="bg-[#0E2849]">
          <div className="main_container mx-auto pt-4 lg:py-4 xl:py-5">
            <div className="w-full lg:w-11/12 xl:w-11/12 xs:p-4 lg:p-0 mx-auto">
              <div className="relative flex flex-wrap items-center lg:gap-x-6 xs:gap-x-10 sm:gap-x-16 md:gap-x-28 md:gap-y-4 lg:justify-between text-center md:text-left xs:text-left">
                <div className="mb-4 cursor-pointer md:mb-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl flex items-center">
                      <FaLocationDot className="w-5 md:h-5 2xl:mt-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-[#FE543D] mb-1">Address:</span>
                      <Link href={branchMapLink} target="_blank" rel="noopener noreferrer">
                        <span className="font-normal xs:text-[14px] lg:text-[1rem] 2xl:text-[1.2rem] 3xl:text-[1.3rem]">
                          {branchAddress}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="mb-4 md:mb-0">
                  <div className="flex cursor-pointer items-center space-x-2">
                    <span className="text-xl flex items-center">
                      <IoIosCall className="w-5 md:h-5 2xl:mt-5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-[#FE543D] mb-1">Phone:</span>
                      <span className="font-medium xs:text-[14px] lg:text-[1rem] 2xl:text-[1.2rem] 3xl:text-[1.3rem]">
                        {branchContact}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 cursor-pointer md:mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl flex items-center">
                      <IoMdMail className="w-5 md:h-5 2xl:mt-5" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[14px] text-[#FE543D]">Email:</span>
                      <span className="font-normal xs:text-[14px] lg:text-[1rem] 2xl:text-[1.2rem] 3xl:text-[1.3rem]">
                        <a href="mailto:info@teksacademy.com">support@teksacademy.com</a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Section – data from API */}
        <section className="footer-bg">
          <div className="main_container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] xl:grid-cols-[30%_70%] py-10 gap-x-4">
              {/* LEFT COLUMN – Logo + Official Address + Social */}
              <div className="flex flex-col items-center lg:justify-center xl:items-start">
                <Image
                  width={200}
                  height={120}
                  src={GetData({ url: image.src })}
                  alt={image.alt}
                  className="w-64 mb-4"
                  unoptimized
                />
                <div className="text-white text-center md:text-left">
                  <div className="font-medium text-md text-[#C4C4C4]">Official Address</div>
                  <div className="font-light text-[14px] w-[250px] break-words leading-7">
                    {officialAddress.address.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
                <div className="font-semibold text-md text-[#C4C4C4] mt-4">
                  {socialMedia.heading}
                </div>
                <div className="flex space-x-4 mt-2 items-center">
                  {socialMedia.links.map((social, idx) => {
                    const Icon = socialIconMap[social.platform];
                    if (!Icon) return null;
                    return (
                      <Link
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit our ${social.platform} page`}
                      >
                        <Icon className="w-8 h-8 p-1 text-[#FE543D] bg-slate-600 rounded-full" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT COLUMN – Dynamic sections from API */}
              <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-y-6 gap-x-4">
                {sections.map((section, idx) => (
                  <div key={idx} className="flex flex-col items-start mt-8">
                    <h3 className="font-normal text-lg mb-4">{section.title}</h3>
                    <ul className="text-white space-y-2">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center text-[14px] font-normal hover:text-[#FC6441] tracking-wide"
                        >
                          <BiLogoFlutter className="transform scale-x-[-1] mr-2 hover:text-[#FC6441]" />
                          <Link href={item.url || '#'}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Bottom – data from API */}
      <div className="bg-[#031A53] py-4">
        <div className="main_container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-sm">
            <div className="text-center md:text-left mb-2 md:mb-0">
              <span className="text-[#fff] font-normal">{bottomBar.madeWith}</span>
            </div>
            <div className="text-center mb-2 md:mb-0">{bottomBar.copyright}</div>
            <div className="text-center md:text-right mb-2 md:mb-0">
              <Link href="https://infozit.com/" target="_blank">
                <div className="">{bottomBar.developerNote}</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}