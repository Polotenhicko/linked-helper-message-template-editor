import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export function Input({ className, onKeyDown, ...other }: React.InputHTMLAttributes<HTMLInputElement>) {
  const classNames = cn(styles.input, className);

  const handleKeyDownRepeat = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);

    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (e.repeat && !allowedKeys.includes(e.key)) e.preventDefault();
  };

  return <input className={classNames} onKeyDown={handleKeyDownRepeat} {...other} />;
}
