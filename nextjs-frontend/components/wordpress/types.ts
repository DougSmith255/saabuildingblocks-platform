import React from 'react';

// Button Types
export interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

// Accordion Types
export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: 'default' | 'small' | 'compact';
  className?: string;
}

// Card Types
export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Star Field Types
export interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export interface StarFieldProps {
  starCount?: number;
  className?: string;
}

// Component Export Types
export type {
  ButtonProps as CTAButtonProps,
  ButtonProps as SecondaryButtonProps,
  CardProps as CyberHolographicCardProps,
};
