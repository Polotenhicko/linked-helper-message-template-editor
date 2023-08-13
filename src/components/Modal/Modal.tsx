import { createPortal } from 'react-dom';

interface IModalProps {
  children: React.ReactNode;
}

export function Modal({ children }: IModalProps) {
  // all modals push into element #modals
  const modalsEl = document.getElementById('modals');

  return modalsEl && createPortal(children, modalsEl);
}
