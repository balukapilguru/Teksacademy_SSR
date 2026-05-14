
'use client'
import React, { useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';

const Thank_you = 'https://teksacademynewwebsite.s3.ap-south-1.amazonaws.com/assets/thank_you.webp';

const Thankyou = () => {

  useEffect(() => {
    // 🎉 burst effect
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
    });

    // 🌸 continuous falling effect
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);

      confetti({
        particleCount: 10,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });

      confetti({
        particleCount: 10,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

    }, 250);

  }, []);

  return (
    <div className='flex justify-center relative overflow-hidden'>
      <div className='flex justify-center items-center w-[70%]'>
        <div className='flex justify-center items-center flex-col w-[100%] p-1'>
          
          <Image
            height={90}
            width={1500}
            src={Thank_you}
            alt='thankyou'
          />

        </div>
      </div>
    </div>
  );
};

export default Thankyou;
