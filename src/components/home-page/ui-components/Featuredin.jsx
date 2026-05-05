import GetData from '@/utility/GetData';
import Heading from '@/utility/Heading';
import Image from 'next/image';
import React from 'react'

export default  function Featuredin ({featuredIn})  {
 

  if (!featuredIn) return null;
  return (
   
      <div className="">
       <div className="main_container mx-auto mt-4 pt-5">
         <div className=" text-center">
           <div className=" flex pl-3 md:pl-0 ">
            <Heading data={featuredIn?.heading}/>
             {/* <h2 className="text-2xl xl:text-4xl pl-4 lg:pl-0 font-medium text-black  whitespace-nowrap sm:text-2">
               {featuredIn?.heading} 
             </h2> */}
           </div>
         </div>
 
         <div className="pt-4 mb-4 gap-3 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  md:gap-8 lg:gap-12 xl:gap-10 px-4 md:px-8 lg:px-0 pb-4  ">
           {featuredIn?.images?.map((item, index) => (
             <div key={index} className="">
               <div>
                 <Image
                   width={120}
                   height={100}
                   className="w-full"
                    src={GetData({ url:item?.image?.src})}
                    
                   alt={item.image?.alt}
                 />
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>
  )
}



