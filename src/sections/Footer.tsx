import React from "react";

// import { Container } from './styles';

const Footer: React.FC = () => {
  return (
    <footer className="w-full shadow-md mt-8">
      <p className="text-[12px] text-gray-600 text-center">
        © {new Date().getFullYear()} DeuQuantas. Todos os direitos
        reservados.
      </p>
    </footer>
  );
};

export default Footer;
