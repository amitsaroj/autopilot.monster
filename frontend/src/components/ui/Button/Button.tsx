import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.scss';

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.buttonPrimary,
      secondary: styles.buttonSecondary,
      outline: styles.buttonOutline,
      ghost: styles.buttonGhost,
      destructive: styles.buttonDestructive,
      holographic: styles.buttonHolographic,
      neural: styles.buttonNeural,
      cyber: styles.buttonCyber,
    },
    size: {
      sm: styles.buttonSm,
      md: styles.buttonMd,
      lg: styles.buttonLg,
      xl: styles.buttonXl,
    },
    fullWidth: {
      true: styles.buttonFullWidth,
    },
    glow: {
      true: styles.buttonGlow,
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 
    'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 
    'onDragStart' | 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    glow,
    loading, 
    leftIcon, 
    rightIcon, 
    children, 
    disabled, 
    asChild = false,
    ...props 
  }, ref) => {
    if (asChild) {
      return (
        <motion.div
          ref={ref as React.ForwardedRef<HTMLDivElement>}
          className={buttonVariants({ variant, size, fullWidth, glow, className })}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 0 25px rgba(14, 165, 233, 0.4)"
          }}
          whileTap={{ 
            scale: 0.98 
          }}
          transition={{ 
            duration: 0.2, 
            ease: [0.2, 0, 0, 1] 
          }}
        >
          {loading && (
            <motion.div
              className={styles.loader}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className={styles.loaderIcon} />
            </motion.div>
          )}
          
          {leftIcon && !loading && (
            <span className={styles.leftIcon}>
              {leftIcon}
            </span>
          )}
          
          <span className={styles.content}>
            {children}
          </span>
          
          {rightIcon && !loading && (
            <span className={styles.rightIcon}>
              {rightIcon}
            </span>
          )}
          
          {variant === 'holographic' && (
            <div className={styles.holographicOverlay} />
          )}
          
          {variant === 'neural' && (
            <div className={styles.particleEffect} />
          )}
        </motion.div>
      )
    }


    return (
      <motion.button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, glow, className })}
        disabled={disabled || loading}
        whileHover={{ 
          scale: disabled || loading ? 1 : 1.02,
          boxShadow: disabled || loading ? undefined : "0 0 25px rgba(14, 165, 233, 0.4)"
        }}
        whileTap={{ 
          scale: disabled || loading ? 1 : 0.98 
        }}
        transition={{ 
          duration: 0.2, 
          ease: [0.2, 0, 0, 1] 
        }}
        {...props}
      >
        {loading && (
          <motion.div
            className={styles.loader}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className={styles.loaderIcon} />
          </motion.div>
        )}
        
        {leftIcon && !loading && (
          <span className={styles.leftIcon}>
            {leftIcon}
          </span>
        )}
        
        <span className={styles.content}>
          {children}
        </span>
        
        {rightIcon && !loading && (
          <span className={styles.rightIcon}>
            {rightIcon}
          </span>
        )}
        
        {/* Holographic effect overlay */}
        {variant === 'holographic' && (
          <div className={styles.holographicOverlay} />
        )}
        
        {/* Particle effect for neural variant */}
        {variant === 'neural' && (
          <div className={styles.particleEffect} />
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
