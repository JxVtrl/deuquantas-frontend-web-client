import React from "react";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";

const Header: React.FC = () => {
  return (
    <header className="w-full shadow-md">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          padding: 16,
        }}
      >
        <Avatar />
        <Logo />
      </div>
    </header>
  );
};

export default Header;
