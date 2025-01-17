import React from "react";
import Image from "next/image";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <Image src="/brand/logo.svg" 
        alt="Logo DeuQuantas" 
        width={56} 
        height={24} 
        quality={100} 
        priority
      />
    </div>
  );
};

export default Logo;
