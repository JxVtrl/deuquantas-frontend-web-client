import React from "react";
import Logo from "@/components/Logo";
import Avatar from "@/components/Avatar";

const Header: React.FC = () => {
  return (
    <header
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        height: "52px",
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 32,
        marginBottom: 16,
        alignItems: "center",
      }}
    >
      <Avatar />
      <Logo />
    </header>
  );
};

export default Header;
