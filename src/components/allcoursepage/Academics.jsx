import Image from 'next/image';
const p1 = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/partners-images/p-1.webp';
const p2 = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/partners-images/p-2.webp';
const p3 = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/partners-images/p-3.webp';
const p4 = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/partners-images/p-4.webp';
const p5 = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/partners-images/p-5.webp';
const p6 = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/partners-images/p-6.webp';

const images = [
  { id: 1, img: p1, alt: "DDU-GKY partners image" },
  { id: 2, img: p2, alt: "ISO-9001 2015 Certification partners image" },
  { id: 3, img: p3, alt: "NASSCOM partners image" },
  { id: 4, img: p4, alt: "National Skill Development Corporation partners  images" },
  { id: 5, img: p5, alt: "Skill India partners image" },
  { id: 6, img: p6, alt: "MSME partners image" }
];
export default function Partners() {
  return (
    <div>
      <div className="container-fluid mx-auto">
        <div className="text-center mt-4">

        </div>
        <div className="overflow-hidden w-full pause-on-hover">
          <div className="">
            <div className=" animate-scroll-left flex lg:w-[2000px] xl:w-[3000px] w-[1000px]  gap-4 px-4 ">
              {/* Original Set of Images */}
              {images.map((obj) => (
                <span key={obj.id}>
                  <img src={obj.img} alt={obj.alt} className="mx-4  cursor-pointer" />
                </span>
              ))}
              {/* Duplicate Set for Smooth Loop */}
              {/* du */}
              {images.map((obj) => (
                <span key={obj.id}>
                  <img src={obj.img} alt={obj.alt} className="mx-4  cursor-pointer" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}