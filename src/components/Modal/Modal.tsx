import { useEffect } from 'react';
import styles from './Modal.module.css';
import { createPortal } from 'react-dom';

interface IModalProps {
  children: React.ReactNode;
}

const modalEL = document.createElement('div');
const root = document.getElementById('root');

export function Modal({ children }: IModalProps) {
  useEffect(() => {
    if (root) {
      root.append(modalEL);
      return () => {
        modalEL.remove();
      };
    }
  }, [root]);

  return createPortal(children, modalEL);
}
