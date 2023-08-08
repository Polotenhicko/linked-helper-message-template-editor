import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export function Input({ className, ...other }: React.InputHTMLAttributes<HTMLInputElement>) {
  const classNames = cn(styles.input, className);
  return <input className={classNames} {...other} />;
}
