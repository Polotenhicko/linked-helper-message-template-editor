import React from 'react';
import styles from './Button.module.css';

interface IButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...other }: IButtonProps) {
  return (
    <button className={styles.button} {...other}>
      {children}
    </button>
  );
}
