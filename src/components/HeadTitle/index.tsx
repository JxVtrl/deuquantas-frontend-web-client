import React from "react";
import { HeadTitleProps } from "./HeadTitle.interface";

const HeadTitle: React.FC<HeadTitleProps> = ({
  title = (
    <>
      Bem-vindo ao
      <br />
      <span className="font-[700]">DeuQuantas</span>
    </>
  ),
}) => {
  return (
    <div className="px-[16px]">
      <h1
        className="text-[24px] font-[300] text-black
        leading-[30px] m-0"
      >
        {title}
      </h1>
    </div>
  );
};

export default HeadTitle;
