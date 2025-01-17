import HeadTitle from "@/components/HeadTitle";
import HomeTab from "@/components/HomeTab";
import { withAuthCustomer } from "@/hoc/withAuth";
import CustomerLayout from "@/layout/CustomerLayout";
import Benefits from "@/sections/Benefits";
import React from "react";

const CustomerHome: React.FC = () => {
  return (
    <CustomerLayout>
      <HeadTitle /> 
      <HomeTab />
      <Benefits />
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerHome);
