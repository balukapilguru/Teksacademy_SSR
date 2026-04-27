import Image from "next/image";

export default function ComingSoonApp() {
  return (
    <section className="w-full h-full flex flex-col justify-center items-center bg-white text-white p-4">
      <div className="text-center">
       

        <Image
  src="https://teksversity.s3.us-east-1.amazonaws.com/website/assets/home/banner/commingsoon_blogs.webp.webp"   
  alt="Mobile App Coming Soon"
  width={800}
  height={450}
  className="rounded-lg shadow-lg"
/>


      </div>
    </section>
  );
}

