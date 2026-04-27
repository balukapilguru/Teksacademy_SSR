import GetData from "@/utility/GetData";
import Heading from "@/utility/Heading";
import Image from "next/image";
import Link from "next/link";

export default function AboutTeks({ data }) {
  
  return (
    <section className=" bg-[#f7f8f9]  pt-5 border rounded-lg border-[#f7f8f9] mt-7">
      <div className="max-w-8xl mx-auto  px-2 lg:px-6">
        {/* Heading */}
       <Heading data={data.heading} text={data.heading}/> 

        <div className="grid md:grid-cols-2 bg- gap-10 mt-6">
          {/* LEFT — Image + Floating Logo + Service Icons */}
          <div className="relative rounded-xl overflow-hidden shadow-lg  bg-gray-100">
            {/* Background Main Image */}
            <Image
              src={GetData({ url: data.image?.src })}
              width={700}
              height={450}
              alt="About Teks"
              className="rounded-lg opacity-90"
            />
          </div>

          {/* RIGHT — Mission + Vision + Button */}
          <div>
            <h3 className="text-3xl font-semibold text-black ">
              <span className="">{data.tagline}</span>
            </h3>

            <div className="mt-6">
              <h4 className="font-bold text-blue-900">{data.mission.title}</h4>
              <p className="text-gray-700 mt-2 text-justify ">{data.mission.description}</p>
            </div>

            <div className="mt-6">
              <h4 className="font-bold text-blue-900">{data.vision.title}</h4>
              <p className="text-gray-700 mt-2 text-justify ">{data.vision.description}</p>
            </div>
<Link href={data.cta.link}>
            <button className="mt-8 bg-[#002b80] text-white px-6 py-3 rounded-full justify-content shadow-md hover:scale-105 transition-all">
              {data.cta.text}
            </button>
          </Link>
          </div>
        </div>

        {/* BOTTOM STATS BAR */}
        <div className="py-4 lg:py-6 xl:py-8 2xl:py-12">
          <div
            className="w-11/12 xl:w-4/5 2xl:w-2/3 mx-auto 
                  bg-[#002b80] rounded-full 
                  h-20 md:h-24 xl:h-28 2xl:h-32 3xl:h-36
                  flex items-center justify-around text-white"
          >
            {data.stats.map((stat) => (
              <div
                key={stat.id}
                className="flex justify-center items-center gap-x-1 lg:gap-x-2"
              >
                {/* ICON CIRCLE */}
                <div
                  className="border w-7 h-7 
                        md:w-10 md:h-10 
                        lg:w-12 lg:h-12 
                        xl:w-14 xl:h-14 
                        3xl:w-[72px] 3xl:h-[72px]
                        flex justify-center items-center rounded-full bg-white"
                >
                  <Image
                  src={GetData({ url:stat.image.src })}
                    
                    width={74}
                    height={74}
                    alt={stat.label}
                    className="w-2/3 h-2/3"
                  />
                </div>

                {/* TEXT */}
                <div
                  className="text-justify font-semibold 
                        text-[8px] 
                        md:text-[10px] 
                        lg:text-[0.85rem] 
                        xl:text-[0.9rem] 
                        2xl:text-[1rem] 
                        3xl:text-[1.34rem]"
                >
                  <div>{stat.count}</div>
                  <div className="font-normal">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

