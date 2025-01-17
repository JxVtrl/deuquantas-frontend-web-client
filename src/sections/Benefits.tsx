import HomeCard from "@/components/HomeCard";
import SectionTitle from "@/components/SectionTitle";
import React from "react";

// import { Container } from './styles';

const Benefits: React.FC = () => {
  return (
    <div
      style={{
        paddingInline: "16px",
      }}
    >
      <SectionTitle title="Saiba mais" />
      <HomeCard />
    </div>
  );
};

export default Benefits;
