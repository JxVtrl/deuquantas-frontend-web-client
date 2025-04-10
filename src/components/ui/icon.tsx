import { LucideIcon, LucideProps } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IconProps extends LucideProps {
  icon: LucideIcon;
  variant?: 'default' | 'outline' | 'solid' | 'gradient';
  size?: number;
  delay?: number;
}

export function Icon({
  icon: Icon,
  variant = 'default',
  size = 24,
  delay = 0,
  className,
  ...props
}: IconProps) {
  const iconVariants = {
    hidden: {
      opacity: 0,
      scale: 0.5,
      x: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: delay,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const gradientVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, margin: '-50px' }}
      whileHover='hover'
      className={cn(
        'inline-flex items-center justify-center',
        variant === 'default' && 'text-brand-yellow',
        variant === 'outline' && [
          'relative',
          'before:absolute before:inset-0',
          'before:bg-gradient-to-r before:from-brand-yellow before:to-brand-yellow/70',
          'before:opacity-20 before:rounded-full',
          'text-brand-yellow',
        ],
        variant === 'solid' &&
          'bg-brand-yellow text-brand-dark rounded-full p-2',
        variant === 'gradient' &&
          'bg-gradient-to-r from-brand-yellow to-brand-yellow/70 text-brand-dark rounded-full p-2',
        className,
      )}
      variants={iconVariants}
    >
      {variant === 'gradient' && (
        <motion.div
          className='absolute inset-0 bg-gradient-to-r from-brand-yellow to-brand-yellow/70 rounded-full'
          variants={gradientVariants}
        />
      )}
      <Icon size={size} strokeWidth={1.5} {...props} />
    </motion.div>
  );
}
