import React from "react";

// import { Container } from './styles';

const Footer: React.FC = () => {
  return (
    <footer className="w-full shadow-md mt-8">
      <div className="container mx-auto text-center py-4">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} DeuQuantas. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
