import Image from "next/image";
import React from "react";

const HomeCard: React.FC = () => {
  return (
    <div className="h-[320px] w-full max-w-[369px] bg-[#F5F5F5] relative z-[1] flex">
      <Image
        src="/benefits/card.svg"
        alt="benefits"
        quality={100}
        className="relative"
        layout="fill"
        objectFit="cover"
      />
      <div className="flex flex-col justify-end gap-[16px] h-full z-[1] pl-[23px] pr-[24px] pb-[27px]">
        <h1 className="text-[20px] text-white font-[400] m-0 h-[40]">
          Os benefícios de ser do clube DeuQuantas
        </h1>
        <p className="text-[12px] font-[400] text-[#C1C1C1] m-0 h-[32px]">
          Veja os principais benefícios de fazer parte do clube cervejeiro da
          ambev que te dá descontos exclusivos
        </p>
      </div>
    </div>
  );
};

export default HomeCard;
