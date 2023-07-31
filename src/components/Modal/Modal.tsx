import { useEffect } from 'react';
import styles from './Modal.module.css';
import { createPortal } from 'react-dom';

interface IModalProps {
  children: React.ReactNode;
  className?: string;
}

const modalEL = document.createElement('div');
const root = document.getElementById('root');

export function Modal({ children, className }: IModalProps) {
  useEffect(() => {
    if (root) {
      if (className) modalEL.classList.add(className);
      root.append(modalEL);
      return () => {
        modalEL.remove();
      };
    }
  }, [root]);

  return createPortal(children, modalEL);
}
