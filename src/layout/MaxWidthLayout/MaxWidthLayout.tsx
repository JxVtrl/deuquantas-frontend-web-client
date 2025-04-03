import React from 'react';

interface MaxWidthLayoutProps {
  children: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  classNameContent?: string;
}

const MaxWidthLayout: React.FC<MaxWidthLayoutProps> = ({
  children,
  backgroundColor,
  className,
  classNameContent,
}) => {
  return (
    <div style={{ backgroundColor }} className={className}>
      <div
        style={{
          maxWidth: 1024,
          width: '100%',
          margin: '0 auto',
          padding: '0 16px',
          overflowX: 'visible',
        }}
        className={classNameContent}
      >
        {children}
      </div>
    </div>
  );
};

export default MaxWidthLayout;
