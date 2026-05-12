import React from "react";
import Image from "next/image";
const circle_80_alumni =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/circle_80_alumni.webp";
const man_using_tech =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/man_using_tech.webp";
const Rectangle_profile_card =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Rectangle_profile_card.webp";
const uil_comment =
  "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/uil_comment.webp";

const metadata = {
  title: "Teks Academy Alumni Successful Training Institute",
  description:
    "Discover where Teks Academy alumni successful training in the best software courses.",
};
const alumni = () => {
  const alumniImgaes = [
     {
      id: 255,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/battula-akshitha-full-stack-python.webp",
      name: "Akshitha Battula",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 256,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/battu-nishitha-aws-devops.webp",
      name: "Nishitha",
      course: "AWS & DevOps Certification Course",
      alt: "AWS & DevOps Certification Course",
    },
    {
      id: 1,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/sai_ganesh1.webp",
      name: "Sai Ganesh",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 206,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Deepika-kphb-FullStackPython.webp",
      name: "Deepika",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 2,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/jekkulagoutham.webp",
      name: "Jekkula Goutham",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 3,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/madhavi.webp",
      name: "Madhavi",
      course: "Data Science Certifcation Course ",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 4,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/vishwa_teja3.webp",
      name: "Vishwa Teja",
      course: "Digital Marketing Certifcation Course",
      alt: "Digital Marketing Certifcation Course",
    },
    {
      id: 5,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nakkaprashanth.webp",
      name: "Nakka Prashanth",
      course: " Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 6,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bolledulalavanya.webp",
      name: "Bolledu Lalavanya",
      course: "SAP FICO Certifcation Course ",
      alt: "SAP FICO Certifcation Course",
    },
    {
      id: 7,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bvslnavyasri.webp",
      name: "BVSL.Navyasri",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 8,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pambalaaravind.webp",
      name: "Pambala Aravind",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 9,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/saikumar.webp",
      name: "Kukkadapu Sai kumar",
      course: "Sales Force Certifcation Course",
      alt: "Sales Force Certifcation Course",
    },
    {
      id: 29,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ojjellamaheshkumar.webp",
      name: "Ojjella Mahesh Kumar",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 219,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Nagesh-Hitechcity-DataScience.webp",
      name: "Nagesh",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 10,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/elkamanisha.webp",
      name: "Elka Manisha",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    // { id: 58, imgUrl:"https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/parshasupriya.webp", name: 'Parsha Supriya', course: 'AWS & Devops Certifcation Course' },
    {
      id: 11,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mohammedabdulshahid.webp",
      name: "Mohammed Abdul Shahid",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 12,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/vinayvardhanuppari.webp",
      name: "Vinay Vardhan Uppari",
      course: "Testing Certifcation Course",
      alt: "Testing Certifcation Course",
    },
    {
      id: 13,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nampellisainishanth.webp",
      name: "Nampelli Sai Nishanth ",
      course: "Data Analytics Certifcation Course",
      alt: "Data Analytics Certifcation Course",
    },
    {
      id: 14,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/takurnithinsingh.webp",
      name: "Takur Nithin Singh",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 15,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/vallarapuvijayavenkatanaveen.webp",
      name: "Vallarapu Vijaya Venkata Naveen",
      course: " Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 220,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Naveen-Hitechcity-FullStackJava.webp",
      name: "Naveen",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 16,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/chsaisrinath.webp",
      name: "CH Sai Srinath",
      course: "Sales Force Certifcation Course",
      alt: "Sales Force Certifcation Course",
    },
    {
      id: 202,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Archana-Secunderabad-DataScience.webp",
      name: "Archana",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 17,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/archanathallapelli.webp",
      name: "Archana Thallapelli",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 18,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kodapgalpramodraj.webp",
      name: "Kodapgal Pramod Raj",
      course: "Data Science Certifcation Course ",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 19,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bantukumasaswamyrishitha.webp",
      name: "Bantu kumasaswamy Rishitha",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 20,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/karumanchianusha.webp",
      name: "Karumanchi Anusha",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 21,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/m_abdullah4.webp",
      name: "M.Abdullah",
      course: "AutoCAD & BIM Certifcation Course",
      alt: "AutoCAD & BIM Certifcation Course",
    },
    {
      id: 22,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/myakalasaisudhir.webp",
      name: "Myakala Sai Sudhir",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 23,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/veekshith5.webp",
      name: "Veekshith",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 24,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ramireddynandini.webp",
      name: "Ramireddy Nandini",
      course: "Data Science Certifcation Course ",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 25,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mallapamllitejababu.webp",
      name: "Mallampalli Teja Babu",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 26,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/katlasaipriya.webp",
      name: "Katla Saipriya",
      course: "Full Stack Python Certifcation Course ",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 27,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/oanup.webp",
      name: "O.Anup",
      course: "Data Science Certifcation Course ",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 28,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/praveenvenkatpattapagalu.webp",
      name: "Praveen Venkat pattapagalu",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 30,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/givyaponthagandi.webp",
      name: "Givya Ponthagandi",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 31,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/durgamsaivivek.webp",
      name: "Durgam Sai Vivek",
      course: "Data Science Certifcation Course ",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 32,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/godajayachandrareddy.webp",
      name: "Goda Jaya Chandra Reddy",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 33,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gudalachandini.webp",
      name: "Gudala Chandini",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 34,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/devulapallirajkumar.webp",
      name: "Devulapalli Raj Kumar ",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 35,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/chinnadandlurusaleem.webp",
      name: "Chinnadandluru Saleem",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 36,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/koppelavaishnavi.webp",
      name: "Koppela Vaishnavi",
      course: " Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 37,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gollavijaykumar.webp",
      name: "Golla Vijay Kumar",
      course: "SAP FICO Certifcation Course ",
      alt: "SAP FICO Certifcation Course",
    },
    {
      id: 38,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/dchandravadan.webp",
      name: "D.Chandravadan",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 39,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/numavathjyothi.webp",
      name: "Numavath Jyothi",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 40,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/domalasupriya.webp",
      name: "Domala Supriya",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 41,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/endravathswapna.webp",
      name: "Endravath Swapna",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 42,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/shaikparvezpasha.webp",
      name: "Shaik Parvez Pasha",
      course: "Testing Certifcation Course",
      alt: "Testing Certifcation Course",
    },
    {
      id: 43,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/undruharshavardhan.webp",
      name: "Undru Harsha Vardhan",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 44,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bshirisha.webp",
      name: "B.Shirisha ",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 45,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/devagudisivateja.webp",
      name: "Devagudi Siva Teja",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 46,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/goginenichetanvenkatakrishna.webp",
      name: "Gogineni Chetan Venkatakrishna",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 47,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bovillareddiahreddy.webp",
      name: "Bovilla Reddiah Reddy",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 48,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/parshasupriya.webp",
      name: "Parsha Supriya",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 227,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/SaiAkhilYadav-dilshuknagar-DigitalMarketing.webp",
      name: "Sai Akhil Yadav",
      course: "Digital Marketing Certification Course",
      alt: "Digital Marketing Certification Course",
    },
    {
      id: 49,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/madisettypremkumar.webp",
      name: "Madisetty Premkumar",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 50,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/lambakavya.webp",
      name: "Lamba Kavya",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 51,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/rohithramagiri.webp",
      name: "Rohith Ramagiri",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 52,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/boddumadhavi.webp",
      name: "Boddu Madhavi",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 53,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/sharath_chandra2.webp",
      name: "Sharath Chandra",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 54,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pinnamrajuteajasivasurendravarma.webp",
      name: "Pinnam Raju Teja Siva Surendra Varma ",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 55,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/vemulasoumya.webp",
      name: "Vemula Soumya",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 56,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/anilsaitelagarapu.webp",
      name: "Anil Saitelagarapu",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 57,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/yallamanasa.webp",
      name: "Yalla Manasa",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 58,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/yalabakachandana.webp",
      name: "Yalabaka Chandana",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 59,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/erugadhindlasriramulu.webp",
      name: "Erugadhindla Sri Ramulu",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 60,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/thantepudivasanth.webp",
      name: "Thantepudi Vasanth",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 61,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kandularohith.webp",
      name: "Kandula Rohith",
      course: "BIM Certifcation Course",
      alt: "BIM Certifcation Course",
    },
    {
      id: 62,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/anilkumar.webp",
      name: "Anil kumar",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 63,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/zaidahmedkhan.webp",
      name: "Zaid Ahmed Khan",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 215,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Maneesha-Secunderabad-DataScience.webp",
      name: "Maneesha",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 64,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/medhinidhori.webp",
      name: "Medhini Dhori ",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 65,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mohammadhaneefuddin.webp",
      name: "Mohammad Haneef Uddin",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 205,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Deekshith-dilshuknagar-FullStackPython.webp",
      name: "Deekshith",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 66,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gtharunkumar.webp",
      name: "G.Tharun Kumar",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 67,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/modinivinaykumar.webp",
      name: "Modini Vinay Kumar",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 68,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/srinivasraokota.webp",
      name: "Srinivas Rao Kota",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 69,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/brsanjaysingh.webp",
      name: "B.R Sanjay Singh",
      course: "Digital Marketing Certifcation Course",
      alt: "Digital Marketing Certifcation Course",
    },
    {
      id: 70,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kommidinandini.webp",
      name: "Kommidi Nandini",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 71,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pulluriharshithkumar.webp",
      name: "Pulluri Harshith Kumar",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 72,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/addagallamahendranagavenkat.webp",
      name: "Addagalla Mahendra Naga Venkat",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 73,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/thallurimanjula.webp",
      name: "Thalluri Manjula",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 74,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pavulurinarmada.webp",
      name: "Pavuluri Narmada ",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 75,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/dhaduchandu.webp",
      name: "Dhadu Chandu",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 76,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kuntikarunakar.webp",
      name: "Kunti Karunakar",
      course: "SAP FICO Certifcation Course",
      alt: "SAP FICO Certifcation Course",
    },
    {
      id: 77,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gonanhavikomalsrivedh.webp",
      name: "Gonanhavi Komal Srivedh",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 78,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/valleboinasasipriya.webp",
      name: "Valleboinasasi Priya",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 79,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bantrothusivaprasad.webp",
      name: "Bantrothu Siva Prasad",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 80,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/annaadasulabhuvanachandra.webp",
      name: "Annaada Sulabhuvana Chandra",
      course: "AutoCAD & BIM Certifcation Course",
      alt: "AutoCAD & BIM Certifcation Course",
    },
    {
      id: 81,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mharshavardhan.webp",
      name: "M.Harshavardhan",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 82,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/varireddyvenkatakirankumarkeddy.webp",
      name: "Varireddy Venkata Kiran Kumar Reddy",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 83,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/tiruveedulasrilavanya.webp",
      name: "Tiruveedula Sri Lavanya",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 84,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/indravathnandini.webp",
      name: "Indravath Nandini ",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 85,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/vadegharriya.webp",
      name: "Vadeghar Riya",
      course: "Data Analytics Certifcation Course",
      alt: "Data Analytics Certifcation Course",
    },
    {
      id: 86,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/rekulapallysrikanthreddy.webp",
      name: "Rekulapally Srikanth Reddy",
      course: "SAP FICO Certifcation Course",
      alt: "SAP FICO Certifcation Course",
    },
    {
      id: 87,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kunaramalakshmi.webp",
      name: "Kunarama Lakshmi",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 89,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/rathapuramraju.webp",
      name: "Rathapuram Raju",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 90,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/konkayalasrilakshmi.webp",
      name: "Konkayalasri Lakshmi",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 91,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/soumysragaiahgari.webp",
      name: "Soumya Sagaiahgari",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 92,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bulususriamarnath.webp",
      name: "Bulusu Sri Amarnath",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 93,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nethalasharathchandra.webp",
      name: "Nethala Sharath Chandra",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 94,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/shaikmohammadjani.webp",
      name: "Shaik Mohammad Jani ",
      course: "Data Analytics Certifcation Course",
      alt: "Data Analytics Certifcation Course",
    },
    {
      id: 95,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mohammedkhajaabdulbari.webp",
      name: "Mohamme Khaja Abdul Bari",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 228,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Sindhuja-hitechcity-AWS.webp",
      name: "Sindhuja",
      course: "AWS Certification Course",
      alt: "AWS Certification Course",
    },

    {
      id: 96,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gundapanenisrihari.webp",
      name: "Gundapaneni Srihari",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 97,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kandregulasowmyasree.webp",
      name: "Kandregula Sowmyasree",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 98,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ajitjena.webp",
      name: "Ajit Jena",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 99,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ulavapatikrishnavamsi.webp",
      name: "Ulavapati krishna Vamsi ",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 100,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nallamalasanthosh.webp",
      name: "Nallamala Santhosh ",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 101,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/usasudarshan.webp",
      name: "U.Sasudarshan",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 102,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/dusnamonineeraja.webp",
      name: "Dusnamoni Neeraja",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 103,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mohammadsadullahfahed.webp",
      name: "Mohammad Sadullahfahed",
      course: "BIM Certifcation Course",
      alt: "BIM Certifcation Course",
    },
    {
      id: 104,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bharathbandarupally.webp",
      name: "Bharath Bandarupally ",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 105,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/samalasheshipalreddy.webp",
      name: "Samala Sheshipalreddy",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 106,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/saikirankanugula.webp",
      name: "Sai Kirankanugula",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 107,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/harishbabuthinnavalli.webp",
      name: "Harish Babu Thinnavalli",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 108,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/madhurikukkala.webp",
      name: "Madhuri Kukkala",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 109,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/akitikaveri.webp",
      name: "Akiti Kaveri ",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 110,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mekakaveri.webp",
      name: "Meka Kaveri",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 111,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mounikatodheti.webp",
      name: "Mounika Todheti",
      course: "Sales Force Certifcation Course",
      alt: "Sales Force Certifcation Course",
    },
    {
      id: 112,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mpranaykumaryadav.webp",
      name: "M Pranaykumar Yadav",
      course: "SAP FICO Certifcation Course",
      alt: "SAP FICO Certifcation Course",
    },
    {
      id: 113,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gsaikanishk.webp",
      name: "G Sai Kanishk",
      course: "Revit Mep Certifcation Course",
      alt: "Revit Mep Certifcation Course",
    },
    {
      id: 114,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/daraveninikshitha.webp",
      name: "Daraveni Nikshitha ",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 115,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kanudlasuhasini.webp",
      name: "Kanudla Suhasini",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 116,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/koremdeepak.webp",
      name: "Korem Deepak",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 117,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mjohnmanohar.webp",
      name: "M John Manohar",
      course: "Data Analytics Certifcation Course",
      alt: "Data Analytics Certifcation Course",
    },
    {
      id: 225,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/RaviShankar-Ammerpet-DataAnalytics.webp",
      name: "Ravi Shankar",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 118,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/boddusreelatha.webp",
      name: "Boddu Sree Latha",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 119,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/marrikoushikreddy1.webp",
      name: "Marri Koushik Reddy",
      course: "Full Stack Python Certifcation Course ",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 120,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gaddamiddisrinivas.webp",
      name: "Gaddamiddi Srinivas",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 121,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pillisrija.webp",
      name: "Pilli Srija",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 122,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mandadiganesh.webp",
      name: "Mandadi Ganesh",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 123,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/chomprakash.webp",
      name: "CH.OM.Prakash ",
      course: "Digital Marketing Certifcation Course",
      alt: "Digital Marketing Certifcation Course",
    },
    {
      id: 124,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mirmominali.webp",
      name: "Mir Momin Ali",
      course: "Digital Marketing Certifcation Course",
      alt: "Digital Marketing Certifcation Course",
    },
    {
      id: 125,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/dhanavathjeevan.webp",
      name: "Dhanavath Jeevan",
      course: "AutoCAD & Revit Certifcation Course",
      alt: "AutoCAD & Revit Certifcation Course",
    },
    {
      id: 126,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/palleysaidivya.webp",
      name: " Palley Sai Divya",
      course: "SAP FICO Certifcation Course",
      alt: "SAP FICO Certifcation Course",
    },
    {
      id: 127,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nanduriveeravenkatasatyasaisiva.webp",
      name: "Nanduri Veera Venkata Satya Sai Siva",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 128,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kuppamanikanta.webp",
      name: "kuppamanikanta",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 129,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nakkaramachandrarao.webp",
      name: "Nakka Rama  Chandrarao ",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 130,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mdsohailkhan.webp",
      name: "Md Sohail Khan",
      course: "BIM Certifcation Course & AutoCAD",
      alt: "BIM Certifcation Course & AutoCAD",
    },
    {
      id: 131,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/supravabiswal.webp",
      name: "Suprava Biswal",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 132,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/sivaramakrishnamamillapalli.webp",
      name: "Siva Rama Krishna Mamillapalli",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },

    {
      id: 133,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mdibrahimahmedkhan.webp",
      name: "Md Ibrahim Ahmedkhan",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 134,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ysandeep.webp",
      name: "Y.Sandeep",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 135,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/madhurikukkala.webp",
      name: "Madhuri Kukkala",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 136,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/chamalavenkatkarthik.webp",
      name: "Chamala Venkat Karthik",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 137,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gudalachandini.webp",
      name: "Patnala Lakshmipriya Bhanushree",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 138,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bhadrachalamsaikumar.webp",
      name: "Bhadrachalam Saikumar",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 139,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/rajakagangadhar.webp",
      name: "Rajaka Gangadhar",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 140,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bodhatisivarambabu.webp",
      name: "Bodhati Siva Rambabu",
      course: "Digital Marketing Certifcation Course",
      alt: "Digital Marketing Certifcation Course",
    },
    {
      id: 141,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/sayyadrehamtunniesa.webp",
      name: "Sayyad Rehamtunniesa",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 142,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/karemgarvaibhav.webp",
      name: "Karemgar  Vaibhav",
      course: "AWS & Devops Certifcation Course",
      alt: "AWS & Devops Certifcation Course",
    },
    {
      id: 143,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/tummakrishnanandini.webp",
      name: "Tumma Krishna Nandini",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 144,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/munikuntlasowmya.webp",
      name: "Munikuntla Sowmya",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 229,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/SivaKumar-dilshuknagar-DataScience.webp",
      name: "Siva Kumar",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 145,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/shaikasifakousar.webp",
      name: "Shaik Asifa Kousar",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 146,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bokkisamkoteswararao.webp",
      name: "Bokki Samkoteswara Rao",
      course: "Digital Marketing Certifcation Course",
      alt: "Digital Marketing Certifcation Course",
    },
    {
      id: 147,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/sanketkesaria.webp",
      name: "Sanket Kesaria",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 148,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mallepraveenkumarreddy.webp",
      name: "Malle Praveen Kumar Reddy",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 149,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mothkupallyjyothsna.webp",
      name: "Mothkupally Jyothsna",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 150,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gaddamkeerthi.webp",
      name: "Gaddam Keerthi",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 151,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/boomajessika.webp",
      name: "Booma Jessika",
      course: "Data Analytics Certifcation Course",
      alt: "Data Analytics Certifcation Course",
    },
    {
      id: 152,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/doddaswathivijayalakshmi.webp",
      name: "Dodda Swathi Vijayalakshmi",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 153,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kethanisaivamshi.webp",
      name: "Kethani Sai Vamshi",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 154,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/manchariarohithreddy.webp",
      name: "Mancharia Rohith Reddy",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 155,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gayathritlvarao.webp",
      name: "Gayathri TL Varao ",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 156,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kopparthivenkatasubbareddy.webp",
      name: "Kopparthi Venkata Subba Reddy",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 157,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gchandankumar.webp",
      name: "G.Chandankumar",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 188,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/singaramrachana.webp",
      name: "Singaram Rachana",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 158,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/trajesh.webp",
      name: "T.Rajesh",
      course: "AutoCAD & Revit Certifcation Course Mep Certifcation Course",
      alt: "AutoCAD & Revit Certifcation Course",
    },
    {
      id: 211,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/AbdulAziz-hitechcity-DataScience.webp",
      name: "Abdul Aziz",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 232,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/TejaSri-Ameerpet-FullStackJava.webp",
      name: "Teja Sri",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 159,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kulalamumaswamytejeshsai.webp",
      name: "kulalamumaswamytejeshsai",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 160,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/seelampuja.webp",
      name: "Seelam Puja",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 161,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/dasarisanjay.webp",
      name: "Dasari Sanjay",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 162,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/syedadilmuqtar.webp",
      name: "Syed Adil Muqtar",
      course: "Digital Marketing Certifcation Course",
      alt: "Digital Marketing Certifcation Course",
    },
    {
      id: 163,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kuntumallakrishnasai.webp",
      name: "Kuntumalla KrishnaSai",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 164,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/yervasharathchandra.webp",
      name: "Yerva Sharath Chandra",
      course: "Python Backend Certifcation Course",
      alt: "Python Backend Certifcation Course",
    },
    {
      id: 165,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pulilahari.webp",
      name: "Puli Lahari",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 166,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/annarapuakshay.webp",
      name: "Annarapu Akshay",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 167,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/lohianavjyothsingh.webp",
      name: "Lohia Navjyoth Singh",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 208,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Ganesh-dilshuknagar-DataScience.webp",
      name: "Ganesh",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 168,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/maruvadajaideep.webp",
      name: "Maruvada Jaideep",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 169,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nibbaragandlachandrasekharreddy.webp",
      name: "Nibbaragandla Chandra Sekhar Reddy",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 170,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kvamsikrishna.webp",
      name: "K Vamsi Krishna",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 171,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kallarekha.webp",
      name: "Kalla Rekha",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 172,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/karraakash.webp",
      name: "Karra Akash",
      course: "Sales Force Certifcation Course",
      alt: "Sales Force Certifcation Course",
    },
    {
      id: 173,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/korravinaykumar.webp",
      name: "Korra Vinay Kumar",
      course: "Digital Marketing Certifcation Course",
      alt: "Digital Marketing Certifcation Course",
    },
    {
      id: 174,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/syedaiyjazshoaibmohd.webp",
      name: "Syed Aiyjaz Shoaib Mohd",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },
    {
      id: 175,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pasamjagadeesh.webp",
      name: "Pasam Jagadeesh",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 176,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kancharladannykumar.webp",
      name: "Kancharla Danny Kumar",
      course: "AutoCAD+BIM Certifcation Course",
      alt: "AutoCAD+BIM Certifcation Course",
    },
    {
      id: 177,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nallalatharuni.webp",
      name: "Nallala Tharuni",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    // { id: 189, imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nallalatharuni.webp", name: 'Nallala Tharuni', course: 'Full Stack Python Certifcation Course',alt:"Full Stack Python Certifcation Course" },
    {
      id: 178,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kommojuchaitanyasrisai.webp",
      name: "Kommoju Chaitanya Sri Sai",
      course: "AutoCAD & 3ds MAX Certifcation Course",
      alt: "AutoCAD & 3ds MAX Certifcation Course",
    },
    {
      id: 179,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pvinaykumar.webp",
      name: "P.Vinaykumar",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 180,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gaddalasuvarnaraju.webp",
      name: "Gaddala Suvarna Raju",
      course: "VLSI Certifcation Course",
      alt: "VLSI Certifcation Course",
    },
    {
      id: 238,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Vyshnavi-hitechcity-AWS.webp",
      name: "Vyshnavi",
      course: "AWS Certification Course",
      alt: "AWS Certification Course",
    },
    {
      id: 181,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/yanamoniabhiram.webp",
      name: "Yanamoni Abhiram",
      course: "C+Python Certifcation Course",
      alt: "C+Python Certifcation Course",
    },
    {
      id: 182,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/karavindkumar.webp",
      name: "K.Aravind Kumar",
      course: "AutoCAD+BIM Certifcation Course",
      alt: "AutoCAD+BIM Certifcation Course",
    },
    {
      id: 183,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nikithamusham.webp",
      name: "Nikitha Musham",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 184,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/jonnalagaddapranvitha.webp",
      name: "Jonnalagadda Pranvitha",
      course: "Data Analytics Certifcation Course",
      alt: "Data Analytics Certifcation Course",
    },
    {
      id: 185,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/jinkalasaiteja.webp",
      name: "Jinkala Saiteja",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 186,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/dagilladheeraj.webp",
      name: "Dagilla Dheeraj",
      course: "Advanced Excel+PGDCA Certifcation Course",
      alt: "Advanced Excel+PGDCA Certifcation Course",
    },
    {
      id: 187,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bhargavinellivalasa.webp",
      name: "Bhargavi Nellivalasa",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    // { id: 189, imgUrl: mopurmeghavarshini, name: 'Mopurmegha Varshini', course: 'Full Stack Java Certifcation Course' },
    {
      id: 190,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kethanisaivamshi.webp",
      name: "Kethani Sai Vamshi",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 191,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/uppalavenkatanarasimharao.webp",
      name: "Uppala Venkata Narasimha Rao",
      course: "VLSI Certifcation Course",
      alt: "VLSI Certifcation Course",
    },
    {
      id: 192,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/settisaikumar.webp",
      name: "Setti Saikumar",
      course: "Sales Force Certifcation Course",
      alt: "Sales Force Certifcation Course",
    },
    {
      id: 193,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/althichandan.webp",
      name: "Althi Chandan",
      course: "AutoCAD+BIM Certifcation Course",
      alt: "AutoCAD+BIM Certifcation Course",
    },
    {
      id: 194,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/munigelwardivya.webp",
      name: "Munigelwar Divya",
      course: "AutoCAD+BIM Certifcation Course",
      alt: "AutoCAD+BIM Certifcation Course",
    },

    {
      id: 195,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/abrameniarchana.webp",
      name: "Abrameni Archana",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 197,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ravutlaravalika.webp",
      name: "Ravutla Ravalika",
      course: "VLSI Certifcation Course",
      alt: "VLSI Certifcation Course",
    },
    {
      id: 198,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/rayudukalpanasree.webp",
      name: "Rayudu Kalpana Sree",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 199,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mopurmeghavarshini.webp",
      name: "Mopur Megha Varshini",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 200,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/rrishithareddy.webp",
      name: "R.Rishitha Reddy",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },

    // New Images to be added here

    {
      id: 201,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Anusha-Secunderabad-DataScience.webp",
      name: "Anusha",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },

    {
      id: 203,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ArunKumar-Ammerpet-FullStackPython.webp",
      name: "Arun Kumar",
      course: "Full Stack Python Certifcation Course",
      alt: "Full Stack Python Certifcation Course",
    },
    {
      id: 204,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Basser-hitechcity-DataScience.webp",
      name: "Basser",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },

    {
      id: 207,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/DineshKumar-dilshuknagar-DataScience.webp",
      name: "Dinesh Kumar",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },

    {
      id: 209,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/HariSai-Ammerpet-bim-sketchup-autocard-3dsmax.webp",
      name: "Hari Sai",
      course: "BIM, SketchUp, AutoCAD & 3ds Max Course",
      alt: "BIM, SketchUp, AutoCAD & 3ds Max Course",
    },
    {
      id: 210,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/HemaLatha-Secunderabad-DataScience.webp",
      name: "Hema Latha",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },

    {
      id: 212,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/AkhilSaiPatel-kukatpally-data-science.webp",
      name: "Akhil Sai Patel",
      course: "Data Science Certifcation Course",
      alt: "Data Science Certifcation Course",
    },

    {
      id: 213,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Krithika-dilshuknagar-FullStackPython.webp",
      name: "Krithika",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 214,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/LalitMohan-Ammerpet-DataScience.webp",
      name: "Lalit Mohan",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },

    {
      id: 216,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/MohammedGhouse-Mehadhipatnam-PGDCA.webp",
      name: "Mohammed Ghouse",
      course: "PGDCA Certification Course",
      alt: "PGDCA Certification Course",
    },
    {
      id: 217,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/MohammedKhaleel-hitechcity-DataScience.webp",
      name: "Mohammed Khaleel",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 218,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/MohdAbdulahMusharraf-Ammerpet-bim-staadpro-eTabs.webp",
      name: "Mohd Abdulah Musharraf",
      course: "BIM, STAAD Pro & ETABS Certification Course",
      alt: "BIM, STAAD Pro & ETABS Certification Course",
    },

    {
      id: 221,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Prabhakar-Ammerpet-DataScience.webp",
      name: "Prabhakar",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 222,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Prasanna-Secunderabad-DataScience.webp",
      name: "Prasanna",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 223,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/RamaKrishna-Ammerpet-FullStackJava.webp",
      name: "Rama Krishna",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 224,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Ravi-Ammerpet-DataScience.webp",
      name: "Ravi",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },

    // {
    //   id: 226,
    //   imgUrl:
    //     "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Sai-Ammerpet-bim-sketchup-autocard-3dsmax.webp",
    //   name: "Sai",
    //   course: "BIM, SketchUp, AutoCAD & 3ds Max Course",
    //   alt: "BIM, SketchUp, AutoCAD & 3ds Max Course",
    // },

    {
      id: 230,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/SobiyaBegum-Secunderabad-DataScience.webp",
      name: "Sobiya Begum",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 231,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Sumanth-dilshuknagar-AWS.webp",
      name: "Sumanth",
      course: "AWS Certification Course",
      alt: "AWS Certification Course",
    },

    {
      id: 233,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Tejasri-kphb-FullStackPthyon.webp",
      name: "Tejasri",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 234,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Vaishnavi-Secunderabad-DataAnalytics.webp",
      name: "Vaishnavi",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 235,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Vaishnavi-Secunderabad-DataScience.webp",
      name: "Vaishnavi",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 236,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/VasanthReddy-kphb-DataAnalytics.webp",
      name: "Vasanth Reddy",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 237,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Vignesh-Ammerpet-FullStackJava.webp",
      name: "Vignesh",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },

    {
      id: 239,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/YagnaSai-Secunderabad-BIM.webp",
      name: "Yagna Sai",
      course: "BIM Certification Course",
      alt: "BIM Certification Course",
    },
    {
      id: 240,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/a_achuth_reddy_fullstack_java.webp",
      name: "Achuth Reddy",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 241,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/a_anvesh_autocad_revit.webp",
      name: "Anvesh",
      course: "Auto Cad Certification Course",
      alt: "Auto Cad Certification Course",
    },
    {
      id: 242,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/A_shravya_DATA_SCIENCE.webp",
      name: "Shravya",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 243,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/A_srinu_nayak_autocad_mining.webp",
      name: "Srinu Nayak",
      course: "Auto Cad Mining Certification Course",
      alt: "Auto Cad Mining Certification Course",
    },
    {
      id: 244,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/akhil-datascience.webp",
      name: "Akhil",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 245,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/amaravarapu-kamalakar-digitalmarketing.webp",
      name: "Amaravarapu Kamalakar",
      course: "Digital Marketing Certification Course",
      alt: "Digital Marketing Certification Course",
    },
    {
      id: 246,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ankathi-pavankumar-fullstackpython.webp",
      name: "Ankathi Pavan Kumar",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 247,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/anukiruddipalle_nagajyothi_SALESFORCE.webp",
      name: "Naga Jyothi",
      course: "Sales Force Certification Course",
      alt: "Sales Force Certification Course",
    },
    {
      id: 248,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/attineni-ranjithkumar-java.webp",
      name: "Ranjith Kumar",
      course: "Java Certification Course",
      alt: "Java Certification Course",
    },
    {
      id: 249,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/avinash-digital-marketing.webp",
      name: "Avinash",
      course: "Digital Marketing Certification Course",
      alt: "Digital Marketing Certification Course",
    },
    {
      id: 250,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/avirneni-deekshitha-fullstackjava.webp",
      name: "Deekshitha",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 251,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/avula_mahalakshmi_SALESFOCES.webp",
      name: "Maha Lakshmi",
      course: "Sales Force Certification Course",
      alt: "Sales Force Certification Course",
    },
    {
      id: 252,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/B_saisujitreddy_C_C.webp",
      name: "Sai Sujith",
      course: "C & C++ Certification Course",
      alt: "C & C++ Certification Course",
    },
    {
      id: 253,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bandla_vidyasree_fullstackpython.webp",
      name: "Vidya Sree",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 254,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/banothu-kishor-fullstackpython.webp",
      name: "Kishore",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
   
    {
      id: 257,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Beerelli_bharath_chandra_fullstackjava.webp",
      name: "Bharath Chandra",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 258,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/bolka-prathyush-fullstackjava.webp",
      name: "Prathyusha",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 259,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/boya-jayaprakash-fullstackjava.webp",
      name: "Jaya Prakash",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 260,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/b-rohitkumar-aws-devops.webp",
      name: "Rohit Kumar",
      course: "AWS & DevOps Certification Course",
      alt: "AWS & DevOps Certification Course",
    },
    {
      id: 261,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Bushipaka_Swaranalatha_Fullstackjava.webp",
      name: "Swarana Latha",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 262,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ch_nandini_autocad_bim.webp",
      name: "Nandini",
      course: "AutoCAD & Bim Certification Course",
      alt: "AutoCAD & Bim Certification Course",
    },
    {
      id: 263,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/chaitanya-digital-marketing.webp",
      name: "Chaitanya",
      course: "Digital Marketing Certification Course",
      alt: "Digital Marketing Certification Course",
    },
    {
      id: 264,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Chinnari_kalyanam_fullstackjava.webp",
      name: "Chinnari",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 265,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/chitra-data-analytics.webp",
      name: "Chitra",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 266,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/chiviki-bharath-chandra-dataanalylics.webp",
      name: "Bharath",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 267,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ch-venkatasrinivasu-aws-devops.webp",
      name: "Venkata Srinivasu",
      course: "AWS & Devops Certification course",
      alt: "AWS & Devops Certification course",
    },
    {
      id: 268,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/deenamkonda-tejasri-aws-devops.webp",
      name: "Teja Sri",
      course: "AWS & Devops Certification course",
      alt: "AWS & Devops Certification course",
    },
    {
      id: 269,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/deenomkonda-durgabhavani-aws-devops.webp",
      name: "Durga Bhavani",
      course: "AWS & Devops Certification course",
      alt: "AWS & Devops Certification course",
    },
    {
      id: 270,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/devireddy-saikrishnaakhil-aws-devop.webp",
      name: "Sai Krishna Akhil",
      course: "AWS & Devops Certification course",
      alt: "AWS & Devops Certification course",
    },
    {
      id: 271,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/dhage_pavan_fullstack_development_java.webp",
      name: "Pavan",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 272,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/digivijay-saiphanigokul-aws-devop.webp",
      name: "Sai Phani Gokul",
      course: "AWS & Devops Certification course",
      alt: "AWS & Devops Certification course",
    },
    {
      id: 273,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Donthiboyina_Likhitha_fullstackjava.webp",
      name: "Likitha",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 274,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/d-veerabau-aws-devops.webp",
      name: "Verra Babu",
      course: "AWS & Devops Certification course",
      alt: "AWS & Devops Certification course",
    },
    {
      id: 275,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/G_Revanth_JDSMAX_WITH_VRAY.webp",
      name: "Revanth",
      course: "3d's max Certification Course",
      alt: "3d's max Certification Course",
    },
    {
      id: 276,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gaddiparthi_amulya_fullstackpython.webp",
      name: "Amulya",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 277,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gandhamsrinidhi_VLSI.webp",
      name: "Srinidhi",
      course: "Vlsi Certification Course",
      alt: "Vlsi Certification Course",
    },
    {
      id: 278,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gowti-ramadevi-fullstackpython.webp",
      name: "Rama Devi",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 279,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Guddi_Rahul_BIM.webp",
      name: "Rahul",
      course: "BIM Certification Course",
      alt: "BIM Certification Course",
    },

    {
      id: 410,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Apathi-Vishnu-Vardhan-Full-Stack-Java.webp",
      name: "Vishnu Vardhan",
      course: "Full Stack Java Certifcation Course",
      alt: " Full Stack Java Certifcation Course",
    },
    {
      id: 411,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/avirneni-deekshitha-fullstackjava.webp",
      name: "Deekshitha",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 412,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/A-Yuva-Sai-Raj-Sap-Fico.webp",
      name: "Yuva Sai Raj",
      course: " Sap Fico Certifcation Course",
      alt: " Sap Fico Certifcation Course",
    },
    {
      id: 413,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Bapanapalli-Nagaveni-Aws-Devops.webp",
      name: "Nagaveni",
      course: "AWS & Devops Certifcation Course",
      alt: " AWS & Devops Certifcation Course",
    },
    {
      id: 414,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Bathoju-Varun-Kumar-Full-Stack-Java.webp",
      name: "Varun Kumar",
      course: " Full Stack Java Certifcation Course",
      alt: " Full Stack Java Certifcation Course",
    },
    {
      id: 415,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Boya-Manoj-Kumar-Full-Stack-Java.webp",
      name: "Manoj Kumar",
      course: " Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },
    {
      id: 416,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Bujagani-Lavanya-Full-Stack-Python.webp",
      name: "Lavanya",
      course: " Full Stack Python Certifcation Course",
      alt: " Full Stack Python Certifcation Course",
    },
    {
      id: 417,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/chiviki-bharath-chandra-dataanalylics.webp",
      name: "Bharath Chandra",
      course: "Data Analytics Certifcation Course",
      alt: "Data Analytics Certifcation Course",
    },
    {
      id: 418,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Dandu-Anil-Kumar-Full-Stack-Java.webp",
      name: "Anil Kumar",
      course: "Full Stack Java Certifcation Course",
      alt: "Full Stack Java Certifcation Course",
    },

    {
      id: 419,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Dumpeta-Rahul-Full-Stack-java.webp",
      name: "Rahul Dumpeta",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 420,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Eduru-Vyshnavi-Data-Science.webp",
      name: "Vyshnavi Eduru",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 421,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Gali-Swapna-Full-Stack-Java.webp",
      name: "Swapna Gali",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 422,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Girisekhar-Vutukuri-Aws-Devops.webp",
      name: "Girisekhar Vutukuri",
      course: "AWS DevOps Certification Course",
      alt: "AWS DevOps Certification Course",
    },
    {
      id: 423,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Gorre-Vinay-Full-Stack-Java.webp",
      name: "Vinay Gorre",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 424,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Hunaif-Khan-Data-Science.webp",
      name: "Hunaif Khan",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 425,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Jayanthi-Jagannadha-Sandeep-Data-Science.webp",
      name: "Jayanthi Jagannadha Sandeep",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 426,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Kakkerla-Akshaysai-Full-Stack-Java.webp",
      name: "Akshaysai Kakkerla",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 427,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Kanchi-Muniraja-Full-Stack-Python.webp",
      name: "Muniraja Kanchi",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },

    {
      id: 428,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Komma-Sai-Kiran-Full-Stack-Java.webp",
      name: "Sai Kiran Komma",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 429,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Konnela-Revanth-Reddy-Data-Science.webp",
      name: "Revanth Reddy Konnela",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 430,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Koradala-Kiran-Full-Stack-Java.webp",
      name: "Kiran Koradala",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 431,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Lalsahebgari-Firoz-Rafi-Full-Stack-Java.webp",
      name: "Lalsahebgarifi roz Rafi",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    
    {
  id: 433,
  imgUrl:
    "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/malliboyina-dhilli-fullstackjava.webp",
  name: "Dhilli Malliboyina",
  course: "Full Stack Java Certification Course",
  alt: "Full Stack Java Certification Course",
},

    {
      id: 434,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Mandla-Arun-Full-Stack-Java.webp",
      name: "Arun Mandla",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 435,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Mangalu-Lokesh-Data-Science.webp",
      name: "Lokesh Mangalu",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 436,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Mekala-Nagaswetha-Full-Stack-Python.webp",
      name: "Nagaswetha Mekala",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 437,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Mohammed-Abrar-Ali-Aws-Devops.webp",
      name: "Abrar Ali Mohammed",
      course: "AWS DevOps Certification Course",
      alt: "AWS DevOps Certification Course",
    },
    {
      id: 438,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Mohammed-Rizwan-Aws-Devops.webp",
      name: "Rizwan Mohammed",
      course: "AWS DevOps Certification Course",
      alt: "AWS DevOps Certification Course",
    },
    {
      id: 439,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Mohammed-Shargil-Ahmed-AutoCad-Bim-Sketchup.webp",
      name: "Shargil Ahmed Mohammed",
      course: "AutoCAD BIM SketchUp Certification Course",
      alt: "AutoCAD BIM SketchUp Certification Course",
    },
    {
      id: 440,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Mora-Sindhuja-Full-Stack-Java.webp",
      name: "Sindhuja Mora",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 441,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Mupparapu-Naveen-Full-Stack-Python.webp",
      name: "Naveeen Mupparapu",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 442,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Naresh-Kumar-Chinthala-Website-Designing-Certification-Programe.webp",
      name: "Naresh Kumar Chinthala",
      course: "Website Designing Certification Program",
      alt: "Website Designing Certification Program",
    },
    {
      id: 443,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Pachigolla-Pavan-Malleswararoa-Full-Stack-Python.webp",
      name: "Pavan Malleswararao Pachigolla",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 444,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Pagadala-Lavanya-Full-Stack-Java.webp",
      name: "Lavanya Pagadala",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 445,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Philips-G-Website-Designing-Certification-Programe.webp",
      name: "Philips G",
      course: "Website Designing Certification Program",
      alt: "Website Designing Certification Program",
    },

    {
      id: 446,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/posimetti-venakataramu-fullstackjava.webp",
      name: "Venakataramu Posimetti",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 447,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Rajagiri-Bharath-Full-Stack-Java.webp",
      name: "Bharath Rajagiri",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 448,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Srinivas-Shinde-Data-Science.webp",
      name: "Srinivas Shinde",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 449,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Tadepalli-Krishnasri-Sravan-Data-Science.webp",
      name: "Krishnasri Sravan Tadepalli",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 450,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Vandhanapu-Manivardhan-Full-Stack-Java.webp",
      name: "Manivardhan Vandhanapu",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 451,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Vanka-Swwthanjali-AutoCad-3Dsmax-with-vray.webp",
      name: "Swetha anjali Vanka",
      course: "AutoCAD 3Ds Max with V-Ray Certification Course",
      alt: "AutoCAD 3Ds Max with V-Ray Certification Course",
    },
    {
      id: 452,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Varshitha-Madanala-Aws-Devops.webp",
      name: "Varshitha Madanala",
      course: "AWS DevOps Certification Course",
      alt: "AWS DevOps Certification Course",
    },
    {
      id: 453,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Vatti-Kulla-Giridhar-Full-Stack-Python.webp",
      name: "Giridhar Vatti Kulla",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 454,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Yarramsetti-Raviteja-Aws-Devops.webp",
      name: "Raviteja Yarramsetti",
      course: "AWS DevOps Certification Course",
      alt: "AWS DevOps Certification Course",
    },
    {
      id: 455,
      imgUrl:
        "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Yemparala-Nithin-data-Analytics.webp",
      name: "Nithin Yemparala",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 280,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/gudi_nikhitha_fullstackpython.webp",
      name: "Nikhitha",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 281,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Gudipalli _mounika_VLSI.webp",
      name: "Mounika",
      course: "VLSI Certification Course",
      alt: "VLSI Certification Course",
    },
    {
      id: 282,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/harshavardhini-full-stack-python.webp",
      name: "Harshavardhini",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 283,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/hemanth-autocad.webp",
      name: "Hemanth",
      course: "Autocad Certification Course",
      alt: "Autocad Certification Course",
    },
    {
      id: 284,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/hemanth-kumar-data-science.webp",
      name: "Hemanth Kumar",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 285,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/indoori_pranaykumar_skethup_with_vray.webp",
      name: "Pranaykumar",
      course: "Sketchup with Vray Certification Course",
      alt: "Sketchup with Vray Certification Course",
    },
    {
      id: 286,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/jangilishiva_subramanyam_fullstack_java.webp",
      name: "Subramanyam",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 287,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/k_anil_sapfico.webp",
      name: "Anil",
      course: "Sap Fico Certification Course",
      alt: "Sap Fico Certification Course",
    },
    {
      id: 288,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kandlakoya_kaveri_AWS_DEVOPS.webp",
      name: "kaveri",
      course: "AWS And Devops Certification Course",
      alt: "AWS And Devops Certification Course",
    },
    {
      id: 289,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kaniganti_harika_SAPFICO.webp",
      name: "Harika",
      course: "Sap Fico Certification Course",
      alt: "Sap Fico Certification Course",
    },
    {
      id: 290,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/karanji_padma_autocad_BIM_skethchup.webp",
      name: "Padma",
      course: "BIM Sketchup Certification Course",
      alt: "BIM Sketchup Certification Course",
    },
    {
      id: 291,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Karasala_Amosu_DATA_SCIENCE.webp",
      name: "Amosu",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 292,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/karthik-kumar-data-science.webp",
      name: "karthik kumar",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 293,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kavya-full-stack-java.webp",
      name: "Kavya",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 294,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/keerthana-aws-devops.webp",
      name: "Keerthana",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 295,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/keerthana-full-stack-java.webp",
      name: "Keerthana",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 296,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Kola_Vivek_vardhan_fullstackjava.webp",
      name: "Vivek vardhan",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 297,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kothireddy-vishawanthareddy-fullstackpython.webp",
      name: "vishawantha reddy",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 298,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/k-sagarvarma-fullstackpython.webp",
      name: "Sagar varma",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 299,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kummari-srisharan-fullstackpython.webp",
      name: "Sri sharan",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 300,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kunalaryan-sapfico.webp",
      name: "kunalaryan",
      course: "Sap Fico Certification Course",
      alt: "Sap Fico Certification Course",
    },
    {
      id: 301,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/kunchala-ashok-data-analytics.webp",
      name: "Ashok",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 302,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/lakshman-kumar-data-analytics.webp",
      name: "Lakshman Kumar",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 303,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/laskshmipriya-fullstackpython.webp",
      name: "Laskshmi Priya",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 304,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/lavankumar-aws-devops.webp",
      name: "Lavan kumar",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 305,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/M_manasareddy_fullstackjava.webp",
      name: "Manasa Reddy",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 306,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/m_pravalika_vlsi.webp",
      name: "pravalika",
      course: "VLSI Certification Course",
      alt: "VLSI Certification Course",
    },
    {
      id: 307,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/maddela-akshaykumar-fullstackjava.webp",
      name: "Akshay Kumar",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 308,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Madugula_haritha_DATA_SCIENCE.webp",
      name: "Haritha",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 309,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mahendar-full-stack-java.webp",
      name: "Mahendar",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 310,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mainkanth-aws-devops.webp",
      name: "Mainkanth",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 311,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/malliboyina-dhilli-fullstackjava.webp",
      name: "Dhilli",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 312,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/malloju_vaishnavi_fullstackpython.webp",
      name: "Vaishnavi",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 313,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/manam_jyothi_TESTING_MANUAL_AUTOMATION.webp",
      name: "Jyothi",
      course: "Testing Manual Automation Certification Course",
      alt: "Testing Manual Automation Certification Course",
    },
    {
      id: 314,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/manikanta-uppla-aws-devops.webp",
      name: "Manikanta",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 315,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/manthangoud-saisree-datascience.webp",
      name: "Saisree",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 316,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/M_manasareddy_fullstackjava.webp",
      name: "Manasa Reddy",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 317,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/margam-sanjaykumar-fullstackpython.webp",
      name: "Sanjaykumar",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 318,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mathi_bhavyasri_tulasi_AWS_DEVOP.webp",
      name: "Bhavyasri Tulasi",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 319,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/MD_fayaz_Autocad.webp",
      name: "Fayaz",
      course: "Autocad Certification Course",
      alt: "Autocad Certification Course",
    },
    {
      id: 320,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/md-suleman-autocad-bim.webp",
      name: "Suleman",
      course: "Autocad And Bim Certification Course",
      alt: "Autocad And Bim Certification Course",
    },
    {
      id: 321,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/meghana-full-stack-java.webp",
      name: "Meghana",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 322,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mohammed-mufeeq-primavera-quantity.webp",
      name: "Mohammed Mufeeq",
      course: "Primavera Quantity Certification Course",
      alt: "Primavera Quantity Certification Course",
    },
    {
      id: 323,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mohd_asif_DATA_science.webp",
      name: "Asif",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 324,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/momidi-udaykiran-fullstackpython.webp",
      name: "Udaykiran",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 325,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/mondi_viswantha_Data_science.webp",
      name: "Viswantha",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 326,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/muppalla_yaswanth_aws_devops.webp",
      name: "Yaswanth",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 327,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nalitham_haripriya_AWS_DEVOPS.webp",
      name: "Haripriya",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 328,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Nandikanti_ajaykumar_fullstackjava.webp",
      name: "Ajaykumar",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 329,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/Nandini_mukurala_fullstackjava.webp",
      name: "Nandini",
      course: "Full Stack java Certification Course",
      alt: "Full Stack java Certification Course",
    },
    {
      id: 330,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nandini-sap-mm.webp",
      name: "Nandini",
      course: "Sap-MM Certification Course",
      alt: "Sap-MM Certification Course",
    },
    {
      id: 331,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/narayanapuram_shiva_krishna_full_stack_python.webp",
      name: "Shiva Krishna",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 332,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/naresh_bairagai_Fullstackjava.webp",
      name: "Naresh",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 333,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/naveen-kumar-full-stack-java.webp",
      name: "Naveen Kumar",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 334,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/navya_jain_digital_marketing.webp",
      name: "Navya",
      course: "Digital Marketing Certification Course",
      alt: "Digital Marketing Certification Course",
    },
    {
      id: 335,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nikhila-data-science.webp",
      name: "Nikhila",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 336,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nikhil-data-science.webp",
      name: "Nikhil",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 337,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/nishant-fatima-aws-devops.webp",
      name: "Nishant",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 338,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/P_shravankumar_fullstackjava.webp",
      name: "shravankumar",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 339,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/palanti_sumanth_DATA_science.webp",
      name: "Sumanth",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 340,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pamidimalla_udayakiran_fullstack_java.webp",
      name: "Uday Kiran",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 341,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pattem_saipriya_fullstackpython.webp",
      name: "Sai Priya",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 342,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/penke_vinay_fullstack_python.webp",
      name: "Vinay",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 343,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/pilli-gangothri-full-stack-python.webp",
      name: "Gangothri",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 344,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/poojitha-bollina-full-stack-python.webp",
      name: "Poojitha",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 345,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/poornima-full-stack-python.webp",
      name: "Poojitha",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 346,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/posimetti-venakataramu-fullstackjava.webp",
      name: "venakata ramu",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 347,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/prachi-narendra-ghonmode-aws-devops.webp",
      name: "Narendra",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 348,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/praveen-data-analytics.webp",
      name: "Praveen",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 349,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/R_sreenuvas_reddy_autocad_BIM_REVIT_SKETCHUP.webp",
      name: "Sreenuvas Reddy",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 350,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ragi-rakesh-full-stack-java.webp",
      name: "Rakesh",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 351,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ramancha-veerendhra-digitalmarketing.webp",
      name: "Veerendhra",
      course: "Digital Marketing Certification Course",
      alt: "Digital Marketing Certification Course",
    },
    {
      id: 352,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/ravalika-ponnam-fullstackpython.webp",
      name: "Ravalika",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 353,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/S_ramya_DATASCIENCE.webp",
      name: "Ramya",
      course: "Data Science Certification Course",
      alt: "Data Science Certification Course",
    },
    {
      id: 354,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/S_Rishi_kethan_fullstackjava.webp",
      name: "Rishi kethan",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 355,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/S_sarathchandresh_reddy_AWSDEVOPS.webp",
      name: "Viswantha",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 356,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/s_sreeja_FULLSTACKJAVA.webp",
      name: "Sreeja",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },
    {
      id: 357,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/sahil-ahmed-data-analytics.webp",
      name: "Sahil Ahmed",
      course: "Data Analytics Certification Course",
      alt: "Data Analytics Certification Course",
    },
    {
      id: 358,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/T_Hanti_rakesh_fullstackpython.webp",
      name: "Rakesh",
      course: "Full Stack Python Certification Course",
      alt: "Full Stack Python Certification Course",
    },
    {
      id: 359,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/y-veerababu-aws-devops.webp",
      name: "Veerababu",
      course: "Aws And Devops Certification Course",
      alt: "Aws And Devops Certification Course",
    },
    {
      id: 360,
      imgUrl: "https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/img/alumni/vidyvarthi-full-stack-java.webp",
      name: "Vidyavarthi",
      course: "Full Stack Java Certification Course",
      alt: "Full Stack Java Certification Course",
    },

  ];
  return (
    <>
      <div className="main_container flex flex-col mb-8">
        <div className="text-center flex flex-col items-center gap-y-6 lg:gap-y-10">
          {/* <div className="3xl:text-[2.5rem] 2xl:text-[2rem] xl:text-[1.8rem] lg:text-[1.6rem] text-[1.4rem] font-bold text-center my-4">
      <span className="inline-block border-b-2 border-[#2A619D] text-[#2A619D] px-2">
            Alumni
          </span>
        </div> */}
          <div className="flex justify-center items-center w-full">
            <div className="relative w-fit flex flex-col ">
              <h1 className="mt-6 font-semibold text-[1rem] lg:text-[1.8rem] xl:text-[2rem] 2xl:text-[2rem] 3xl:text-[2.5rem] leading-[48px] tracking-[-0.014em] flex justify-center">
                <span className="text-[#2A619D]"> Alumni</span>
              </h1>
              <svg
                className="mt-6 absolute top-9 w-full h-auto " // Increased width and height
                viewBox="0 0 110 12"
              >
                <path
                  d="M0 10 Q80 -2 190 27"
                  stroke="orangered"
                  strokeWidth="1.2"
                  fill="transparent"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-11 w-full">
            <div className="col-span-11 xl:col-span-10 2xl:col-span-6">
              <div className="w-[80%] 2xl:w-[68%]  mx-auto h-full relative">
                <Image
                  className="w-full h-full"
                  width={400}
                  height={100}
                  src={man_using_tech}
                  alt="image"
                />
                <div className="bg-white border border-black h-12 w-32 md:w-36 lg:h-20 lg:w-56 xl:w-64 xl:h-20 2xl:h-[70px] 2xl:w-64 3xl:h-[74px] 3xl:w-72 rounded-t-lg rounded-r-lg absolute top-[15%] left-[70%] lg:left-[70%] xl:left-[70%] 2xl:left-[70%] flex">
                  <div className="w-1/3 h-full flex justify-center items-center">
                    <Image
                      width={400}
                      height={100}
                      className="w-4/5 h-5/6 "
                      src={Rectangle_profile_card}
                      alt="image"
                    />
                  </div>
                  <div className="w-2/3 flex flex-col justify-center items-start xl:pl-2">
                    <div className="font-bold text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-xl tracking-normal">
                      swetha&nbsp;dheeraj
                    </div>
                    <div className="text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-xl">
                      Software&nbsp;Developer
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-black flex h-12 w-32 md:w-40 lg:h-20 lg:w-60 xl:w-64 xl:h-20 2xl:h-[70px] 2xl:w-64 3xl:h-24 3xl:w-72 rounded-t-lg rounded-l-lg absolute  top-[36%] 2xl:top-[40%] -left-4">
                  <div className="w-1/4 h-full flex justify-center items-center">
                    <Image
                      width={400}
                      height={100}
                      className="w-2/3 h-2/3 "
                      src={uil_comment}
                      alt="image"
                    />
                  </div>
                  <div className="w-2/3 flex flex-col justify-center items-start xl:pl-2 ">
                    <div className="font-bold text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-xl tracking-normal text-[#FC7C05]">
                      Successful&nbsp;Verified
                    </div>
                    <div className="text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-lg">
                      Your&nbsp;job&nbsp;certification
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-black flex h-14 w-44 md:w-52 lg:h-20 lg:w-80 xl:w-80 xl:h-20 2xl:h-[70px] 2xl:w-80 3xl:h-24 3xl:w-96 rounded-b-lg rounded-r-lg absolute top-[65%] 2xl:left-[56%] lg:left-[53%] xs:left-[54%] xl:left-[62%]">
                  <div className="w-1/4 lg:w-1/3 2xl:w-[30%] h-full flex justify-center items-center">
                    <div className="w-10 h-10 lg:w-14 lg:h-14 relative">
                      <Image
                        width={400}
                        height={100}
                        src={circle_80_alumni}
                        className="w-full h-full"
                        alt="image"
                      />
                      <div className="text-[12px] lg:text-base absolute top-1/2 left-1/2 text-[#5E549B] -translate-x-1/2 -translate-y-1/2">
                        80%
                      </div>
                    </div>
                  </div>
                  <div className="w-3/4 lg:w-2/3 xl:w-[70%] 3xl:w-[62%] flex flex-col justify-center items-start">
                    <div className="font-bold text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-xl tracking-normal text-[#FC7C05]">
                      Your&nbsp;job&nbsp;experience
                    </div>
                    <div className="text-[10px] md:text-[10px] lg:text-base xl:text-md 2xl:text-base 3xl:text-lg">
                      Tell&nbsp;us&nbsp;about&nbsp;your experience
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-11  xl:col-span-10 2xl:col-span-5 lg:col-span-10 xs:w-[100%] xs:p-4 3xl:mt-14 main_container">
              <div className="w-full mt-4 ">
                <div className="mb-1 font-bold lg:text-[32px] xs:text-[20px] sm:px-6 xl:px-16 2xl:px-0 text-left ">
                  Teks Offers India’s No. 1 Alumni Network
                </div>
                <div className="lg:text-[18px] sm:text-[12px] p-2 font-normal sm:px-6 xl:px-16 2xl:px-0 text-justify">
                  Over the past 14 years, we have proudly dedicated ourselves to
                  shaping careers and empowering the future of young tech
                  enthusiasts. With a strong commitment to quality education and
                  industry-relevant training, we have successfully trained over
                  48,000 students across more than 30 diverse courses. This
                  remarkable achievement stands as a testament to our passion,
                  consistency, and student-first approach{" "}
                </div>
                <div className="lg:text-[18px] sm:text-[12px] p-2 font-normal  sm:px-6 xl:px-16 2xl:px-0 text-justify">
                  We don’t just offer courses—we build career-ready
                  professionals equipped with the latest skills in Best Full
                  Stack Development, Data Science, AWS DevOps, and more. With a
                  proven track record of placements in top companies, we
                  continue to bridge the gap between learning and employment,
                  empowering students to land their dream jobs. Teks Academy
                  plays a key role in building India’s No.1 Alumni
                  Network—empowering future leaders, entrepreneurs, innovators,
                  and technological change-makers.{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center flex flex-col items-center mt-4 gap-y-8 mb-6">
          <div className="3xl:text-[2.5rem] 2xl:text-[2rem] xl:text-[1.8rem] lg:text-[1.6rem] text-[1.4rem] font-bold text-center my-4">
            <span className="inline-block border-b-2 border-[#2A619D] text-[#2A619D] px-2">
              Our Global Alumni Network
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 px-6 sm:px-2 lg:px-0 lg:gap-x-5 xl:gap-x-4 2xl:gap-x-6 3xl:gap-x-10 w-full pb-6 ">
            {alumniImgaes.map((ele) => {
              return (
                <div
                  key={ele.id}
                  className="mb-2 xl:gap-y-2 w-full  flex justify-center items-center flex-col"
                >
                  <div className="w-full  flex justify-center  items-center">
                    <Image
                      src={ele.imgUrl}
                      className="h-36 sm:h-32 lg:h-36 2xl:h-40 3xl:h-48 w-full rounded-xl"
                      alt="image"
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="w-full flex flex-col justify-around">
                    <div className="text-[12px] font-bold">{ele.name}</div>
                    <div className="text-[12px] text-[#FC7C05] font-bold">
                      {ele.course}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center items-center  text-xl font-normal">
            <button className="bg-[#FE543D] text-white text-md flex justify-center items-center w-fit h-10 p-6 rounded-lg cursor-default ">
              we have created 48K+ Trained student's...
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default alumni;
