export interface ComandaCardProps {
  icon: {
    src: () => React.JSX.Element;
    alt: string;
    width: number;
    height: number;
  };
  title: string | React.ReactNode;
  href: string;
}
