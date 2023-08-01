import React from 'react';
import styles from './Button.module.css';
import { cn } from '../../utils/cn';

interface IButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function Button({ children, className, ...other }: IButtonProps) {
  const classNames = cn(styles.button, className ? className : '');
  return (
    <button className={classNames} {...other}>
      {children}
    </button>
  );
}
