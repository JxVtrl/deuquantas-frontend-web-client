import React from "react";
import { HeadTitleProps } from "./HeadTitle.interface";

const HeadTitle: React.FC<HeadTitleProps> = ({
  title = (
    <>
      Bem-vindo ao
      <br />
      <b>DeuQuantas</b>
    </>
  ),
}) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default HeadTitle;
