import HomeCard from "@/components/HomeCard";
import SectionTitle from "@/components/SectionTitle";
import React from "react";

// import { Container } from './styles';

const Benefits: React.FC = () => {
  return (
    <div
      style={{
        marginTop: "24px",
      }}
    >
      <SectionTitle title="Saiba mais" />
      <HomeCard />
    </div>
  );
};

export default Benefits;
