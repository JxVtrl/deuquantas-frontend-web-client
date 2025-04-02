import React from 'react';

interface MaxWidthLayoutProps {
  children: React.ReactNode;
  backgroundColor?: string;
  className?: string;
}

const MaxWidthLayout: React.FC<MaxWidthLayoutProps> = ({
  children,
  backgroundColor,
  className,
}) => {
  return (
    <div style={{ backgroundColor }} className={className}>
      <div
        style={{
          maxWidth: 1024,
          width: '100%',
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MaxWidthLayout;
