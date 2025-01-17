import HeadTitle from "@/components/HeadTitle";
import HomeTab from "@/components/HomeTab";
import { withAuthCustomer } from "@/hoc/withAuth";
import CustomerLayout from "@/layout/CustomerLayout";
import React from "react";

const CustomerHome: React.FC = () => {
  return (
    <CustomerLayout>
      <HeadTitle /> 
      <HomeTab />
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerHome);
