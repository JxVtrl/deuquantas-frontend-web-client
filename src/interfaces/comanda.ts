export interface ComandaCardProps {
  icon: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  title: string | React.ReactNode;
  href: string;
}
