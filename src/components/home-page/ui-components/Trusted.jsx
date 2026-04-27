;
import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import Image from "next/image";
;


export default async function Trusted  ({data})  {
const trusted = data

  return (
    <div className="">
      <div className="  border-[#faf3f3] rounded-2xl  py-4 md:pt-0">
        <div className="max-w-8xl mx-auto px-1 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8 pl-2 xl:pl-0 mt-5">
           <Heading data={data?.heading} />
        </div >
         <div className="overflow-hidden  w-full pause-on-hover cursor-pointer pb-6 ">
          <div className="flex ">
            <div className="animate-scroll-left flex gap-8   ">
              {trusted.images.length > 0? (
                <>
                {trusted.images.map((logo,index)=>(
                  <div key={index} className="p-4  bg-white rounded-2xl shadow-md 
                         hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-shadow duration-300 ease-in-out 
                         flex items-center justify-center min-w-[200px]" >
                    <Image
                   
                     src={GetData({ url:logo?.src})}

                    alt="trusted logos"
                    width={200}
                    height={150}
                    className="object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                     unoptimized/>
                    
                  </div>
                ))}
  {trusted.images.map((logo,index)=>(
                  <div key={index} className="p-4 bg-white rounded-2xl shadow-md 
                         hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-shadow duration-300 ease-in-out 
                         flex items-center justify-center min-w-[200px]" >
                    <Image
                   src={GetData({ url:logo?.src})}
                    alt="trusted logos"
                    width={200}
                    height={150} 
                    className="object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                    unoptimized/>

                  </div>
                ))}
                </>
              ):(
                <div>no trusted logo found</div>
              )

              }
              {/* {logos.map((logo, index) => (
                <div 
key={`duplicate-${logo.alt}-${index}`}
                  className="p-4 bg-white rounded-2xl shadow-md 
                         hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-shadow duration-300 ease-in-out 
                         flex items-center justify-center min-w-[200px]"
                >
                  <Image 
                    src={logo.src} 
                    alt={logo.alt}
                    width={170}
                    height={100}
                    className="object-contain transition-transform duration-300 ease-in-out hover:scale-110"
                  />
                </div>
              ))}
               */}
              {/* Duplicate Set for Smooth Loop */}
            
            </div>
          </div>
        </div>
        </div>
        {/* Scrolling Logos */}
       
      </div>
      
      
    </div>
  );
};


