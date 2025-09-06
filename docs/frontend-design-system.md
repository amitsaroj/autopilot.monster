# Frontend Design System - Autopilot.monster

## 🎨 Design Philosophy

The Autopilot.monster frontend is built with the precision and craftsmanship of a 20+ year industry expert. Every pixel, animation, and interaction is carefully crafted to deliver a premium, professional experience that instills confidence in our users.

### Core Design Principles

1. **Professional Excellence**: Every component meets enterprise-grade standards
2. **Performance First**: Smooth 60fps animations with optimized rendering
3. **Accessibility**: WCAG 2.1 AA compliant with comprehensive keyboard navigation
4. **Consistency**: Unified design language across all applications
5. **Scalability**: Modular architecture that grows with the platform

## 🏗️ SCSS Architecture (ITCSS + BEM + CSS Modules)

### Folder Structure

```
src/
├── styles/
│   ├── settings/              # Design tokens and variables
│   │   ├── _variables.scss    # Core design tokens
│   │   ├── _colors.scss       # Color palette
│   │   ├── _typography.scss   # Font scales and weights
│   │   ├── _spacing.scss      # Spacing scale
│   │   ├── _motion.scss       # Animation tokens
│   │   └── _breakpoints.scss  # Responsive breakpoints
│   ├── tools/                 # Mixins and functions
│   │   ├── _mixins.scss       # Common mixins
│   │   ├── _functions.scss    # SCSS functions
│   │   └── _responsive.scss   # Responsive helpers
│   ├── generic/               # Reset and base styles
│   │   ├── _reset.scss        # CSS reset
│   │   ├── _typography.scss   # Base typography
│   │   └── _accessibility.scss # Accessibility base styles
│   ├── elements/              # Base HTML elements
│   │   ├── _buttons.scss      # Button base styles
│   │   ├── _forms.scss        # Form element styles
│   │   ├── _links.scss        # Link styles
│   │   └── _tables.scss       # Table styles
│   ├── objects/               # Layout objects
│   │   ├── _layout.scss       # Layout containers
│   │   ├── _grid.scss         # Grid system
│   │   └── _media.scss        # Media objects
│   ├── components/            # Component styles (CSS Modules)
│   │   ├── Button/
│   │   │   ├── Button.module.scss
│   │   │   └── Button.stories.tsx
│   │   ├── Card/
│   │   │   ├── Card.module.scss
│   │   │   └── Card.stories.tsx
│   │   └── ...
│   ├── utilities/             # Utility classes
│   │   ├── _spacing.scss      # Spacing utilities
│   │   ├── _text.scss         # Text utilities
│   │   └── _display.scss      # Display utilities
│   └── themes/                # Theme overrides
│       ├── _dark.scss         # Dark theme
│       └── _light.scss        # Light theme
└── components/
    ├── ui/                    # Reusable UI components
    ├── layout/                # Layout components
    └── features/              # Feature-specific components
```

## 🎨 Design Tokens

### Color System

```scss
// _colors.scss
// Primary Brand Colors
$color-primary-50: #f0f9ff;
$color-primary-100: #e0f2fe;
$color-primary-200: #bae6fd;
$color-primary-300: #7dd3fc;
$color-primary-400: #38bdf8;
$color-primary-500: #0ea5e9;  // Primary
$color-primary-600: #0284c7;
$color-primary-700: #0369a1;
$color-primary-800: #075985;
$color-primary-900: #0c4a6e;

// Secondary Colors
$color-secondary-50: #fefce8;
$color-secondary-100: #fef9c3;
$color-secondary-200: #fef08a;
$color-secondary-300: #fde047;
$color-secondary-400: #facc15;
$color-secondary-500: #eab308;  // Secondary
$color-secondary-600: #ca8a04;
$color-secondary-700: #a16207;
$color-secondary-800: #854d0e;
$color-secondary-900: #713f12;

// Neutral Colors
$color-neutral-50: #f8fafc;
$color-neutral-100: #f1f5f9;
$color-neutral-200: #e2e8f0;
$color-neutral-300: #cbd5e1;
$color-neutral-400: #94a3b8;
$color-neutral-500: #64748b;
$color-neutral-600: #475569;
$color-neutral-700: #334155;
$color-neutral-800: #1e293b;
$color-neutral-900: #0f172a;

// Semantic Colors
$color-success: #10b981;
$color-warning: #f59e0b;
$color-error: #ef4444;
$color-info: #3b82f6;

// Background Colors
$bg-primary: #ffffff;
$bg-secondary: $color-neutral-50;
$bg-tertiary: $color-neutral-100;
$bg-dark: $color-neutral-900;
$bg-overlay: rgba(15, 23, 42, 0.8);

// Text Colors
$text-primary: $color-neutral-900;
$text-secondary: $color-neutral-600;
$text-tertiary: $color-neutral-500;
$text-inverse: #ffffff;
$text-link: $color-primary-600;
$text-link-hover: $color-primary-700;
```

### Typography Scale

```scss
// _typography.scss
// Font Families
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
$font-display: 'Cal Sans', 'Inter', sans-serif;

// Font Weights
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-extrabold: 800;

// Font Sizes (Modular Scale - 1.25)
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
$font-size-3xl: 1.875rem;  // 30px
$font-size-4xl: 2.25rem;   // 36px
$font-size-5xl: 3rem;      // 48px
$font-size-6xl: 3.75rem;   // 60px
$font-size-7xl: 4.5rem;    // 72px

// Line Heights
$line-height-tight: 1.25;
$line-height-snug: 1.375;
$line-height-normal: 1.5;
$line-height-relaxed: 1.625;
$line-height-loose: 2;

// Letter Spacing
$letter-spacing-tighter: -0.05em;
$letter-spacing-tight: -0.025em;
$letter-spacing-normal: 0;
$letter-spacing-wide: 0.025em;
$letter-spacing-wider: 0.05em;
$letter-spacing-widest: 0.1em;
```

### Spacing Scale

```scss
// _spacing.scss
// 8px baseline grid system
$space-0: 0;
$space-1: 0.25rem;   // 4px
$space-2: 0.5rem;    // 8px
$space-3: 0.75rem;   // 12px
$space-4: 1rem;      // 16px
$space-5: 1.25rem;   // 20px
$space-6: 1.5rem;    // 24px
$space-8: 2rem;      // 32px
$space-10: 2.5rem;   // 40px
$space-12: 3rem;     // 48px
$space-16: 4rem;     // 64px
$space-20: 5rem;     // 80px
$space-24: 6rem;     // 96px
$space-32: 8rem;     // 128px
$space-40: 10rem;    // 160px
$space-48: 12rem;    // 192px
$space-56: 14rem;    // 224px
$space-64: 16rem;    // 256px
```

### Motion Tokens

```scss
// _motion.scss
// Animation Durations
$duration-instant: 0ms;
$duration-fast: 150ms;
$duration-normal: 300ms;
$duration-slow: 500ms;
$duration-slower: 700ms;

// Animation Easing
$ease-linear: linear;
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-emphasis: cubic-bezier(0.2, 0, 0, 1);
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

// Animation Delays
$delay-none: 0ms;
$delay-short: 100ms;
$delay-medium: 200ms;
$delay-long: 300ms;
```

### Breakpoints

```scss
// _breakpoints.scss
$breakpoint-xs: 0;
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;

// Container Max Widths
$container-sm: 640px;
$container-md: 768px;
$container-lg: 1024px;
$container-xl: 1280px;
$container-2xl: 1536px;
```

## 🛠️ SCSS Mixins and Functions

### Responsive Mixins

```scss
// _responsive.scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == xs {
    @media (min-width: $breakpoint-xs) { @content; }
  }
  @if $breakpoint == sm {
    @media (min-width: $breakpoint-sm) { @content; }
  }
  @if $breakpoint == md {
    @media (min-width: $breakpoint-md) { @content; }
  }
  @if $breakpoint == lg {
    @media (min-width: $breakpoint-lg) { @content; }
  }
  @if $breakpoint == xl {
    @media (min-width: $breakpoint-xl) { @content; }
  }
  @if $breakpoint == 2xl {
    @media (min-width: $breakpoint-2xl) { @content; }
  }
}

@mixin respond-below($breakpoint) {
  @if $breakpoint == sm {
    @media (max-width: $breakpoint-sm - 1px) { @content; }
  }
  @if $breakpoint == md {
    @media (max-width: $breakpoint-md - 1px) { @content; }
  }
  @if $breakpoint == lg {
    @media (max-width: $breakpoint-lg - 1px) { @content; }
  }
  @if $breakpoint == xl {
    @media (max-width: $breakpoint-xl - 1px) { @content; }
  }
  @if $breakpoint == 2xl {
    @media (max-width: $breakpoint-2xl - 1px) { @content; }
  }
}
```

### Common Mixins

```scss
// _mixins.scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@mixin truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin line-clamp($lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@mixin focus-ring {
  outline: 2px solid transparent;
  outline-offset: 2px;
  
  &:focus-visible {
    outline: 2px solid $color-primary-500;
    outline-offset: 2px;
  }
}

@mixin button-reset {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
  outline: none;
}

@mixin glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

@mixin shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

@mixin shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@mixin shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

@mixin shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

## 🎭 Animation System

### Framer Motion Configuration

```typescript
// motion.config.ts
import { Variants } from 'framer-motion';

export const motionConfig = {
  // Page Transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.2, 0, 0, 1] }
  },

  // Modal Animations
  modal: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    },
    content: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 },
      transition: { duration: 0.2, ease: [0.2, 0, 0, 1] }
    }
  },

  // List Animations
  listItem: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2 }
  },

  // Hover Animations
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: [0.2, 0, 0, 1] }
  },

  // Tap Animations
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Stagger Animations
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.2, 0, 0, 1] }
};
```

### Lottie Integration

```typescript
// components/animations/LottieAnimation.tsx
import Lottie from 'lottie-react';
import { useTheme } from 'next-themes';

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  className,
  loop = true,
  autoplay = true,
  speed = 1
}) => {
  const { theme } = useTheme();

  return (
    <Lottie
      animationData={animationData}
      className={className}
      loop={loop}
      autoplay={autoplay}
      speed={speed}
      style={{
        filter: theme === 'dark' ? 'invert(1)' : 'none'
      }}
    />
  );
};
```

## 🧩 Component Architecture

### Base Component Structure

```typescript
// components/ui/Button/Button.tsx
import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './Button.module.scss';

const buttonVariants = cva(styles.button, {
  variants: {
    variant: {
      primary: styles.buttonPrimary,
      secondary: styles.buttonSecondary,
      outline: styles.buttonOutline,
      ghost: styles.buttonGhost,
      destructive: styles.buttonDestructive
    },
    size: {
      sm: styles.buttonSm,
      md: styles.buttonMd,
      lg: styles.buttonLg,
      xl: styles.buttonXl
    },
    fullWidth: {
      true: styles.buttonFullWidth
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })}
        disabled={disabled || loading}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
        {...props}
      >
        {loading && <LoadingSpinner className={styles.spinner} />}
        {leftIcon && !loading && <span className={styles.leftIcon}>{leftIcon}</span>}
        <span className={styles.content}>{children}</span>
        {rightIcon && !loading && <span className={styles.rightIcon}>{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
```

### SCSS Module for Button

```scss
// components/ui/Button/Button.module.scss
@import '../../../styles/settings/variables';
@import '../../../styles/tools/mixins';

.button {
  @include button-reset;
  @include flex-center;
  @include focus-ring;
  
  position: relative;
  border-radius: $radius-md;
  font-weight: $font-weight-medium;
  font-family: $font-primary;
  cursor: pointer;
  user-select: none;
  transition: all $duration-normal $ease-out;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.buttonPrimary {
  background: linear-gradient(135deg, $color-primary-500 0%, $color-primary-600 100%);
  color: $text-inverse;
  border: 1px solid $color-primary-600;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, $color-primary-600 0%, $color-primary-700 100%);
    box-shadow: $shadow-md;
  }
  
  &:active:not(:disabled) {
    background: linear-gradient(135deg, $color-primary-700 0%, $color-primary-800 100%);
  }
}

.buttonSecondary {
  background: $color-secondary-500;
  color: $text-inverse;
  border: 1px solid $color-secondary-600;
  
  &:hover:not(:disabled) {
    background: $color-secondary-600;
    box-shadow: $shadow-md;
  }
}

.buttonOutline {
  background: transparent;
  color: $color-primary-600;
  border: 1px solid $color-primary-300;
  
  &:hover:not(:disabled) {
    background: $color-primary-50;
    border-color: $color-primary-400;
  }
}

.buttonGhost {
  background: transparent;
  color: $color-primary-600;
  border: 1px solid transparent;
  
  &:hover:not(:disabled) {
    background: $color-primary-50;
  }
}

.buttonDestructive {
  background: $color-error;
  color: $text-inverse;
  border: 1px solid $color-error;
  
  &:hover:not(:disabled) {
    background: darken($color-error, 10%);
    box-shadow: $shadow-md;
  }
}

.buttonSm {
  padding: $space-2 $space-3;
  font-size: $font-size-sm;
  height: 2rem;
}

.buttonMd {
  padding: $space-3 $space-4;
  font-size: $font-size-base;
  height: 2.5rem;
}

.buttonLg {
  padding: $space-4 $space-6;
  font-size: $font-size-lg;
  height: 3rem;
}

.buttonXl {
  padding: $space-5 $space-8;
  font-size: $font-size-xl;
  height: 3.5rem;
}

.buttonFullWidth {
  width: 100%;
}

.spinner {
  position: absolute;
  left: $space-3;
  width: 1rem;
  height: 1rem;
}

.leftIcon {
  margin-right: $space-2;
}

.rightIcon {
  margin-left: $space-2;
}

.content {
  @include flex-center;
}
```

## 📱 Responsive Design System

### Grid System

```scss
// objects/_grid.scss
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: $space-4;
  padding-right: $space-4;
  
  @include respond-to(sm) {
    max-width: $container-sm;
    padding-left: $space-6;
    padding-right: $space-6;
  }
  
  @include respond-to(md) {
    max-width: $container-md;
  }
  
  @include respond-to(lg) {
    max-width: $container-lg;
  }
  
  @include respond-to(xl) {
    max-width: $container-xl;
  }
  
  @include respond-to(2xl) {
    max-width: $container-2xl;
  }
}

.grid {
  display: grid;
  gap: $space-6;
  
  &--cols-1 { grid-template-columns: repeat(1, 1fr); }
  &--cols-2 { grid-template-columns: repeat(2, 1fr); }
  &--cols-3 { grid-template-columns: repeat(3, 1fr); }
  &--cols-4 { grid-template-columns: repeat(4, 1fr); }
  &--cols-6 { grid-template-columns: repeat(6, 1fr); }
  &--cols-12 { grid-template-columns: repeat(12, 1fr); }
  
  @include respond-below(md) {
    &--cols-2,
    &--cols-3,
    &--cols-4,
    &--cols-6 {
      grid-template-columns: 1fr;
    }
  }
  
  @include respond-to(md) {
    &--cols-3,
    &--cols-4,
    &--cols-6 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @include respond-to(lg) {
    &--cols-4,
    &--cols-6 {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @include respond-to(xl) {
    &--cols-6 {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
```

### Flexbox Utilities

```scss
// utilities/_flex.scss
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }

.flex-1 { flex: 1 1 0%; }
.flex-auto { flex: 1 1 auto; }
.flex-initial { flex: 0 1 auto; }
.flex-none { flex: none; }
```

## 🎨 Theme System

### Dark/Light Theme Implementation

```scss
// themes/_dark.scss
[data-theme='dark'] {
  --color-bg-primary: #{$color-neutral-900};
  --color-bg-secondary: #{$color-neutral-800};
  --color-bg-tertiary: #{$color-neutral-700};
  
  --color-text-primary: #{$color-neutral-100};
  --color-text-secondary: #{$color-neutral-300};
  --color-text-tertiary: #{$color-neutral-400};
  
  --color-border-primary: #{$color-neutral-700};
  --color-border-secondary: #{$color-neutral-600};
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
}

// themes/_light.scss
[data-theme='light'] {
  --color-bg-primary: #{$color-neutral-50};
  --color-bg-secondary: #{$color-neutral-100};
  --color-bg-tertiary: #{$color-neutral-200};
  
  --color-text-primary: #{$color-neutral-900};
  --color-text-secondary: #{$color-neutral-600};
  --color-text-tertiary: #{$color-neutral-500};
  
  --color-border-primary: #{$color-neutral-200};
  --color-border-secondary: #{$color-neutral-300};
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

## ♿ Accessibility Standards

### Focus Management

```scss
// generic/_accessibility.scss
// Focus styles
:focus-visible {
  outline: 2px solid $color-primary-500;
  outline-offset: 2px;
  border-radius: $radius-sm;
}

// Skip links
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: $color-primary-600;
  color: $text-inverse;
  padding: $space-2 $space-4;
  text-decoration: none;
  border-radius: $radius-md;
  z-index: 1000;
  
  &:focus {
    top: 6px;
  }
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

// High contrast mode
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
}
```

### ARIA Support

```typescript
// components/ui/Modal/Modal.tsx
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      
      // Trap focus within modal
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <motion.div
          ref={modalRef}
          className={styles.content}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
```

## 📊 Performance Optimization

### Critical CSS

```scss
// Critical CSS for above-the-fold content
.critical {
  // Hero section styles
  .hero {
    min-height: 100vh;
    @include flex-center;
    background: linear-gradient(135deg, $color-primary-500 0%, $color-primary-700 100%);
  }
  
  // Navigation styles
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
}
```

### Image Optimization

```typescript
// components/ui/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        onLoad={() => setIsLoading(false)}
        className="transition-opacity duration-300"
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};
```

## 🧪 Testing Strategy

### Component Testing

```typescript
// components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="secondary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('buttonSecondary');
  });
});
```

### Visual Regression Testing

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
    'storybook-addon-pseudo-states'
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  },
  staticDirs: ['../public'],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
    }
  }
};

export default config;
```

## 🚀 Build and Deployment

### Next.js Configuration

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true
  },
  sassOptions: {
    includePaths: ['./src/styles']
  },
  images: {
    domains: ['images.unsplash.com', 'cdn.autopilot.monster'],
    formats: ['image/webp', 'image/avif']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  webpack: (config, { dev, isServer }) => {
    // SCSS optimization
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;
```

### PostCSS Configuration

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-nested': {},
    'autoprefixer': {},
    'cssnano': process.env.NODE_ENV === 'production' ? {} : false
  }
};
```

## 📈 Analytics and Monitoring

### Performance Monitoring

```typescript
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export const reportWebVitals = (metric: any) => {
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true
    });
  }
};

// Initialize web vitals
export const initWebVitals = () => {
  getCLS(reportWebVitals);
  getFID(reportWebVitals);
  getFCP(reportWebVitals);
  getLCP(reportWebVitals);
  getTTFB(reportWebVitals);
};
```

---

This comprehensive frontend design system provides the foundation for building a production-ready, professional-grade marketplace platform. The system emphasizes performance, accessibility, and maintainability while delivering a premium user experience that reflects the quality of a 20+ year industry expert's work.
