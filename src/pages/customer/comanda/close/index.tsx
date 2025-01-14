import { withAuthCustomer } from "@/hoc/withAuth";
import CustomerLayout from "@/layout/CustomerLayout";
import React from "react";

const Page: React.FC = () => {
  return (
    <CustomerLayout>
      <div />
    </CustomerLayout>
  );
};

export default withAuthCustomer(Page);
